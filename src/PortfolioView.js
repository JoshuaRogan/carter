import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getPortfolioById } from "./portfolios";
import { enrichStocks, sumStocks, sumInvestmentAmount } from "./stocks";
import Tickers from "./Tickers";
import { ImArrowLeft } from "react-icons/im";

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${(p) =>
    `linear-gradient(135deg, ${p.$color} 0%, #f3fbe6 25%, #e6f6ff 65%, #fef9e3 100%)`};
  position: relative;
`;

const HeaderBar = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 22px 10px;
  color: #fff;
  position: sticky;
  top: 0;
  backdrop-filter: blur(8px);
`;

const BackBtn = styled.button`
  background: #ffffff20;
  border: 1px solid #ffffff35;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  cursor: pointer;
  color: #fff;
  transition:
    background 0.25s,
    transform 0.25s;
  &:hover {
    background: #ffffff35;
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
`;

const Title = styled.h1`
  font-size: clamp(1.2rem, 3vw, 1.9rem);
  margin: 0;
`;

const MetricsStrip = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 4px 24px 14px;
`;

const MetricCard = styled.div`
  flex: 1 1 180px;
  background: linear-gradient(145deg, #ffffff, #f2f9ff 45%, #ecf9f0);
  border: 3px solid #d2e8f3;
  padding: 18px 18px 22px;
  border-radius: 20px;
  color: #233642;
  position: relative;
  overflow: hidden;
  min-width: 150px;
  box-shadow: 0 6px 14px -6px rgba(20, 54, 78, 0.18);
  font-family: "Baloo 2", "Fredoka", "Comic Sans MS", sans-serif;
  &:before {
    content: "\u269C";
    position: absolute;
    right: 10px;
    top: 10px;
    opacity: 0.35;
    font-size: 1.25rem;
    color: #2d6f8c;
  }
`;

const MetricLabel = styled.div`
  font-size: 0.7rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  opacity: 0.75;
  font-weight: 700;
`;

const MetricValue = styled.div`
  font-size: 1.55rem;
  font-weight: 700;
  margin-top: 2px;
`;

const Content = styled.div`
  padding: 10px 20px 60px;
  flex: 1;
`;

const Loading = styled.div`
  padding: 60px 30px;
  text-align: center;
  font-size: 1.1rem;
  opacity: 0.85;
`;

const ViewToggleBtn = styled.button`
  margin-left: auto;
  background: linear-gradient(145deg, #fffbe2, #e2f5ff);
  border: 2px solid #c3e3ef;
  color: #2b4d5e;
  padding: 12px 18px;
  border-radius: 16px;
  font-size: 0.7rem;
  letter-spacing: 0.6px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  transition:
    background 0.25s,
    transform 0.25s;
  font-family: "Baloo 2", "Fredoka", "Comic Sans MS", sans-serif;
  &:hover {
    background: linear-gradient(145deg, #fff4c5, #d8f1ff);
    transform: translateY(-3px) rotate(-1deg);
  }
  &:active {
    transform: translateY(-1px);
  }
`;

export default function PortfolioView({ id, onBack }) {
  const portfolio = getPortfolioById(id);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [condensed, setCondensed] = useState(true); // toggle between compact and detailed

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const enriched = await enrichStocks(portfolio.data);
        if (active) setStocks(enriched);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, portfolio.data]);

  const total = stocks.length ? sumStocks(stocks) : 0;
  const invested = stocks.length ? sumInvestmentAmount(stocks) : 0;
  const delta = total - invested;
  const pct = invested === 0 ? 0 : (delta / invested) * 100;
  const negative = delta < 0;
  const friendlyDeltaLabel = negative ? "Down" : "Up";

  return (
    <Wrapper $color={portfolio.color}>
      <HeaderBar>
        <BackBtn aria-label="Back" onClick={onBack}>
          <ImArrowLeft />
        </BackBtn>
        <Title>{portfolio.name}'s Portfolio</Title>
        <ViewToggleBtn
          type="button"
          aria-pressed={condensed}
          onClick={() => setCondensed((c) => !c)}
          title={condensed ? "Show Bigger Cards" : "Show Small Cards"}
        >
          {condensed ? "Big View 🔍" : "Small View 🧩"}
        </ViewToggleBtn>
      </HeaderBar>

      <MetricsStrip>
        <MetricCard>
          <MetricLabel>Treasure 💰</MetricLabel>
          <MetricValue>${total.toFixed(2)}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>Put In 🪙</MetricLabel>
          <MetricValue>${invested.toFixed(2)}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>{friendlyDeltaLabel} 📈</MetricLabel>
          <MetricValue style={{ color: negative ? "#e74c3c" : "#1e9e52" }}>
            {negative ? "-" : "+"}${Math.abs(delta).toFixed(2)}
          </MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>Growth % 🌱</MetricLabel>
          <MetricValue style={{ color: negative ? "#e74c3c" : "#1e9e52" }}>
            {negative ? "-" : "+"}
            {Math.abs(pct).toFixed(2)}%
          </MetricValue>
        </MetricCard>
      </MetricsStrip>

      <Content>
        {loading ? (
          <Loading>Loading live prices…</Loading>
        ) : (
          <Tickers data={stocks} name={portfolio.name} condensed={condensed} />
        )}
      </Content>
    </Wrapper>
  );
}
