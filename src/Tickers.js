import React from 'react';
import { sumStocks } from './stocks';
import styled from 'styled-components';

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
`

const CartersMoney = styled.div`
  color: white;
  font-size: 10vh;
  flex-basis: 100%;
  justify-self: center;
  align-self: center;
`;

const TickerTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  text-align: center;
`

const TickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 15px;
`;

const TickerHeader = styled.div`
  font-size: 24px;
`;

const TickerImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const TickerImage = styled.img`
  width: 35vw;
  @media (max-width: 768px) {
    width: 50vw;
  }
`

function Ticker({current, display, ticker, exchange, shares, averageCost, image }) {
    return <TickerContainer>
        <TickerImageContainer>
            <TickerImage src={image} />
        </TickerImageContainer>
        <div>
            <strong>{shares}</strong> share{shares == 1 ? '' : 's'}
        </div>
        <div>
            Current Price <strong>${current}</strong>
        </div>
        <div>

        </div>
    </TickerContainer>
}



export default function Tickers({ data }) {
    const stocksSum = sumStocks(data);
    console.log(stocksSum);


    if (data.length === 0) {
        return "Loading..."
    }

    return <Container>
        <PortfolioName> Carter Nole's Portfolio </PortfolioName>
        <CartersMoney>
            ${stocksSum}
        </CartersMoney>

        <TickerTableContainer>
            {data.map(stock => {
                return <Ticker {...stock}></Ticker>
            })}
        </TickerTableContainer>
    </Container>

}
