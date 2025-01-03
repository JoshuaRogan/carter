import React, { useState } from "react";
import "./App.css";
import Olivia from "./Olivia";
import Trinity from "./Trinity";
import Grant from "./Grant";
import styled from "styled-components";
import Carter from "./Carter";
import Andrew from "./Andrew";
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
  andrew: "andrew",

  reagan: "reagan",
  patrick: "patrick",

  olivia: "olivia",
  trinity: "trinity",
  grant: "grant",

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

  if (view === VIEWS.andrew) {
    return <Andrew back={back} />;
  }

  if (view === VIEWS.reagan) {
    return <Reagan back={back} />;
  }

  if (view === VIEWS.patrick) {
    return <Patrick back={back} />;
  }

  if (view === VIEWS.olivia) {
    return <Olivia back={back} />;
  }

  if (view === VIEWS.trinity) {
    return <Trinity back={back} />;
  }

  if (view === VIEWS.grant) {
    return <Grant back={back} />;
  }

  return (
    <>
      <h2 style={{ textAlign: "center", color: "white" }}>
        <a
          href="https://www.youtube.com/watch?v=Epzr8azlxp8&ab_channel=EasyPeasyFinance"
          style={{ color: "white" }}
        >
          Learn About Stocks
        </a>
      </h2>

      <h2 style={{ textAlign: "center", color: "white" }}>
        Choose a Portfolio
      </h2>

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

        <OnShowOnSite siteName={FAMILIES.NOLE}>
          <Button
            onClick={() => {
              setView(VIEWS.andrew);
            }}
          >
            Andrew's Portfolio
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
            Patrick's Portfolio
          </Button>
        </OnShowOnSite>

        <OnShowOnSite siteName={FAMILIES.KERRIGAN}>
          <Button
            onClick={() => {
              setView(VIEWS.olivia);
            }}
          >
            Olivia's Portfolio
          </Button>
        </OnShowOnSite>

        <OnShowOnSite siteName={FAMILIES.KERRIGAN}>
          <Button
            onClick={() => {
              setView(VIEWS.grant);
            }}
          >
            Grant's Portfolio
          </Button>
        </OnShowOnSite>

        <OnShowOnSite siteName={FAMILIES.KERRIGAN}>
          <Button
            onClick={() => {
              setView(VIEWS.trinity);
            }}
          >
            Trinity's Portfolio
          </Button>
        </OnShowOnSite>
      </ButtonContainers>
    </>
  );
}

export default App;
