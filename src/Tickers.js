import React from "react";
import styled from "styled-components";
import { ImArrowUp, ImArrowDown } from "react-icons/im";
import { fetchYearHistory } from "./historicalApi";

// Rank badge (reuse style concept from App.js)
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
  font-size: 0.65rem;
  font-weight: 800;
  padding: 8px 8px 6px;
  border-radius: 50%;
  width: 46px;
  height: 46px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 5px 12px -6px rgba(20, 38, 60, 0.35),
    0 0 0 3px #ffffffcc;
  text-shadow: 0 1px 1px #ffffff;
  pointer-events: none;
  font-family: "Baloo 2", "Fredoka", "Comic Sans MS", sans-serif;
  transform: rotate(-6deg);
  z-index: 2;
  .medalEmoji {
    font-size: 0.95rem;
    line-height: 1;
  }
  .rankNum {
    font-size: 0.65rem;
    line-height: 1;
    margin-top: 1px;
  }
`;

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-content: center;
  padding-top: 15px;
`;

const TickerTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  text-align: center;
  @media (max-width: 640px) {
    padding: 0 12px 4px;
    gap: 10px;
  }
`;

const TickerContainer = styled.div`
  /* Neutral pastel styling for detailed (non-condensed) view */
  display: flex;
  flex-direction: column;
  background: linear-gradient(140deg, #ffffff, #f4f9ff 55%, #e9f6ff);
  border: 3px solid #d3e8f4;
  backdrop-filter: blur(4px);
  padding: 26px 28px 32px;
  margin: 24px auto 0;
  border-radius: 26px;
  color: #233042;
  max-width: 860px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 8px 24px -12px rgba(28, 55, 90, 0.25);
  position: relative;
  overflow: hidden;
  transition:
    background 0.35s,
    box-shadow 0.3s,
    transform 0.3s;
  &:before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      160deg,
      rgba(255, 255, 255, 0.6),
      transparent 70%
    );
    pointer-events: none;
  }
  &:after {
    content: "";
  }
  &:hover {
    background: linear-gradient(140deg, #ffffff, #eef6ff 55%, #e3f4ff);
    box-shadow: 0 14px 34px -14px rgba(28, 55, 90, 0.35);
    transform: translateY(-3px);
  }
  @media (max-width: 840px) {
    max-width: calc(100vw - 48px);
  }
  @media (max-width: 640px) {
    padding: 22px 18px 26px;
    border-radius: 22px;
    margin-top: 20px;
    max-width: calc(100vw - 24px);
  }
`;

const TickerImage = styled.img`
  width: 35vw;
  @media (max-width: 768px) {
    width: 50vw;
  }
`;

// New styles for condensed card layout
const CardsGrid = styled.div`
  display: grid;
  /* increased min width for bigger cards */
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 26px; /* more space between larger cards */
  margin-top: 28px;
`;

const TickerCard = styled.div`
  background: linear-gradient(145deg, #ffffffee, #fff6fdee 55%, #f1fbff);
  border: 3px solid #ffe0f299;
  backdrop-filter: blur(5px);
  padding: 24px 22px 26px;
  border-radius: 26px;
  color: #444;
  font-family: "Baloo 2", "Fredoka", "Comic Sans MS", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  line-height: 1.25;
  position: relative;
  overflow: hidden;
  min-height: 250px;
  box-shadow: 0 8px 18px -8px rgba(0, 0, 0, 0.18);
  transition:
    transform 0.25s,
    box-shadow 0.25s,
    background 0.4s,
    rotate 0.35s;
  box-sizing: border-box;
  max-width: 100%;
  &:before {
    content: "🎈";
    position: absolute;
    top: 10px;
    left: 12px;
    font-size: 1.25rem;
    opacity: 0.35;
  }
  &:after {
    content: "⭐";
    position: absolute;
    bottom: 10px;
    right: 14px;
    font-size: 1.15rem;
    opacity: 0.28;
  }
  &:hover {
    transform: translateY(-6px) rotate(-1deg);
    box-shadow: 0 16px 32px -10px rgba(0, 0, 0, 0.25);
  }
  &:active {
    transform: translateY(-2px);
  }
  @media (max-width: 640px) {
    padding: 20px 18px 22px;
    border-radius: 22px;
  }
`;

// Restored: badge for ticker symbol label
const TickerBadge = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  background: #e2f0ff;
  padding: 6px 14px 7px;
  border-radius: 18px;
  align-self: center;
  margin-bottom: 8px;
  backdrop-filter: blur(4px);
  box-shadow:
    0 1px 2px -1px #0004 inset,
    0 0 0 1px #ffffffaa;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  color: #1d3d5c;
  position: relative;
  &:after {
    content: "\\2728";
    margin-left: 6px;
    font-size: 0.75rem;
  }
`;

// New alignment helpers
const LogoSlot = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 84px; /* fixed height for logo area */
  margin-bottom: 4px;
`;

const NameSlot = styled.div`
  width: 100%;
  min-height: 40px; /* reserve space so rows align */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const DisplayName = styled.strong`
  font-size: 1.05rem;
  line-height: 1.15;
  max-width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* allow wrap but cap lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceSlot = styled.div`
  min-height: 54px; /* value + shares line */
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const ChangeSlot = styled.div`
  min-height: 28px; /* change line */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

// Restored styled components used by condensed view
const PriceLine = styled.div`
  font-size: 1.05rem;
  font-weight: 500;
  opacity: 0.92;
  margin-top: 0; /* removed to keep vertical alignment uniform */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const ChangeLine = styled.div`
  font-size: 0.95rem;
  margin-top: 14px;
  font-weight: 650;
  display: flex;
  align-items: center;
  gap: 8px;
`;

/* New styled components for detailed (non-condensed) view */
const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 34px;
  flex-wrap: wrap;
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 18px;
    text-align: center;
  }
`;

const DetailLogoWrap = styled.div`
  width: 140px;
  max-width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px 16px;
  background: #ffffffd9;
  border: 2px solid #ffdff1;
  border-radius: 24px;
  box-shadow: 0 4px 12px -6px rgba(0, 0, 0, 0.18);
  @media (max-width: 640px) {
    width: 120px;
    padding: 10px 12px;
  }
`;

const DetailNameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 160px;
  flex: 1 1 auto;
  @media (max-width: 640px) {
    align-items: center;
    min-width: 0;
  }
`;

const DetailDisplayName = styled.div`
  font-size: clamp(1.35rem, 2.2vw, 1.9rem);
  font-weight: 700;
  letter-spacing: 0.5px;
  line-height: 1.15;
`;

const DetailTickerSymbol = styled.span`
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 1.6px;
  padding: 6px 14px 7px;
  border-radius: 18px;
  background: linear-gradient(135deg, #8fd3fe, #ffe07d, #b5f2c8);
  color: #1d3d5c;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 6px -2px rgba(0, 0, 0, 0.25);
  &:after {
    content: "⚡";
    font-size: 0.85rem;
  }
`;

const DetailValueBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: auto;
  gap: 6px;
  @media (max-width: 640px) {
    align-items: center;
    margin-left: 0;
  }
`;

const BigDollar = styled.div`
  font-size: clamp(1.9rem, 3.2vw, 2.7rem);
  font-weight: 800;
  color: #153552;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
`;

const SharesLine = styled.div`
  font-size: 0.72rem;
  letter-spacing: 0.5px;
  opacity: 0.85;
  color: #5a2554;
`;

const Divider = styled.div`
  height: 2px;
  width: 100%;
  background: linear-gradient(90deg, #ffd9f7, #ffe6c7, #c7f0ff);
  margin: 26px 0 18px;
  border-radius: 2px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px 28px;
  width: 100%;
  margin-top: 4px;
  @media (max-width: 800px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 14px 16px;
  }
`;

const StatCard = styled.div`
  background: linear-gradient(145deg, #ffffff, #f2f9ff 55%, #eef7fa);
  border: 2px solid #d7e9f5;
  padding: 16px 16px 18px;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  font-size: 0.78rem;
  letter-spacing: 0.3px;
  line-height: 1.2;
  box-shadow: 0 4px 12px -8px rgba(0, 0, 0, 0.12);
  &:before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 18px;
    background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.7),
      transparent 70%
    );
    opacity: 0.55;
    pointer-events: none;
  }
  @media (max-width: 640px) {
    padding: 12px 12px 14px;
    font-size: 0.7rem;
    border-radius: 16px;
  }
