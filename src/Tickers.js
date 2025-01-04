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

function Icon({ isNegative }) {
  if (isNegative) {
    return <ImArrowDown size=".8em" color="#e74c3c" />;
  }

  return <ImArrowUp size=".8em" color="#2ecc71" />;
}

function Ticker({ current, shares, averageCost, image, lots, ...rest }) {
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

export default function Tickers({ data, name }) {
  const stocksSum = sumStocks(data);
  const investmentAmount = sumInvestmentAmount(data);
  const investmentDifference = stocksSum - investmentAmount;
  const percentChange = (investmentDifference / investmentAmount) * 100;
  const isNegative = investmentDifference < 0;

  if (data.length === 0) {
    return "Loading...";
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
          return <Ticker {...stock}></Ticker>;
        })}
      </TickerTableContainer>
    </Container>
  );
}
