import React from "react";
import "./App.css";
import { FAMILIES, getSiteFamily } from "./env";
import { portfolios, getPortfolioById } from "./portfolios";
import styled, { createGlobalStyle } from "styled-components";
import PortfolioView from "./PortfolioView";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import GameView from "./GameView";

const GlobalStyle = createGlobalStyle`
  body { 
    font-family: 'Baloo 2', 'Fredoka', 'Comic Sans MS', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
    background: linear-gradient(135deg,#fff9e6 0%, #e6f7ff 45%, #e8fce9 85%);
    color: #2b3742;
    margin: 0; 
    min-height: 100vh; 
    -webkit-font-smoothing: antialiased;
  }
`;

const PageWrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto 80px;
  padding: 0 4%;
  box-sizing: border-box;
`;

const Section = styled.section`
  margin-bottom: 56px;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.4rem, 3vw, 2.1rem);
  margin: 0 0 20px;
  background: linear-gradient(90deg, #ffffff, #bdc3c7);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 0.5px;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -6px;
    height: 3px;
    width: 80px;
    background: linear-gradient(90deg, #f39c12, #e74c3c, #9b59b6);
    border-radius: 2px;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
`;

const Card = styled.button`
  background: linear-gradient(145deg, #ffffff, #f3faff 60%, #eefcf1);
  border: 3px solid ${(p) => (p.$color ? p.$color + "55" : "#c9e2ef")};
  backdrop-filter: blur(4px);
  border-radius: 22px;
  padding: 26px 22px 30px;
  text-align: left;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition:
    transform 0.25s,
    box-shadow 0.25s,
    background 0.4s;
  color: #2b3742;
  font-weight: 600;
  letter-spacing: 0.4px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 6px 16px -6px rgba(20, 38, 60, 0.18);
  &:before {
    content: "🧩";
    position: absolute;
    top: 10px;
    right: 12px;
    font-size: 1.15rem;
    opacity: 0.45;
  }
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 14px 30px -10px rgba(20, 38, 60, 0.28);
  }
  &:active {
    transform: translateY(-2px);
  }
  border: none;
`;

const CardTitle = styled.div`
  font-size: 1.35rem;
`;

const FamBadge = styled.span`
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: ${(p) => p.$color};
  color: #fff;
  padding: 3px 8px;
  border-radius: 12px;
  align-self: flex-start;
  font-weight: 700;
`;

const Heading = styled.h1`
  text-align: center;
  margin: 30px 0 6px;
  font-size: clamp(2rem, 5vw, 3.1rem);
  background: linear-gradient(90deg, #ffb347, #4fc3f7, #7cd97c);
  -webkit-background-clip: text;
  color: transparent;
`;

const SubHeading = styled.p`
  text-align: center;
  font-weight: 500;
  margin: 0 0 38px;
  font-size: 1.05rem;
  color: #435362;
`;

function niceFamilyName(fam) {
  if (!fam) return "";
  return fam.charAt(0).toUpperCase() + fam.slice(1);
}

function Home() {
  const navigate = useNavigate();
  const envSiteName = getSiteFamily();
  const visiblePortfolios = portfolios.filter(
    (p) => envSiteName === FAMILIES.LOCAL || p.family === envSiteName,
  );
  const grouped = visiblePortfolios.reduce((acc, p) => {
    (acc[p.family] ||= []).push(p);
    return acc;
  }, {});
  const orderedFamilies = [
    FAMILIES.ROGAN,
    FAMILIES.NOLE,
    FAMILIES.KERRIGAN,
    FAMILIES.TOKASH,
    FAMILIES.ROGAN_DIR,
  ].filter((f) => grouped[f]);
  return (
    <PageWrapper>
      <Heading>Our Family Stocks</Heading>
      <SubHeading>Tap a card to peek at how they are doing!</SubHeading>
      {orderedFamilies.map((fam) => (
        <Section key={fam} aria-label={`${niceFamilyName(fam)} family section`}>
          {orderedFamilies.length > 1 && (
            <SectionTitle
              style={{
                color: "#555",
                WebkitBackgroundClip: "initial",
                background: "none",
              }}
            >
              {niceFamilyName(fam)} Family
            </SectionTitle>
          )}
          <CardsGrid>
            {grouped[fam].map((p) => (
              <Card
                key={p.id}
                $color={p.color}
                onClick={() => navigate(`/portfolio/${p.id}`)}
                aria-label={`${p.name}'s portfolio`}
              >
                <FamBadge
                  $color={p.color}
                  style={{ background: p.color, borderRadius: 10 }}
                >
                  {p.family}
                </FamBadge>
                <CardTitle>{p.name}'s Stocks</CardTitle>
                <div style={{ fontSize: ".8rem", color: "#445361" }}>
                  See value & growth 🚀
                </div>
                <div
                  style={{ marginTop: 4, fontSize: ".7rem", color: "#5d6b78" }}
                >
                  Tap to open
                </div>
              </Card>
            ))}
          </CardsGrid>
        </Section>
      ))}
      <div style={{ display: "none" }}>learn react</div>
    </PageWrapper>
  );
}

function PortfolioRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const portfolio = getPortfolioById(id);
  if (!portfolio) {
    return (
      <PageWrapper>
        <Heading>Not Found</Heading>
        <SubHeading>Portfolio with id '{id}' does not exist.</SubHeading>
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              border: "1px solid #ffffff33",
              background: "#ffffff18",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Go Home
          </button>
        </div>
      </PageWrapper>
    );
  }
  return <PortfolioView id={id} onBack={() => navigate("/")} />;
}

export default function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio/:id" element={<PortfolioRoute />} />
        <Route path="/portfolio/:id/game" element={<GameView />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
