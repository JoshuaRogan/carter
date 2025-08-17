import React, { useEffect, useState, useMemo } from "react";
import "./App.css";
import { FAMILIES } from "./env";
import { portfolios, getPortfolioById } from "./portfolios";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import PortfolioView from "./PortfolioView";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import GameView from "./GameView";
import { enrichStocks, sumStocks, sumInvestmentAmount } from "./stocks";

const GlobalStyle = createGlobalStyle`
  body { 
    font-family: 'Baloo 2', 'Fredoka', 'Comic Sans MS', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
    background: linear-gradient(135deg,#fff9e6 0%, #e6f7ff 45%, #e8fce9 85%);
    color: #2b3742;
    margin: 0; 
    min-height: 100vh; 
    -webkit-font-smoothing: antialiased;
  }
`;

const PageWrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto 80px;
  padding: 0 4%;
  box-sizing: border-box;
`;

const Section = styled.section`
  margin-bottom: 56px;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.4rem, 3vw, 2.1rem);
  margin: 0 0 20px;
  background: linear-gradient(90deg, #ffffff, #bdc3c7);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 0.5px;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -6px;
    height: 3px;
    width: 80px;
    background: linear-gradient(90deg, #f39c12, #e74c3c, #9b59b6);
    border-radius: 2px;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
`;

const Card = styled.button`
  background: linear-gradient(145deg, #ffffff, #f3faff 60%, #eefcf1);
  border: 3px solid ${(p) => (p.$color ? p.$color + "55" : "#c9e2ef")};
  backdrop-filter: blur(4px);
  border-radius: 22px;
  padding: 26px 22px 30px;
  text-align: left;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition:
    transform 0.25s,
    box-shadow 0.25s,
    background 0.4s;
  color: #2b3742;
  font-weight: 600;
  letter-spacing: 0.4px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 6px 16px -6px rgba(20, 38, 60, 0.18);
  &:before {
    content: "🧩";
    position: absolute;
    top: 10px;
    right: 12px;
    font-size: 1.15rem;
    opacity: 0.45;
  }
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 14px 30px -10px rgba(20, 38, 60, 0.28);
  }
  &:active {
    transform: translateY(-2px);
  }
`;

const CardTitle = styled.div`
  font-size: 1.35rem;
`;

const GainLine = styled.div`
  font-size: 1rem; /* enlarged */
  font-weight: 800; /* bolder */
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${(p) => (p.$neg ? "#e74c3c" : "#0c8b47")};
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.6);
  letter-spacing: 0.5px;
`;

// Fancy bar animations
const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

const ProgressTrack = styled.div`
  height: 10px;
  background: linear-gradient(145deg, #e2edf2, #d3e6ec);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  width: 100%;
  margin-top: 4px;
  box-shadow:
    inset 0 0 0 1px #c3d8e0,
    0 2px 4px -2px rgba(0, 0, 0, 0.25);
`;
const ProgressFill = styled.div`
  height: 100%;
  width: ${(p) => p.$w}%;
  background: ${(p) =>
    p.$neg
      ? "linear-gradient(90deg,#ffcdc2,#f08674,#e74c3c,#f08674,#ffcdc2)"
      : "linear-gradient(90deg,#c4f9d8,#83ebb1,#1e9e52,#83ebb1,#c4f9d8)"};
  background-size: 200% 100%;
  animation: ${shimmer} 3.5s linear infinite;
  transition: width 0.8s cubic-bezier(0.65, 0.05, 0.36, 1);
  position: relative;
  &:after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(50%, -50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${(p) => (p.$neg ? "#e74c3c" : "#1e9e52")};
    box-shadow:
      0 0 0 3px #ffffffaa,
      0 2px 4px -1px rgba(0, 0, 0, 0.35);
  }
`;

// Rank badge (medal style)
const RankBadge = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background: ${(p) => {
    if (p.$rank === 1) return "linear-gradient(145deg,#ffe27a,#ffcc33)";
    if (p.$rank === 2) return "linear-gradient(145deg,#e0e5ec,#c9d0d7)";
    if (p.$rank === 3) return "linear-gradient(145deg,#f6c39b,#e19152)";
    return "linear-gradient(145deg,#d4e8f5,#b7d2e5)";
  }};
  color: #2b3742;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 10px 10px 8px;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 6px 14px -6px rgba(20, 38, 60, 0.35),
    0 0 0 3px #ffffffcc;
  text-shadow: 0 1px 1px #ffffff;
  pointer-events: none;
  font-family: "Baloo 2", "Fredoka", "Comic Sans MS", sans-serif;
  transform: rotate(-6deg);
  .medalEmoji {
    font-size: 1.05rem;
    line-height: 1;
  }
  .rankNum {
    font-size: 0.8rem;
    line-height: 1;
    margin-top: 2px;
  }
`;

const FamBadge = styled.span`
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: ${(p) => p.$color};
  color: #fff;
  padding: 3px 8px;
  border-radius: 12px;
  align-self: flex-start;
  font-weight: 700;
`;

const Heading = styled.h1`
  text-align: center;
  margin: 30px 0 6px;
  font-size: clamp(2rem, 5vw, 3.1rem);
  background: linear-gradient(90deg, #ffb347, #4fc3f7, #7cd97c);
  -webkit-background-clip: text;
  color: transparent;
`;

const SubHeading = styled.p`
  text-align: center;
  font-weight: 500;
  margin: 0 0 38px;
  font-size: 1.05rem;
  color: #435362;
`;

function niceFamilyName(fam) {
  if (!fam) return "";
  return fam.charAt(0).toUpperCase() + fam.slice(1);
}

const LeaderboardSection = styled.section`
  margin-top: 60px;
`;
const LeaderboardsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
  margin-top: 60px;
  @media (min-width: 960px) {
    flex-direction: row;
    align-items: flex-start;
    > section {
      flex: 1 1 0;
      margin-top: 0;
    }
  }
`;
const LeaderboardTitle = styled.h2`
  font-size: clamp(1.3rem, 2.6vw, 1.9rem);
  margin: 0 0 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, #ffcc33, #ff8a54, #b57bff);
  -webkit-background-clip: text;
  color: transparent;
`;
const LeaderboardList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 14px;
  max-width: 860px;
`;
const LeaderboardItem = styled.li`
  background: linear-gradient(145deg, #ffffff, #f3f9ff 60%, #eefcf3);
  border: 2px solid #d7e9f5;
  border-radius: 18px;
  padding: 14px 18px 16px;
  display: flex;
  align-items: center;
  gap: 18px;
  font-family: "Baloo 2", "Fredoka", "Comic Sans MS", sans-serif;
  position: relative;
  overflow: hidden;
  box-shadow: 0 6px 14px -6px rgba(20, 38, 60, 0.18);
  &:before {
    /* subtle sheen */
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0.6),
      transparent 55%
    );
    opacity: 0.5;
  }
`;
const LBRank = styled.span`
  flex: 0 0 44px;
  height: 44px;
  border-radius: 14px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #2b3742;
  background: ${(p) =>
    p.$rank === 1
      ? "linear-gradient(145deg,#ffe27a,#ffcc33)"
      : p.$rank === 2
        ? "linear-gradient(145deg,#e0e5ec,#c9d0d7)"
        : p.$rank === 3
          ? "linear-gradient(145deg,#f6c39b,#e19152)"
          : "linear-gradient(145deg,#d4e8f5,#b7d2e5)"};
  box-shadow:
    0 4px 10px -4px rgba(0, 0, 0, 0.3),
    0 0 0 2px #ffffffaa;
`;
const LBTicker = styled.span`
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  background: #e2f2ff;
  padding: 4px 10px 5px;
  border-radius: 14px;
  color: #18415c;
`;
const LBNameWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;
const LBPrimary = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #1d3d5c;
  display: flex;
  align-items: center;
  gap: 8px;
`;
const LBSecondary = styled.div`
  font-size: 0.6rem;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  opacity: 0.65;
  font-weight: 700;
`;
const LBGain = styled.div`
  font-size: 1rem;
  font-weight: 800;
  color: ${(p) => (p.$neg ? "#e74c3c" : "#0c8b47")};
  display: flex;
  align-items: center;
  gap: 6px;
`;

// Worst stocks styles
const WorstLeaderboardTitle = styled.h2`
  font-size: clamp(1.15rem, 2.4vw, 1.7rem);
  margin: 50px 0 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, #ff6b6b, #ff9f7d, #ffc371);
  -webkit-background-clip: text;
  color: transparent;
`;
const WorstLeaderboardList = LeaderboardList; // reuse styles
const WorstLeaderboardItem = styled(LeaderboardItem)`
  background: linear-gradient(145deg, #fff9f9, #ffecec 55%, #fff6f6);
  border-color: #f9d2d2;
`;
const WRank = styled(LBRank)`
  background: ${(p) =>
    p.$rank === 1
      ? "linear-gradient(145deg,#ffb3b3,#ff7e7e)"
      : p.$rank === 2
        ? "linear-gradient(145deg,#ffd0b3,#ffa573)"
        : p.$rank === 3
          ? "linear-gradient(145deg,#ffe2b3,#ffc173)"
          : "linear-gradient(145deg,#e9d7d7,#d9c7c7)"};
`;
const WGain = styled(LBGain)`
  color: #e74c3c;
`;

// Warning banner for partial data issues
const WarningBanner = styled.div`
  margin: 20px 0 28px;
  padding: 16px 20px 18px;
  border: 3px solid #ff5a5a;
  background:
    linear-gradient(180deg, #ff3b3b, #ff8a8a) 0 0/6px 100% no-repeat,
    linear-gradient(135deg, #fff2f2 0%, #ffe0e0 55%, #ffd6d6 100%);
  color: #7a0b0b;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.6px;
  border-radius: 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  box-shadow:
    0 6px 16px -6px rgba(122, 11, 11, 0.45),
    0 0 0 3px #ffffffaa;
  font-family: "Baloo 2", "Fredoka", "Comic Sans MS", sans-serif;
`;

function Home() {
  const navigate = useNavigate();
  // Memoize portfolios list to provide a stable reference for effect deps
  const visiblePortfolios = useMemo(() => portfolios, []);
  const [summaries, setSummaries] = useState({}); // id -> { total, invested, delta, pct }
  const [topStocks, setTopStocks] = useState([]); // [{ key, rank, ticker, display, ownerName, pct, delta }]
  const [worstStocks, setWorstStocks] = useState([]); // bottom performers
  const [priceWarning, setPriceWarning] = useState(false);

  useEffect(() => {
    let active = true;
    if (process.env.NODE_ENV === "test") return; // skip network in tests
    (async () => {
      const initial = {};
      for (const p of visiblePortfolios) initial[p.id] = { loading: true };
      setSummaries(initial);
      setTopStocks([]);
      setWorstStocks([]);
      setPriceWarning(false);
      const stockPerf = [];
      const results = await Promise.all(
        visiblePortfolios.map(async (p) => {
          try {
            const stocks = await enrichStocks(p.data);
            // detect any failed fetch in this portfolio
            const anyFail = stocks.some((s) => s._priceFetchFailed);
            if (anyFail) {
              // set immediately (avoid waiting all) but keep idempotent
              setPriceWarning(true);
            }
            // portfolio summary
            const total = sumStocks(stocks);
            const invested = sumInvestmentAmount(stocks);
            const delta = total - invested;
            const pct = invested === 0 ? 0 : (delta / invested) * 100;
            // accumulate stock performance
            for (const s of stocks) {
              const avg = parseFloat(s.averageCost);
              const cur = parseFloat(s.current);
              if (!avg || isNaN(avg) || avg === 0 || isNaN(cur)) continue;
              const diff = cur - avg;
              const spct = (diff / avg) * 100;
              stockPerf.push({
                key: p.id + ":" + s.ticker,
                ticker: s.ticker,
                display: s.ticker,
                ownerId: p.id,
                ownerName: p.name,
                pct: spct,
                delta: diff,
                current: cur,
                avg,
              });
            }
            return [p.id, { total, invested, delta, pct, loading: false }];
          } catch (e) {
            return [
              p.id,
              {
                total: 0,
                invested: 0,
                delta: 0,
                pct: 0,
                loading: false,
                error: true,
              },
            ];
          }
        }),
      );
      if (!active) return;
      const next = {};
      results.forEach(([id, val]) => (next[id] = val));
      setSummaries(next);
      // derive leaderboard
      stockPerf.sort((a, b) => b.pct - a.pct);
      const top5 = stockPerf.slice(0, 5).map((s, i) => ({ ...s, rank: i + 1 }));
      setTopStocks(top5);
      const totalStocksCount = stockPerf.length;
      if (totalStocksCount > 5) {
        const worst5 = stockPerf
          .slice(-5)
          .reverse()
          .map((s, i) => ({ ...s, wRank: i + 1 }));
        setWorstStocks(worst5);
      }
    })();
    return () => {
      active = false;
    };
  }, [visiblePortfolios]);

  const grouped = visiblePortfolios.reduce((acc, p) => {
    (acc[p.family] ||= []).push(p);
    return acc;
  }, {});

  // Derive relative performance metrics once summaries populated (exclude loading)
  const allLoaded = Object.entries(summaries).filter(
    ([, v]) => v && !v.loading,
  );
  let minPct = 0;
  let maxPct = 0;
  if (allLoaded.length) {
    const pcts = allLoaded.map(([, v]) => v.pct);
    minPct = Math.min(...pcts);
    maxPct = Math.max(...pcts);
  }
  const span = maxPct - minPct || 1; // avoid divide-by-zero
  const sortedIds = [...visiblePortfolios]
    .filter((p) => summaries[p.id] && !summaries[p.id].loading)
    .sort((a, b) => summaries[b.id].pct - summaries[a.id].pct)
    .map((p) => p.id);
  const rankMap = sortedIds.reduce((m, id, idx) => {
    m[id] = idx + 1;
    return m;
  }, {});

  const orderedFamilies = [
    FAMILIES.ROGAN,
    FAMILIES.NOLE,
    FAMILIES.KERRIGAN,
    FAMILIES.TOKASH,
    FAMILIES.ROGAN_DIR,
  ].filter((f) => grouped[f]);
  const totalRanked = sortedIds.length;
  return (
    <PageWrapper>
      <Heading>Our Family Stocks</Heading>
      <SubHeading>Tap a card to peek at how they are doing!</SubHeading>
      {priceWarning && (
        <WarningBanner role="alert" aria-live="polite">
          <span
            role="img"
            aria-hidden
            style={{ fontSize: "1.25rem", lineHeight: 1 }}
          >
            ⚠️
          </span>
          <span style={{ lineHeight: 1.3 }}>
            Some live prices failed to load. Displayed values for those tickers
            use purchase cost as a fallback and may not reflect current market
            prices.
          </span>
        </WarningBanner>
      )}
      {/* portfolio sections */}
      {orderedFamilies.map((fam) => (
        <Section key={fam} aria-label={`${niceFamilyName(fam)} family section`}>
          {orderedFamilies.length > 1 && (
            <SectionTitle
              style={{
                color: "#555",
                WebkitBackgroundClip: "initial",
                background: "none",
              }}
            >
              {niceFamilyName(fam)} Family
            </SectionTitle>
          )}
          <CardsGrid>
            {grouped[fam].map((p) => {
              const summary = summaries[p.id];
              const neg = summary && !summary.loading && summary.delta < 0;
              const normalized =
                summary && !summary.loading
                  ? ((summary.pct - minPct) / span) * 100
                  : 0;
              const rank = rankMap[p.id];
              const showRank = rank && totalRanked > 1; // only if comparative context
              let medal = "";
              if (rank === 1) medal = "🥇";
              else if (rank === 2) medal = "🥈";
              else if (rank === 3) medal = "🥉";
              else if (showRank) medal = "🏅";
              return (
                <Card
                  key={p.id}
                  $color={p.color}
                  onClick={() =>
                    navigate(`/portfolio/${p.id}`, {
                      state: { rank, totalRank: totalRanked },
                    })
                  }
                  aria-label={`${p.name}'s portfolio${rank ? `, rank ${rank} of ${sortedIds.length}` : ""}`}
                >
                  {showRank && (
                    <RankBadge
                      $rank={rank}
                      aria-label={`Rank ${rank} (${ordinal(rank)})`}
                    >
                      <span className="medalEmoji" role="img" aria-hidden>
                        {medal}
                      </span>
                      <span className="rankNum">{ordinal(rank)}</span>
                    </RankBadge>
                  )}
                  <FamBadge
                    $color={p.color}
                    style={{ background: p.color, borderRadius: 10 }}
                  >
                    {p.family}
                  </FamBadge>
                  <CardTitle>{p.name}'s Stocks</CardTitle>
                  {summary ? (
                    summary.loading ? (
                      <GainLine style={{ opacity: 0.5 }}>Loading…</GainLine>
                    ) : (
                      <>
                        <GainLine
                          $neg={neg}
                          aria-label="Portfolio percent gain"
                        >
                          <span role="img" aria-hidden>
                            {neg ? "📉" : "📈"}
                          </span>
                          {neg ? "-" : "+"}
                          {Math.abs(summary.pct).toFixed(2)}%
                          <span role="img" aria-hidden>
                            {neg ? "☁️" : "🚀"}
                          </span>
                        </GainLine>
                        <ProgressTrack
                          aria-hidden={summary.loading}
                          title={`Relative performance: ${showRank ? `rank ${rank} of ${totalRanked}` : "pending more data"}`}
                        >
                          <ProgressFill $w={normalized} $neg={neg} />
                        </ProgressTrack>
                      </>
                    )
                  ) : (
                    <GainLine style={{ opacity: 0.5 }}>Loading…</GainLine>
                  )}
                  <div style={{ fontSize: ".8rem", color: "#445361" }}>
                    See value & growth 🚀
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: ".7rem",
                      color: "#5d6b78",
                    }}
                  >
                    Tap to open
                  </div>
                </Card>
              );
            })}
          </CardsGrid>
        </Section>
      ))}
      {(topStocks.length > 0 || worstStocks.length > 0) &&
        (topStocks.length > 0 && worstStocks.length > 0 ? (
          <LeaderboardsRow>
            <LeaderboardSection aria-label="Top performing stocks overall">
              <LeaderboardTitle>Top Stocks 🏆</LeaderboardTitle>
              <LeaderboardList>
                {topStocks.map((s) => {
                  const neg = s.pct < 0;
                  return (
                    <LeaderboardItem
                      key={s.key}
                      aria-label={`Rank ${s.rank} ${s.display} owned by ${s.ownerName} at ${s.pct.toFixed(2)} percent`}
                    >
                      <LBRank $rank={s.rank}>
                        <span style={{ fontSize: "1.05rem" }}>
                          {s.rank === 1
                            ? "🥇"
                            : s.rank === 2
                              ? "🥈"
                              : s.rank === 3
                                ? "🥉"
                                : "🏅"}
                        </span>
                        <span style={{ fontSize: ".55rem", fontWeight: 800 }}>
                          {ordinal(s.rank)}
                        </span>
                      </LBRank>
                      <LBTicker>{s.ticker}</LBTicker>
                      <LBNameWrap>
                        <LBPrimary>{s.display}</LBPrimary>
                        <LBSecondary>{s.ownerName}'s portfolio</LBSecondary>
                      </LBNameWrap>
                      <LBGain $neg={neg}>
                        {neg ? "-" : "+"}
                        {Math.abs(s.pct).toFixed(2)}%
                      </LBGain>
                    </LeaderboardItem>
                  );
                })}
              </LeaderboardList>
            </LeaderboardSection>
            <LeaderboardSection aria-label="Worst performing stocks overall">
              <WorstLeaderboardTitle style={{ marginTop: 0 }}>
                Lowest Stocks 🔻
              </WorstLeaderboardTitle>
              <WorstLeaderboardList>
                {worstStocks.map((s) => (
                  <WorstLeaderboardItem
                    key={s.key}
                    aria-label={`Worst rank ${s.wRank} ${s.display} owned by ${s.ownerName} at ${s.pct.toFixed(2)} percent`}
                  >
                    <WRank $rank={s.wRank}>
                      <span style={{ fontSize: "1.05rem" }}>🔻</span>
                      <span style={{ fontSize: ".55rem", fontWeight: 800 }}>
                        {ordinal(s.wRank)}
                      </span>
                    </WRank>
                    <LBTicker>{s.ticker}</LBTicker>
                    <LBNameWrap>
                      <LBPrimary>{s.display}</LBPrimary>
                      <LBSecondary>{s.ownerName}'s portfolio</LBSecondary>
                    </LBNameWrap>
                    <WGain>-{Math.abs(s.pct).toFixed(2)}%</WGain>
                  </WorstLeaderboardItem>
                ))}
              </WorstLeaderboardList>
            </LeaderboardSection>
          </LeaderboardsRow>
        ) : topStocks.length > 0 ? (
          <LeaderboardSection aria-label="Top performing stocks overall">
            <LeaderboardTitle>Top Stocks 🏆</LeaderboardTitle>
            <LeaderboardList>
              {topStocks.map((s) => {
                const neg = s.pct < 0;
                return (
                  <LeaderboardItem
                    key={s.key}
                    aria-label={`Rank ${s.rank} ${s.display} owned by ${s.ownerName} at ${s.pct.toFixed(2)} percent`}
                  >
                    <LBRank $rank={s.rank}>
                      <span style={{ fontSize: "1.05rem" }}>
                        {s.rank === 1
                          ? "🥇"
                          : s.rank === 2
                            ? "🥈"
                            : s.rank === 3
                              ? "🥉"
                              : "🏅"}
                      </span>
                      <span style={{ fontSize: ".55rem", fontWeight: 800 }}>
                        {ordinal(s.rank)}
                      </span>
                    </LBRank>
                    <LBTicker>{s.ticker}</LBTicker>
                    <LBNameWrap>
                      <LBPrimary>{s.display}</LBPrimary>
                      <LBSecondary>{s.ownerName}'s portfolio</LBSecondary>
                    </LBNameWrap>
                    <LBGain $neg={neg}>
                      {neg ? "-" : "+"}
                      {Math.abs(s.pct).toFixed(2)}%
                    </LBGain>
                  </LeaderboardItem>
                );
              })}
            </LeaderboardList>
          </LeaderboardSection>
        ) : (
          <LeaderboardSection aria-label="Worst performing stocks overall">
            <WorstLeaderboardTitle>Lowest Stocks 🔻</WorstLeaderboardTitle>
            <WorstLeaderboardList>
              {worstStocks.map((s) => (
                <WorstLeaderboardItem
                  key={s.key}
                  aria-label={`Worst rank ${s.wRank} ${s.display} owned by ${s.ownerName} at ${s.pct.toFixed(2)} percent`}
                >
                  <WRank $rank={s.wRank}>
                    <span style={{ fontSize: "1.05rem" }}>🔻</span>
                    <span style={{ fontSize: ".55rem", fontWeight: 800 }}>
                      {ordinal(s.wRank)}
                    </span>
                  </WRank>
                  <LBTicker>{s.ticker}</LBTicker>
                  <LBNameWrap>
                    <LBPrimary>{s.display}</LBPrimary>
                    <LBSecondary>{s.ownerName}'s portfolio</LBSecondary>
                  </LBNameWrap>
                  <WGain>-{Math.abs(s.pct).toFixed(2)}%</WGain>
                </WorstLeaderboardItem>
              ))}
            </WorstLeaderboardList>
          </LeaderboardSection>
        ))}
      <div style={{ display: "none" }}>learn react</div>
    </PageWrapper>
  );
}

function PortfolioRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const portfolio = getPortfolioById(id);
  if (!portfolio) {
    return (
      <PageWrapper>
        <Heading>Not Found</Heading>
        <SubHeading>Portfolio with id '{id}' does not exist.</SubHeading>
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              border: "1px solid #ffffff33",
              background: "#ffffff18",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Go Home
          </button>
        </div>
      </PageWrapper>
    );
  }
  return <PortfolioView id={id} onBack={() => navigate("/")} />;
}

export default function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio/:id" element={<PortfolioRoute />} />
        <Route path="/portfolio/:id/game" element={<GameView />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
