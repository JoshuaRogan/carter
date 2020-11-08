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

const NegativePositiveText = styled.span`
  color: ${(props) => (props.isNegative ? "#e74c3c" : "#2ecc71")};
  font-weight: bold;
`;

function Icon({ isNegative }) {
  if (isNegative) {
    return <ImArrowDown size=".8em" color="#e74c3c" />;
  }

  return <ImArrowUp size=".8em" color="#2ecc71" />;
}

function Ticker({ current, shares, averageCost, image }) {
  const avgCost = parseFloat(averageCost);
  const difference = current - averageCost;
  const percentChange = (difference / avgCost) * 100;
  const isNegative = difference < 0;

  return (
    <TickerContainer>
      <TickerImageContainer>
        <TickerImage src={image} />
      </TickerImageContainer>
      <div>
        <strong>{shares}</strong> share{shares === 1 ? "" : "s"}
      </div>
      <div>
        Current Price: <strong>${current}</strong>
      </div>
      <div>
        Purchase Price: <strong>${averageCost}</strong>
      </div>
      <div>
        <Icon isNegative={isNegative} />{" "}
        <strong>
          ${difference.toFixed(2)} ({percentChange.toFixed(2)}%)
        </strong>
      </div>
      <div></div>
    </TickerContainer>
  );
}

export default function Tickers({ data, name }) {
  const stocksSum = sumStocks(data);
  const investmentAmount = sumInvestmentAmount(data);
  const investmentDifference = stocksSum - investmentAmount;
  const percentChange = (investmentDifference / investmentAmount) * 100;
  const isNegative = investmentDifference < 0;
  debugger;

  if (data.length === 0) {
    return "Loading...";
  }

  return (
    <Container>
      <PortfolioName> {name}'s Portfolio </PortfolioName>
      <CartersMoney>${stocksSum}</CartersMoney>
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