`;

const StatLabel = styled.div`
  text-transform: uppercase;
  font-size: 0.55rem;
  letter-spacing: 1.3px;
  opacity: 0.75;
  font-weight: 700;
  color: #1d3d5c;
`;

const StatValue = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #233042;
`;

const LotsList = styled.div`
  margin-top: 20px;
  font-size: 0.65rem;
  opacity: 0.65;
  letter-spacing: 0.4px;
  line-height: 1.4;
  word-break: break-word;
  font-family: "Baloo 2", "Fredoka", "Comic Sans MS", sans-serif;
  @media (max-width: 640px) {
    font-size: 0.7rem;
    line-height: 1.3;
    margin-top: 16px;
  }
`;

function Icon({ isNegative }) {
  if (isNegative) {
    return <ImArrowDown size=".8em" color="#e74c3c" />;
  }

  return <ImArrowUp size=".8em" color="#2ecc71" />;
}

function Ticker({
  current,
  shares,
  averageCost,
  image,
  lots,
  display,
  ticker,
  condensed,
  onSelectTicker,
  highlight,
  rank, // new
  totalRanked, // new
}) {
  // Enhanced detailed view state needs to be declared unconditionally
  const [history, setHistory] = React.useState(null);
  React.useEffect(() => {
    if (!condensed) {
      let active = true;
      // Determine earliest lot date if available (normalize & choose true earliest chronologically)
      let earliest = undefined;
      if (lots && Array.isArray(lots) && lots.length) {
        const normalized = lots
          .map((l) => normalizeLotDate(l.date))
          .filter(Boolean);
        if (normalized.length) {
          earliest = normalized.reduce((min, cur) => (cur < min ? cur : min));
        }
      }
      fetchYearHistory(ticker, { since: earliest }).then((h) => {
        if (active) setHistory(h);
      });
      return () => {
        active = false;
      };
    }
  }, [ticker, condensed, lots]);

  const avgCost = parseFloat(averageCost);
  const difference = current - avgCost; // use parsed value
  const percentChange = avgCost ? (difference / avgCost) * 100 : 0;
  const percentChangeDisplay = isFinite(percentChange)
    ? percentChange.toFixed(2)
    : "0.00";
  const isNegative = difference < 0;
  const originalValue = (avgCost * shares).toFixed(2);
  const currentValue = (current * shares).toFixed(2);
  const yourChange = (currentValue - originalValue).toFixed(2);
  const yourChangeIsNegative = yourChange < 0;
  const formattedAverageCost = isNaN(avgCost)
    ? averageCost
    : avgCost.toFixed(2);
  const lotsStrings = [];

  if (lots) {
    for (const lot of lots) {
      lotsStrings.push(`${lot.shares} @ $${lot.price} on ${lot.date}`);
    }
  }

  const medal =
    rank === 1
      ? "🥇"
      : rank === 2
        ? "🥈"
        : rank === 3
          ? "🥉"
          : rank
            ? "🏅"
            : "";

  if (condensed) {
    return (
      <TickerCard
        role="button"
        tabIndex={0}
        onClick={() => onSelectTicker && onSelectTicker(ticker)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectTicker && onSelectTicker(ticker);
          }
        }}
        aria-label={`View detailed performance for ${display}${rank ? `, rank ${rank} of ${totalRanked}` : ""}`}
      >
        {rank && (
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
        <TickerBadge aria-label={`ticker symbol ${ticker}`}>
          {ticker}
        </TickerBadge>
        <LogoSlot>
          <TickerImage
            src={image}
            style={{ width: 110, maxWidth: 130, height: "auto" }}
            alt={`${display} logo`}
          />
        </LogoSlot>
        <NameSlot>
          <DisplayName>{display}</DisplayName>
        </NameSlot>
        <PriceSlot>
          <PriceLine>
            <div
              style={{ fontWeight: 800, fontSize: "1.2rem", color: "#3b2b55" }}
            >
              ${currentValue}
            </div>
            <div style={{ fontSize: ".75rem", opacity: 0.7, color: "#555" }}>
              {shares} sh @ ${current}
            </div>
          </PriceLine>
        </PriceSlot>
        <ChangeSlot>
          <ChangeLine
            style={{ color: yourChangeIsNegative ? "#e74c3c" : "#1e9e52" }}
          >
            <Icon isNegative={yourChangeIsNegative} />{" "}
            {yourChangeIsNegative ? "-" : "+"}${Math.abs(yourChange)} (
            {percentChangeDisplay}%)
          </ChangeLine>
        </ChangeSlot>
      </TickerCard>
    );
  }

  // Enhanced detailed view
  const formattedCurrentValue = parseFloat(currentValue).toLocaleString(
    undefined,
    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  );

  return (
    <TickerContainer
      aria-label={`${display} detailed performance${rank ? `, rank ${rank} of ${totalRanked}` : ""}`}
      data-ticker={ticker}
      style={
        highlight
          ? {
              boxShadow:
                "0 0 0 4px #ffde89, 0 0 0 8px #ffd36a80, 0 14px 34px -14px rgba(28,55,90,0.35)",
              transform: "translateY(-4px)",
            }
          : undefined
      }
    >
      {rank && (
        <RankBadge $rank={rank} aria-label={`Rank ${rank} (${ordinal(rank)})`}>
          <span className="medalEmoji" role="img" aria-hidden>
            {medal}
          </span>
          <span className="rankNum">{ordinal(rank)}</span>
        </RankBadge>
      )}
      <DetailHeader>
        <DetailLogoWrap>
          <TickerImage src={image} style={{ width: "100%", maxWidth: 150 }} />
        </DetailLogoWrap>
        <DetailNameBlock>
          <DetailDisplayName>{display}</DetailDisplayName>
          <DetailTickerSymbol>{ticker}</DetailTickerSymbol>
        </DetailNameBlock>
        <DetailValueBlock>
          <BigDollar>${formattedCurrentValue}</BigDollar>
          <SharesLine>
            {shares} share{shares === 1 ? "" : "s"} @ ${current}
          </SharesLine>
        </DetailValueBlock>
      </DetailHeader>
      <Divider />
      {/* inline year trend sparkline */}
      {!condensed && history && history.prices && history.prices.length > 0 && (
        <div style={{ margin: "0 0 18px", width: "100%" }}>
          <YearSparkline prices={history.prices} />
        </div>
      )}
      <StatsGrid>
        <StatCard>
          <StatLabel>Change 💥</StatLabel>
          <StatValue
            style={{ color: yourChangeIsNegative ? "#e74c3c" : "#1e9e52" }}
          >
            <Icon isNegative={yourChangeIsNegative} />{" "}
            {yourChangeIsNegative ? "-" : "+"}${Math.abs(yourChange)}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Price Now 🏷️</StatLabel>
          <StatValue>${current}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Put In 💵</StatLabel>
          <StatValue>
            $
            {parseFloat(originalValue).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Bought At 🛒</StatLabel>
          <StatValue>${formattedAverageCost}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Move % 🚀</StatLabel>
          <StatValue style={{ color: isNegative ? "#e74c3c" : "#1e9e52" }}>
            <Icon isNegative={isNegative} /> {percentChange.toFixed(2)}%
          </StatValue>
        </StatCard>
      </StatsGrid>
      {lotsStrings.length > 0 && (
        <LotsList>Lots: {lotsStrings.join(" • ")}</LotsList>
      )}
    </TickerContainer>
  );
}

// Simple sparkline component (no external deps) for year history
function YearSparkline({ prices, height = 120 }) {
  const hasData = prices && prices.length > 0;
  const id = React.useId();
  // small internal right gap so stroke/circle never hug edge; container now has equal outer padding
  const RIGHT_GAP = 2; // percent of SVG width
  const closes = React.useMemo(
    () => (hasData ? prices.map((p) => p.close) : []),
    [hasData, prices],
  );
  const min = hasData ? Math.min(...closes) : 0;
  const max = hasData ? Math.max(...closes) : 0;
  const span = hasData ? max - min || 1 : 1;
  const first = hasData ? prices[0] : null;
  const last = hasData ? prices[prices.length - 1] : null;
  const change = hasData ? last.close - first.close : 0;
  const pct =
    hasData && first.close ? ((change / first.close) * 100).toFixed(2) : "0.00";
  const up = change >= 0;
  const strokeColor = up ? "#1e9e52" : "#e74c3c";
  const fillTo = up ? "#1e9e52" : "#e74c3c";
  // Generate smooth path (quadratic midpoint method)
  const { pathD, areaD } = React.useMemo(() => {
    if (!hasData) return { pathD: "", areaD: "" };
    const denom = closes.length - 1 || 1;
    const pts = closes.map((c, i) => {
      const x = (i / denom) * (100 - RIGHT_GAP);
      const y = 100 - ((c - min) / span) * 100;
      return [x, y];
    });
    if (!pts.length) return { pathD: "", areaD: "" };
    let d = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      d += ` L ${pts[i][0]},${pts[i][1]}`;
    }
    const lastPt = pts[pts.length - 1];
    const area = `${d} L ${lastPt[0]},100 L 0,100 Z`;
    return { pathD: d, areaD: area };
  }, [hasData, closes, min, span]);
  const yTicks = React.useMemo(() => {
    if (!hasData) return [];
    const levels = 5;
    const out = [];
    for (let i = 0; i < levels; i++) {
      const value = min + (span * i) / (levels - 1);
      const y = 100 - ((value - min) / span) * 100;
      out.push({ value, y });
    }
    return out.reverse(); // highest first (top)
  }, [hasData, min, span]);
  const dateTicks = React.useMemo(() => {
    if (!hasData) return [];
    const len = prices.length;
    if (len === 1) return [prices[0].date];
    const idxs = [
      0,
      Math.floor(len * 0.25),
      Math.floor(len * 0.5),
      Math.floor(len * 0.75),
      len - 1,
    ];
    const unique = Array.from(
      new Set(idxs.filter((i) => i >= 0 && i < len)),
    ).sort((a, b) => a - b);
    return unique.map((i) => prices[i].date);
  }, [hasData, prices]);
  const formatTickDate = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    if (!y || !m || !d) return iso;
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const mi = parseInt(m, 10);
    const yy = y.slice(-2);
    return `${monthNames[isNaN(mi - 1) ? 0 : mi - 1]} ${yy}`;
  };
  if (!hasData) {
    return (
      <div
        style={{
          width: "100%",
          background: "linear-gradient(145deg,#ffffff,#f6faff)",
          border: "2px dashed #d7e9f5",
          borderRadius: 18,
          padding: "24px 20px",
          fontSize: 12,
          textAlign: "center",
          opacity: 0.6,
          fontWeight: 600,
        }}
        aria-label="No history data available"
      >
        No history data
      </div>
    );
  }
  return (
    <div
      aria-label={`One year price trend ${up ? "up" : "down"} ${change.toFixed(2)} (${up ? "+" : "-"}${Math.abs(pct)}%)`}
      style={{
        width: "100%",
        background: "linear-gradient(145deg,#ffffff,#f0f8ff)",
        border: "2px solid #cfe4ef",
        borderRadius: 24,
        padding: "18px 60px 22px 60px", // equal horizontal padding so chart doesn't appear to overflow right
        boxShadow: "0 6px 18px -8px rgba(0,0,0,0.12)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Baloo 2",
        boxSizing: "border-box",
      }}
    >
      {/* Y-axis labels */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 12,
          top: 18,
          bottom: 22,
          width: 42,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: 0.5,
          color: "#496273",
        }}
      >
        {yTicks.map((t) => (
          <div
            key={t.y}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              transform: "translateY(2px)",
            }}
          >
            ${t.value.toFixed(2)}
          </div>
        ))}
      </div>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          width: "100%",
          height,
          display: "block",
          boxSizing: "border-box",
        }}
      >
        <defs>
          <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillTo} stopOpacity={0.25} />
            <stop offset="65%" stopColor={fillTo} stopOpacity={0.05} />
            <stop offset="100%" stopColor={fillTo} stopOpacity={0} />
          </linearGradient>
          <linearGradient id={`stroke-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.7} />
            <stop offset="50%" stopColor={strokeColor} stopOpacity={1} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.7} />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <path
          d={areaD}
          fill={`url(#grad-${id})`}
          stroke="none"
          shapeRendering="geometricPrecision"
        />
        {/* Dynamic horizontal grid from ticks */}
        {yTicks.map((t) => (
          <line
            key={t.y}
            x1={0}
            x2={100}
            y1={t.y}
            y2={t.y}
            stroke="#d9e9f1"
            strokeWidth={0.3}
            strokeDasharray="3 4"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {/* Main crisp line (thin, non-scaling) */}
        <path
          d={pathD}
          fill="none"
          stroke={`url(#stroke-${id})`}
          strokeWidth={1.2}
          strokeLinejoin="round"
          strokeLinecap="round"
          shapeRendering="geometricPrecision"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {dateTicks.length > 1 && (
        <div
          aria-hidden
          style={{
            marginTop: 6,
            width: "100%",
            paddingLeft: 0, // rely on parent left padding so ticks sit under chart start
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: 0.5,
            color: "#496273",
            userSelect: "none",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {dateTicks.map((d) => (
            <span key={d}>{formatTickDate(d)}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function normalizeLotDate(raw) {
  if (!raw || typeof raw !== "string") return undefined;
  const parts = raw.split(/[-/]/).map((p) => p.trim());
  if (parts.length !== 3) return undefined;
  let [y, m, d] = parts;
  if (!/^[0-9]{4}$/.test(y)) return undefined;
  // If month > 12 and day <= 12 assume swapped (YYYY-DD-MM)
  const mi = parseInt(m, 10);
  const di = parseInt(d, 10);
  if (mi > 12 && di <= 12) {
    // swap
    const tmp = m;
    m = d;
    d = tmp;
  }
  const monthNum = parseInt(m, 10);
  const dayNum = parseInt(d, 10);
  if (
    isNaN(monthNum) ||
    isNaN(dayNum) ||
    monthNum < 1 ||
    monthNum > 12 ||
    dayNum < 1 ||
    dayNum > 31
  ) {
    return undefined;
  }
  const mm = String(monthNum).padStart(2, "0");
  const dd = String(dayNum).padStart(2, "0");
  // Validate by constructing date
  const dt = new Date(`${y}-${mm}-${dd}T00:00:00Z`);
  if (isNaN(dt.getTime())) return undefined;
  return `${y}-${mm}-${dd}`;
}

export default function Tickers({
  data,
  condensed,
  onSelectTicker,
  focusTicker,
}) {
  // compute ranking map once per data change
  const rankMap = React.useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return {};
    const enriched = data.map((s) => {
      const avg = parseFloat(s.averageCost);
      const pct = avg ? ((s.current - avg) / avg) * 100 : 0;
      return { t: s.ticker, pct };
    });
    enriched.sort((a, b) => b.pct - a.pct);
    const map = {};
    enriched.forEach((e, i) => {
      map[e.t] = i + 1;
    });
    return map;
  }, [data]);
  const totalRanked = Object.keys(rankMap).length;
  React.useEffect(() => {
    if (!condensed && focusTicker) {
      // give layout a tick
      const id = requestAnimationFrame(() => {
        const el = document.querySelector(`[data-ticker="${focusTicker}"]`);
        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }
      });
      return () => cancelAnimationFrame(id);
    }
  }, [condensed, focusTicker]);
  if (data.length === 0) {
    return "Loading...";
  }
  if (condensed) {
    return (
      <>
        <CardsGrid>
          {data.map((stock) => (
            <Ticker
              key={stock.ticker}
              {...stock}
              condensed
              onSelectTicker={onSelectTicker}
              rank={rankMap[stock.ticker]}
              totalRanked={totalRanked}
            />
          ))}
        </CardsGrid>
      </>
    );
  }
  return (
    <Container>
      <TickerTableContainer>
        {data.map((stock) => (
          <Ticker
            key={stock.ticker}
            {...stock}
            onSelectTicker={onSelectTicker}
            highlight={focusTicker === stock.ticker}
            rank={rankMap[stock.ticker]}
            totalRanked={totalRanked}
          />
        ))}
      </TickerTableContainer>
    </Container>
  );
}
