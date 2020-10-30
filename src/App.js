import React, { useEffect, useState } from "react";
import "./App.css";
import { getStocks } from "./stocks";
import Tickers from "./Tickers";
import styled from "styled-components";

const AppContainer = styled.div`
  min-height: 100vh;
`;

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getStocks().then(setData);
  }, []);

  return (
    <AppContainer>
      <Tickers data={data} />
    </AppContainer>
  );

  // return (
  //   <div className="App">
  //     <div>
  //       {JSON.stringify(data)}
  //     </div>
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
