import React, { useEffect, useState } from "react";
import "./App.css";
import { getCarterStocks } from "./stocks";
import Tickers from "./Tickers";
import styled from "styled-components";

const AppContainer = styled.div`
  min-height: 100vh;
  background: #3498db;
`;

function Carter() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getCarterStocks().then(setData);
  }, []);

  return (
    <AppContainer>
      <Tickers data={data} name="Cater" />
    </AppContainer>
  );
}

export default Carter;
