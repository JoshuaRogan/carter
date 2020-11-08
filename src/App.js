import React, { useState } from "react";
import "./App.css";
import styled from "styled-components";
import Carter from "./Carter";
import Bradley from "./Bradley";

const ButtonContainers = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-content: center;
  margin-top: 25px;
`;

const Button = styled.button`
  border: 1px solid white;
  width: 65vw;
  max-width: 500px;
  text-align: center;
  align-self: center;
  padding: 20px;
  margin-bottom: 15px;
  color: white;
  font-weight: bold;
  background: transparent;

  &:hover {
    cursor: pointer;
  }
`;

const VIEWS = {
  carter: "carter",
  bradley: "bradley",
  home: "home",
};

function App() {
  const [view, setView] = useState("home");

  if (view === VIEWS.carter) {
    return <Carter />;
  }

  if (view === VIEWS.bradley) {
    return <Bradley />;
  }

  return (
    <ButtonContainers>
      <Button
        onClick={() => {
          setView(VIEWS.carter);
        }}
      >
        Carter's Portfolio
      </Button>
      <Button
        onClick={() => {
          setView(VIEWS.bradley);
        }}
      >
        Bradley's Portfolio
      </Button>
    </ButtonContainers>
  );
}

export default App;
