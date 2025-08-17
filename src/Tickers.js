import React from "react";
import { sumStocks, sumInvestmentAmount } from "./stocks";
import styled from "styled-components";
import { ImArrowUp, ImArrowDown } from "react-icons/im";

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-content: center;
  padding-top: 15px;
`;

const PortfolioName = styled.div`
  color: white;
  font-size: 18px;
  text-align: center;
`;

const CartersMoney = styled.div`
  color: white;
  font-size: 10vh;
  flex-basis: 100%;
  justify-self: center;
  align-self: center;
`;

const DeltaAmount = styled.div`
  font-weight: bold;
  font-size: 3vh;
  text-align: center;
`;

const TickerTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  text-align: center;
`;

const TickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 15px;
`;

const TickerImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TickerImage = styled.img`
  width: 35vw;
  @media (max-width: 768px) {
    width: 50vw;
  }
`;

const CurrentValue = styled.div`
  font-size: 1.5em;
`;

const LotsDiv = styled.div`
  font-size: 0.75em;
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
  font-size: 1rem; /* increased base font */
  line-height: 1.25; /* improve readability */
  position: relative;
  overflow: hidden;
  min-height: 250px; /* ensure taller cards */
  box-shadow: 0 4px 14px -4px #0009;
  transition: transform 0.25s, box-shadow 0.25s, background 0.4s;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 34px -12px #000d;
    background: #ffffff28;
  }
`;

const TickerBadge = styled.div`
  font-size: 0.7rem; /* larger */
  letter-spacing: 1.4px;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.9;
  margin-bottom: 8px;
`;

const PriceLine = styled.div`
  font-size: 1.05rem; /* larger */
  font-weight: 500;
  opacity: 0.92;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const ChangeLine = styled.div`
  font-size: 0.95rem; /* larger */
  margin-top: 14px;
  font-weight: 650;
  display: flex;
  align-items: center;
  gap: 8px;
`;

function Icon({ isNegative }) {
  if (isNegative) {
    return <ImArrowDown size=".8em" color="#e74c3c" />;
  }

  return <ImArrowUp size=".8em" color="#2ecc71" />;
}

function Ticker({ current, shares, averageCost, image, lots, display, ticker, condensed, ...rest }) {
  const avgCost = parseFloat(averageCost);
  const difference = current - averageCost;
  const percentChange = (difference / avgCost) * 100;
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
  console.log(rest);

  if (condensed) {
    return (
      <TickerCard>
        <TickerBadge>{ticker}</TickerBadge>
        <TickerImageContainer style={{ marginBottom: 12 }}>
          <TickerImage src={image} style={{ width: '72%', maxWidth: 130 }} />
        </TickerImageContainer>
        <strong style={{ fontSize: '1.05rem', textAlign: 'center', lineHeight: 1.2 }}>
          {display}
        </strong>
        <PriceLine>
          <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>${currentValue}</div>
          <div style={{ fontSize: '.78rem', opacity: .7 }}>{shares} sh @ ${current}</div>
        </PriceLine>
        <ChangeLine style={{ color: yourChangeIsNegative ? '#e74c3c' : '#2ecc71' }}>
          <Icon isNegative={yourChangeIsNegative} /> {yourChangeIsNegative ? '-' : ''}${Math.abs(yourChange)}
        </ChangeLine>
      </TickerCard>
    );
  }

  return (
    <TickerContainer>
      <TickerImageContainer>
        <TickerImage src={image} />
      </TickerImageContainer>
      <CurrentValue>
        <strong>${currentValue}</strong>
      </CurrentValue>
      <div>
        <strong>{shares}</strong> share{shares === 1 ? "" : "s"}
      </div>

      <div>
        Your Change:
        <Icon isNegative={yourChangeIsNegative} />{" "}
        <strong>${yourChange}</strong>
      </div>

      <div>
        Current Price: <strong>${current}</strong>
      </div>
      <div>
        Purchase Price: <strong>${averageCost}</strong>
      </div>

      <div>
        Stock Price Change:
        <Icon isNegative={isNegative} />{" "}
        <strong>
          ${difference.toFixed(2)} ({percentChange.toFixed(2)}%)
        </strong>
      </div>

      <LotsDiv>Lots: {lotsStrings.join(", ")}</LotsDiv>
    </TickerContainer>
  );
}

export default function Tickers({ data, name, condensed }) {
  const stocksSum = sumStocks(data);
  const investmentAmount = sumInvestmentAmount(data);
  const investmentDifference = stocksSum - investmentAmount;
  const percentChange = (investmentDifference / investmentAmount) * 100;
  const isNegative = investmentDifference < 0;

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
      <PortfolioName> {name}'s Portfolio </PortfolioName>
      <CartersMoney>${stocksSum.toFixed(2)}</CartersMoney>
      <DeltaAmount>
        <Icon isNegative={isNegative} /> ${investmentDifference.toFixed(2)} (
        {percentChange.toFixed(2)}%)
      </DeltaAmount>

      <TickerTableContainer>
        {data.map((stock) => {
          return <Ticker key={stock.ticker} {...stock}></Ticker>;
        })}
      </TickerTableContainer>
    </Container>
  );
}
