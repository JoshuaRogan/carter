import React, { useEffect, useState } from "react";
import "./App.css";
import { getBradleyStocks } from "./stocks";
import Tickers from "./Tickers";
import styled from "styled-components";
import Back from "./Back";

const AppContainer = styled.div`
  min-height: 100vh;
  background: #fdcb6e;
`;

function Bradley({ back }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getBradleyStocks().then(setData);
  }, []);

  return (
    <AppContainer>
      <Back back={back} />
      <Tickers data={data} name="Bradley" />
    </AppContainer>
  );
}

export default Bradley;
