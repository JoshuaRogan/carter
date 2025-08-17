import React from "react";
import styled from "styled-components";
import { ImArrowUp, ImArrowDown } from "react-icons/im";

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
}) {
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

  if (condensed) {
    return (
      <TickerCard>
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
    <TickerContainer aria-label={`${display} detailed performance`}>
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

export default function Tickers({ data, condensed }) {
  if (data.length === 0) {
    return "Loading...";
  }
  if (condensed) {
    return (
      <>
        <CardsGrid>
          {data.map((stock) => (
            <Ticker key={stock.ticker} {...stock} condensed />
          ))}
        </CardsGrid>
      </>
    );
  }
  return (
    <Container>
      <TickerTableContainer>
        {data.map((stock) => (
          <Ticker key={stock.ticker} {...stock} />
        ))}
      </TickerTableContainer>
    </Container>
  );
}
