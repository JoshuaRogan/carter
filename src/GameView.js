import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { getPortfolioById } from "./portfolios";
import { enrichStocks } from "./stocks";
import { ImArrowLeft } from "react-icons/im";

// --- Styled bits ---
const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${(p) =>
    `linear-gradient(135deg, ${p.$color} 0%, #fffbe8 40%, #e6fbff 80%)`};
  font-family: "Baloo 2", "Fredoka", "Comic Sans MS", sans-serif;
`;

const HeaderBar = styled.header`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px 10px;
  color: #fff;
  position: sticky;
  top: 0;
  backdrop-filter: blur(8px);
`;

const BackBtn = styled.button`
  background: #ffffff25;
  border: 1px solid #ffffff40;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  cursor: pointer;
  color: #fff;
  font-size: 0.9rem;
  transition:
    background 0.25s,
    transform 0.25s;
  &:hover {
    background: #ffffff35;
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
`;

const Title = styled.h1`
  font-size: clamp(1.3rem, 3.5vw, 2rem);
  margin: 0;
  color: #fff;
`;

const Sub = styled.div`
  font-size: 0.8rem;
  color: #ffffffdd;
  margin-top: 2px;
`;

const Area = styled.div`
  padding: 10px 20px 80px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Card = styled.div`
  background: linear-gradient(145deg, #ffffff, #f4fbff 55%, #f0ffe9);
  border: 3px solid #cfe8f2;
  border-radius: 26px;
  padding: 26px 24px 30px;
  max-width: 560px;
  margin: 0 auto;
  text-align: center;
  box-shadow: 0 8px 20px -10px rgba(30, 70, 90, 0.25);
  position: relative;
`;

const StockName = styled.div`
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;

const BigEmoji = styled.span`
  font-size: 3rem;
  display: inline-block;
`;

const Prompt = styled.div`
  font-size: 1.05rem;
  margin: 18px 0 22px;
  font-weight: 600;
  color: #34525f;
`;

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
`;

const ChoiceBtn = styled.button`
  background: ${(p) =>
    p.$kind === "good"
      ? "linear-gradient(135deg,#b2f7b2,#58d658)"
      : "linear-gradient(135deg,#ffe1a8,#ffc14d)"};
  border: none;
  padding: 16px 26px;
  border-radius: 40px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  color: #123b1a;
  letter-spacing: 0.5px;
  box-shadow: 0 6px 14px -6px rgba(40, 90, 40, 0.35);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition:
    transform 0.25s,
    box-shadow 0.25s;
  &:hover {
    transform: translateY(-4px) rotate(-1deg);
  }
  &:active {
    transform: translateY(-1px);
  }
`;

const Feedback = styled.div`
  margin-top: 24px;
  font-size: 1.15rem;
  font-weight: 700;
`;

const ScoreBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 0.95rem;
  font-weight: 700;
  margin: 26px 0 10px;
  flex-wrap: wrap;
  color: #2d4c59;
`;

const Tiny = styled.span`
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 800;
  background: #ffffff66;
  padding: 4px 10px;
  border-radius: 16px;
`;

const FinishCard = styled(Card)`
  background: linear-gradient(145deg, #fff6d5, #f0fdff 50%, #edffe9);
`;

const PlayAgainBtn = styled(ChoiceBtn)`
  background: linear-gradient(135deg, #ffd36e, #ffa726);
  color: #5b3200;
  box-shadow: 0 6px 14px -6px rgba(120, 60, 10, 0.35);
`;

const Loading = styled.div`
  padding: 60px 30px;
  text-align: center;
  font-size: 1.1rem;
  opacity: 0.85;
`;

const LogoWrap = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 20px;
  overflow: hidden;
  background: #ffffffdd;
  box-shadow: 0 4px 10px -4px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const LogoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`;

const LogoFallback = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: #34525f;
`;

function stockMood(stock) {
  if (stock.current > stock.averageCost) return "growing"; // happy
  if (stock.current < stock.averageCost) return "sleepy"; // needs help
  return "even";
}

export default function GameView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const portfolio = getPortfolioById(id);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [feedback, setFeedback] = useState(undefined);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!portfolio) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const enriched = await enrichStocks(portfolio.data);
        if (!active) return;
        // Shuffle for fun
        const shuffled = [...enriched].sort(() => Math.random() - 0.5);
        setStocks(shuffled);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, portfolio]);

  if (!portfolio) {
    return (
      <Wrapper $color="#999">
        <HeaderBar>
          <BackBtn onClick={() => navigate("/")}>
            {" "}
            <ImArrowLeft />{" "}
          </BackBtn>
          <Title>Not Found</Title>
        </HeaderBar>
        <Area>
          <Card>That treasure chest is missing.</Card>
        </Area>
      </Wrapper>
    );
  }

  const current = stocks[index];

  const handleGuess = (guess) => {
    if (!current) return;
    const mood = stockMood(current); // growing / sleepy / even
    let correct = false;
    if (guess === "growing" && mood === "growing") correct = true;
    if (guess === "sleepy" && mood === "sleepy") correct = true;
    if (guess === "even" && mood === "even") correct = true; // rarely used

    const reward = correct ? 1 + Math.floor(Math.random() * 3) : 0; // 1-3 coins
    if (correct) {
      setScore((s) => s + 1);
      setCoins((c) => c + reward);
      setFeedback(
        `✅ Yay! It is ${mood === "growing" ? "GROWING 🌱" : mood === "sleepy" ? "SLEEPY 😴" : "JUST RIGHT 👍"} +${reward} coin${reward === 1 ? "" : "s"}!`,
      );
    } else {
      setFeedback(
        `❌ Oops! It was ${mood === "growing" ? "GROWING 🌱" : mood === "sleepy" ? "SLEEPY 😴" : "JUST RIGHT 👍"}.`,
      );
    }

    setTimeout(() => {
      setFeedback(undefined);
      setIndex((i) => {
        const next = i + 1;
        if (next >= stocks.length) {
          setDone(true);
          return i; // stay
        }
        return next;
      });
    }, 1400);
  };

  const resetGame = () => {
    setIndex(0);
    setScore(0);
    setCoins(0);
    setFeedback(undefined);
    setDone(false);
    setStocks((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const totalRounds = stocks.length || 0;

  return (
    <Wrapper $color={portfolio.color}>
      <HeaderBar>
        <BackBtn
          aria-label="Back"
          onClick={() => navigate(`/portfolio/${portfolio.id}`)}
        >
          <ImArrowLeft />
        </BackBtn>
        <div>
          <Title>{portfolio.name}'s Stock Game</Title>
          <Sub>Guess if the little company is GROWING or NEEDS HELP!</Sub>
        </div>
      </HeaderBar>
      <Area>
        {loading && <Loading>Waking up little companies…</Loading>}
        {!loading && !done && current && (
          <>
            <ScoreBar>
              <div>
                <Tiny>ROUND</Tiny>
                <br /> {index + 1} / {totalRounds}
              </div>
              <div>
                <Tiny>SCORE</Tiny>
                <br /> {score}
              </div>
              <div>
                <Tiny>COINS</Tiny>
                <br /> {coins} 🪙
              </div>
            </ScoreBar>
            <Card aria-live="polite">
              <StockName>
                <LogoWrap>
                  {current.image && !current._logoError ? (
                    <LogoImg
                      src={current.image}
                      alt={current.display || current.ticker}
                      onError={() => {
                        setStocks((prev) =>
                          prev.map((s, i) =>
                            i === index ? { ...s, _logoError: true } : s,
                          ),
                        );
                      }}
                    />
                  ) : (
                    <LogoFallback>
                      {(current.display || current.ticker || "?").charAt(0)}
                    </LogoFallback>
                  )}
                </LogoWrap>
                <BigEmoji role="img" aria-label="company">
                  {stockMood(current) === "growing"
                    ? "🌱"
                    : stockMood(current) === "sleepy"
                      ? "😴"
                      : "😊"}
                </BigEmoji>
                {current.display || current.ticker}
              </StockName>
              <Prompt>
                Is {current.display || current.ticker} <strong>GROWING</strong>{" "}
                or <strong>NEEDS HELP</strong>? Pick one!
              </Prompt>
              <Buttons>
                <ChoiceBtn $kind="good" onClick={() => handleGuess("growing")}>
                  🌱 Growing
                </ChoiceBtn>
                <ChoiceBtn $kind="ok" onClick={() => handleGuess("sleepy")}>
                  😴 Needs Help
                </ChoiceBtn>
              </Buttons>
              {feedback && <Feedback>{feedback}</Feedback>}
            </Card>
          </>
        )}
        {!loading && done && (
          <FinishCard>
            <BigEmoji role="img" aria-label="trophy">
              🏆
            </BigEmoji>
            <h2 style={{ margin: "10px 0 6px" }}>
              Great Job, {portfolio.name}!
            </h2>
            <p style={{ margin: "0 0 10px", fontWeight: 600 }}>
              You found {score} growing friend{score === 1 ? "" : "s"} and
              earned {coins} coin{coins === 1 ? "" : "s"}!
            </p>
            <p
              style={{
                fontSize: ".9rem",
                margin: "0 0 24px",
                color: "#35525f",
              }}
            >
              Growing means today's price is higher than the magic seed (what we
              paid). Needs help means it's below the seed. That's all!
            </p>
            <Buttons>
              <PlayAgainBtn onClick={resetGame}>▶️ Play Again</PlayAgainBtn>
              <ChoiceBtn
                $kind="good"
                onClick={() => navigate(`/portfolio/${portfolio.id}`)}
              >
                🔙 Back
              </ChoiceBtn>
            </Buttons>
          </FinishCard>
        )}
      </Area>
    </Wrapper>
  );
}
