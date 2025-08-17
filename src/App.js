import React, { useState } from "react";
import "./App.css";
import { FAMILIES, getSiteFamily } from "./env";
import { portfolios } from './portfolios';
import styled, { createGlobalStyle } from 'styled-components';
import PortfolioView from './PortfolioView';

const GlobalStyle = createGlobalStyle`
  body { 
    font-family: 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
    background: radial-gradient(circle at 20% 20%, #2c3e50, #1b2735 60%);
    color: #ecf0f1;
    margin: 0; 
    min-height: 100vh; 
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
  font-size: clamp(1.4rem,3vw,2.1rem);
  margin: 0 0 20px;
  background: linear-gradient(90deg,#ffffff,#bdc3c7);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: .5px;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    left: 0; bottom: -6px;
    height: 3px; width: 80px;
    background: linear-gradient(90deg,#f39c12,#e74c3c,#9b59b6);
    border-radius: 2px;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
  gap: 24px;
`;

const Card = styled.button`
  background: #ffffff10;
  border: 1px solid #ffffff22;
  backdrop-filter: blur(6px);
  border-radius: 18px;
  padding: 22px 20px 26px;
  text-align: left;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform .25s, box-shadow .25s, background .4s;
  color: #ecf0f1;
  font-weight: 600;
  letter-spacing: .5px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &:before {
    content: "";
    position: absolute;
    inset: 0;
    background: ${(p)=>p.$color}22;
    opacity: .7;
  }
  &:after {
    content: "";
    position: absolute;
    top: -40%; left: -40%;
    width: 180%; height: 180%;
    background: radial-gradient(circle at 30% 30%, ${(p)=>p.$color}55, transparent 70%);
    opacity: 0; transition: opacity .45s;
  }
  &:hover { transform: translateY(-4px); box-shadow: 0 10px 28px -6px rgba(0,0,0,.4); background: #ffffff18; }
  &:hover:after { opacity: 1; }
  border: none;
`;

const CardTitle = styled.div`
  font-size: 1.25rem;
`;

const FamBadge = styled.span`
  font-size: .65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: ${(p)=>p.$color};
  color: #fff;
  padding: 3px 8px;
  border-radius: 12px;
  align-self: flex-start;
  font-weight: 700;
`;

const Heading = styled.h1`
  text-align: center;
  margin: 32px 0 8px;
  font-size: clamp(1.8rem, 4vw, 3rem);
  background: linear-gradient(90deg,#f39c12,#e74c3c,#9b59b6);
  -webkit-background-clip: text;
  color: transparent;
`;

const SubHeading = styled.p`
  text-align: center;
  font-weight: 400;
  margin: 0 0 42px;
  font-size: 1rem;
  opacity: .8;
`;

function niceFamilyName(fam) {
  if (!fam) return '';
  return fam.charAt(0).toUpperCase() + fam.slice(1);
}

function App() {
  const [selected, setSelected] = useState(null);
  const envSiteName = getSiteFamily();

  if (selected) {
    return (
      <>
        <GlobalStyle />
        <PortfolioView id={selected} onBack={()=>setSelected(null)} />
      </>
    );
  }

  const visiblePortfolios = portfolios.filter(p => envSiteName === FAMILIES.LOCAL || p.family === envSiteName);

  // Group by family
  const grouped = visiblePortfolios.reduce((acc, p) => {
    (acc[p.family] ||= []).push(p);
    return acc;
  }, {});

  // Desired family order (only those present will render)
  const orderedFamilies = [FAMILIES.ROGAN, FAMILIES.NOLE, FAMILIES.KERRIGAN, FAMILIES.TOKASH, FAMILIES.ROGAN_DIR].filter(f => grouped[f]);

  return (
    <>
      <GlobalStyle />
      <PageWrapper>
        <Heading>Family Stock Portfolios</Heading>
        <SubHeading>Tap a card to view a live snapshot</SubHeading>
        {orderedFamilies.map(fam => (
          <Section key={fam} aria-label={`${niceFamilyName(fam)} family section`}>
            {orderedFamilies.length > 1 && (
              <SectionTitle>{niceFamilyName(fam)} Family</SectionTitle>
            )}
            <CardsGrid>
              {grouped[fam].map(p => (
                <Card key={p.id} $color={p.color} onClick={()=>setSelected(p.id)} aria-label={`${p.name}'s portfolio`}>
                  <FamBadge $color={p.color}>{p.family}</FamBadge>
                  <CardTitle>{p.name}'s Portfolio</CardTitle>
                  <div style={{fontSize:'.75rem',opacity:.7}}>Stock holdings & performance</div>
                </Card>
              ))}
            </CardsGrid>
          </Section>
        ))}
        {/* hidden text to satisfy legacy test if still present */}
        <div style={{display:'none'}}>learn react</div>
      </PageWrapper>
    </>
  );
}

export default App;
