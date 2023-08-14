import React, { useState } from "react";
import "./App.css";
import styled from "styled-components";
import Carter from "./Carter";
import Bradley from "./Bradley";
import Reagan from "./Reagan";
import Patrick from "./Patrick";
import { FAMILIES, getSiteFamily } from "./env";

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
  reagan: "reagan",
  patrick: "patrick",
  home: "home",
};

const envSiteName = getSiteFamily();

function OnShowOnSite({ children, siteName }) {
  if (envSiteName === FAMILIES.LOCAL) {
    return children;
  }

  if (siteName === envSiteName) {
    return children;
  }

  return null;
}

function App() {
  const [view, setView] = useState(VIEWS.home);

  function back() {
    setView(VIEWS.home);
  }

  if (view === VIEWS.carter) {
    return <Carter back={back} />;
  }

  if (view === VIEWS.bradley) {
    return <Bradley back={back} />;
  }

  if (view === VIEWS.reagan) {
    return <Reagan back={back} />;
  }

  if (view === VIEWS.patrick) {
    return <Patrick back={back} />;
  }

  return (
    <ButtonContainers>
      <OnShowOnSite siteName={FAMILIES.NOLE}>
        <Button
          onClick={() => {
            setView(VIEWS.carter);
          }}
        >
          Carter's Portfolio
        </Button>
      </OnShowOnSite>
      <OnShowOnSite siteName={FAMILIES.NOLE}>
        <Button
          onClick={() => {
            setView(VIEWS.bradley);
          }}
        >
          Bradley's Portfolio
        </Button>
      </OnShowOnSite>

      <OnShowOnSite siteName={FAMILIES.ROGAN}>
        <Button
          onClick={() => {
            setView(VIEWS.reagan);
          }}
        >
          Reagan's Portfolio
        </Button>
      </OnShowOnSite>

      <OnShowOnSite siteName={FAMILIES.ROGAN}>
        <Button
          onClick={() => {
            setView(VIEWS.patrick);
          }}
        >
          Patricks's Portfolio
        </Button>
      </OnShowOnSite>
    </ButtonContainers>
  );
}

export default App;
