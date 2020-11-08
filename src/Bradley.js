import React, { useEffect, useState } from "react";
import "./App.css";
import { getBradleyStocks } from "./stocks";
import Tickers from "./Tickers";
import styled from "styled-components";

const AppContainer = styled.div`
  min-height: 100vh;
`;

function Bradley() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getBradleyStocks().then(setData);
  }, []);

  return (
    <AppContainer>
      <Tickers data={data} />
    </AppContainer>
  );
}

export default Bradley;
