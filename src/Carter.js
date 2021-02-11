import React, { useEffect, useState } from "react";
import "./App.css";
import { getCarterStocks } from "./stocks";
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
    getCarterStocks().then(setData);
  }, []);

  return (
    <AppContainer>
      <Back back={back} />
      <Tickers data={data} name="Carter" />
    </AppContainer>
  );
}

export default Carter;
