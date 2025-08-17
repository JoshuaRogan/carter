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

function Home() {
  const navigate = useNavigate();
  // Memoize portfolios list to provide a stable reference for effect deps
  const visiblePortfolios = useMemo(() => portfolios, []);
  const [summaries, setSummaries] = useState({}); // id -> { total, invested, delta, pct }

  useEffect(() => {
    let active = true;
    if (process.env.NODE_ENV === "test") return; // skip network in tests
    (async () => {
      const initial = {};
      for (const p of visiblePortfolios) initial[p.id] = { loading: true };
      setSummaries(initial);
      const results = await Promise.all(
        visiblePortfolios.map(async (p) => {
          try {
            const stocks = await enrichStocks(p.data);
            const total = sumStocks(stocks);
            const invested = sumInvestmentAmount(stocks);
            const delta = total - invested;
            const pct = invested === 0 ? 0 : (delta / invested) * 100;
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
