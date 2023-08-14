import React, { useEffect, useState } from "react";
import "./App.css";
import { getReaganStocks } from "./stocks";
import Tickers from "./Tickers";
import styled from "styled-components";
import Back from "./Back";

const AppContainer = styled.div`
  min-height: 100vh;
  background: #baa636;
`;

function Reagan({ back }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getReaganStocks().then(setData);
  }, []);

  return (
    <AppContainer>
      <Back back={back} />
      <Tickers data={data} name="Reagan" />
    </AppContainer>
  );
}

export default Reagan;
