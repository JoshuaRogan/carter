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
  /* Upgraded styling for individual (non-condensed) detail view */
  display: flex;
  flex-direction: column;
  background: #ffffff12;
  border: 1px solid #ffffff25;
  backdrop-filter: blur(6px);
  padding: 26px 28px 30px;
  margin: 22px auto 0;
  border-radius: 26px;
  color: #fff;
  max-width: 760px;
  width: 100%;
  box-sizing: border-box; /* ensure padding doesn't cause overflow */
  box-shadow: 0 8px 26px -10px #000c;
  position: relative;
  overflow: hidden;
  transition:
    background 0.35s,
    box-shadow 0.3s,
    transform 0.3s;
  overscroll-behavior: contain;
  &:before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 18% 12%, #ffffff2a, transparent 65%);
    opacity: 0.55;
    pointer-events: none;
  }
  &:hover {
    /* subtle lift */
    background: #ffffff18;
    box-shadow: 0 14px 40px -12px #000d;
    transform: translateY(-4px);
  }
  @media (max-width: 840px) {
    max-width: calc(100vw - 48px); /* side gutters */
  }
  @media (max-width: 640px) {
    padding: 18px 16px 22px;
    border-radius: 18px;
    margin-top: 18px;
    max-width: calc(100vw - 24px); /* narrower gutters */
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
  background: #ffffff15;
  border: 1px solid #ffffff30;
  backdrop-filter: blur(5px);
  padding: 22px 22px 24px;
  border-radius: 22px;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  line-height: 1.25;
  position: relative;
  overflow: hidden;
  min-height: 250px;
  box-shadow: 0 4px 14px -4px #0009;
  transition:
    transform 0.25s,
    box-shadow 0.25s,
    background 0.4s;
  box-sizing: border-box; /* prevent internal padding overflow */
  max-width: 100%;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 34px -12px #000d;
    background: #ffffff28;
  }
  @media (max-width: 640px) {
    padding: 18px 18px 22px;
    border-radius: 18px;
  }
