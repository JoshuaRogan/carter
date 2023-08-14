import React, { useEffect, useState } from "react";
import "./App.css";
import { getPatrickStocks } from "./stocks";
import Tickers from "./Tickers";
import styled from "styled-components";
import Back from "./Back";

const AppContainer = styled.div`
  min-height: 100vh;
  background: orange;
`;

function Reagan({ back }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getPatrickStocks().then(setData);
  }, []);

  return (
    <AppContainer>
      <Back back={back} />
      <Tickers data={data} name="Patrick" />
    </AppContainer>
  );
}

export default Reagan;
