import React, { useEffect, useState } from "react";
import "./App.css";
import { getGrantStocks } from "./stocks";
import Tickers from "./Tickers";
import styled from "styled-components";
import Back from "./Back";

const AppContainer = styled.div`
  min-height: 100vh;
  background: #3498db;
`;

function Carter({ back }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getGrantStocks().then(setData);
  }, []);

  return (
    <AppContainer>
      <Back back={back} />
      <Tickers data={data} name="Grant" />
    </AppContainer>
  );
}

export default Carter;