`;

// Restored: badge for ticker symbol label
const TickerBadge = styled.div`
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 1.3px;
  text-transform: uppercase;
  background: #ffffff22;
  padding: 4px 10px 5px;
  border-radius: 14px;
  align-self: center; /* center horizontally in card */
  margin-bottom: 6px;
  backdrop-filter: blur(4px);
  box-shadow:
    0 1px 2px -1px #0008 inset,
    0 0 0 1px #ffffff1f;
  display: inline-flex; /* ensure vertical centering */
  align-items: center; /* vertical centering */
  justify-content: center; /* horizontal centering for dynamic width */
  line-height: 1; /* tighter vertical alignment */
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
  padding: 10px 14px;
  background: #ffffff10;
  border: 1px solid #ffffff22;
  border-radius: 20px;
  @media (max-width: 640px) {
    width: 120px;
    padding: 8px 10px;
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
  font-weight: 700;
  letter-spacing: 1.6px;
  padding: 4px 10px 5px;
  border-radius: 14px;
  background: linear-gradient(135deg, #f39c12, #e74c3c, #9b59b6);
  -webkit-background-clip: text;
  color: transparent;
  position: relative;
  &:before {
    content: "";
    position: absolute;
    inset: 0;
    background: #ffffff15;
    border-radius: 14px;
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
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 700;
  background: linear-gradient(90deg, #ffffff, #d5dbe0);
  -webkit-background-clip: text;
  color: transparent;
`;

const SharesLine = styled.div`
  font-size: 0.72rem;
  letter-spacing: 0.5px;
  opacity: 0.75;
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: linear-gradient(90deg, transparent, #ffffff35, transparent);
  margin: 26px 0 14px;
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
  background: #ffffff10;
  border: 1px solid #ffffff18;
  padding: 14px 16px 16px;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  font-size: 0.78rem;
  letter-spacing: 0.3px;
  line-height: 1.2;
  &:before {
    /* subtle glow */
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(145deg, #ffffff18, transparent 75%);
    border-radius: 18px;
    opacity: 0.6;
    pointer-events: none;
  }
  @media (max-width: 640px) {
    padding: 12px 12px 14px;
    font-size: 0.7rem;
    border-radius: 14px;
  }
`;

const StatLabel = styled.div`
  text-transform: uppercase;
  font-size: 0.55rem;
  letter-spacing: 1.3px;
  opacity: 0.65;
  font-weight: 600;
`;

const StatValue = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LotsList = styled.div`
  margin-top: 20px;
  font-size: 0.6rem;
  opacity: 0.55;
  letter-spacing: 0.4px;
  line-height: 1.4;
  word-break: break-word;
  @media (max-width: 640px) {
    font-size: 0.65rem;
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
  expanded,
  onToggle,
}) {
  const avgCost = parseFloat(averageCost);
  const difference = current - averageCost;
  const percentChange = avgCost ? (difference / avgCost) * 100 : 0;
  const percentChangeDisplay = isFinite(percentChange)
    ? percentChange.toFixed(2)
    : "0.00";
  const isNegative = difference < 0;
  const originalValue = (avgCost * shares).toFixed(2);
  const currentValue = (current * shares).toFixed(2);
  const yourChange = (currentValue - originalValue).toFixed(2);
  const yourChangeIsNegative = yourChange < 0;
  const lotsStrings = [];

  if (lots) {
    for (const lot of lots) {
      lotsStrings.push(`${lot.shares} @ $${lot.price} on ${lot.date}`);
    }
  }

  if (condensed) {
    return (
      <TickerCard>
        <TickerBadge style={{ minHeight: 16 }}>{ticker}</TickerBadge>
        <LogoSlot>
          <TickerImage
            src={image}
            style={{ width: 110, maxWidth: 130, height: "auto" }}
          />
        </LogoSlot>
        <NameSlot>
          <DisplayName>{display}</DisplayName>
        </NameSlot>
        <PriceSlot>
          <PriceLine>
            <div style={{ fontWeight: 700, fontSize: "1.15rem" }}>
              ${currentValue}
            </div>
            <div style={{ fontSize: ".78rem", opacity: 0.7 }}>
              {shares} sh @ ${current}
            </div>
          </PriceLine>
        </PriceSlot>
        <ChangeSlot>
          <ChangeLine
            style={{ color: yourChangeIsNegative ? "#e74c3c" : "#2ecc71" }}
          >
            <Icon isNegative={yourChangeIsNegative} />{" "}
            {yourChangeIsNegative ? "-" : ""}${Math.abs(yourChange)} (
            {percentChangeDisplay}%)
          </ChangeLine>
        </ChangeSlot>
      </TickerCard>
    );
  }

  // Enhanced detailed view
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
          <BigDollar>${currentValue}</BigDollar>
          <SharesLine>
            {shares} share{shares === 1 ? "" : "s"} @ ${current}
          </SharesLine>
        </DetailValueBlock>
      </DetailHeader>
      <Divider />
      <StatsGrid>
        <StatCard>
          <StatLabel>Your Change</StatLabel>
          <StatValue
            style={{
              color: yourChangeIsNegative ? "#e74c3c" : "#2ecc71",
            }}
          >
            <Icon isNegative={yourChangeIsNegative} />
            {yourChangeIsNegative ? "-" : ""}${Math.abs(yourChange)}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Current Price</StatLabel>
          <StatValue>${current}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Purchase Price</StatLabel>
          <StatValue>${averageCost}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Stock Price Change</StatLabel>
          <StatValue
            style={{
              color: isNegative ? "#e74c3c" : "#2ecc71",
            }}
          >
            <Icon isNegative={isNegative} /> ${difference.toFixed(2)} (
            {percentChange.toFixed(2)}%)
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
