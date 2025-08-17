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
  background: ${(p) => `linear-gradient(135deg, ${p.$color} 0%, #0f1824 70%)`};
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
  gap: 14px;
  padding: 0 24px 10px;
`;

const MetricCard = styled.div`
  flex: 1 1 180px;
  background: #ffffff15;
  border: 1px solid #ffffff25;
  padding: 14px 16px 18px;
  border-radius: 16px;
  color: #fff;
  position: relative;
  overflow: hidden;
  min-width: 150px;
`;

const MetricLabel = styled.div`
  font-size: 0.65rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.75;
`;

const MetricValue = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  margin-top: 4px;
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

export default function PortfolioView({ id, onBack }) {
  const portfolio = getPortfolioById(id);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <Wrapper $color={portfolio.color}>
      <HeaderBar>
        <BackBtn aria-label="Back" onClick={onBack}>
          <ImArrowLeft />
        </BackBtn>
        <Title>{portfolio.name}'s Portfolio</Title>
      </HeaderBar>

      <MetricsStrip>
        <MetricCard>
          <MetricLabel>Total Value</MetricLabel>
          <MetricValue>${total.toFixed(2)}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>Invested</MetricLabel>
          <MetricValue>${invested.toFixed(2)}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>Change</MetricLabel>
          <MetricValue style={{ color: negative ? "#e74c3c" : "#2ecc71" }}>
            {negative ? "-" : ""}${Math.abs(delta).toFixed(2)}
          </MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>Change %</MetricLabel>
          <MetricValue style={{ color: negative ? "#e74c3c" : "#2ecc71" }}>
            {negative ? "-" : ""}
            {Math.abs(pct).toFixed(2)}%
          </MetricValue>
        </MetricCard>
      </MetricsStrip>

      <Content>
        {loading ? (
          <Loading>Loading live prices…</Loading>
        ) : (
          <Tickers data={stocks} name={portfolio.name} condensed />
        )}
      </Content>
    </Wrapper>
  );
}
