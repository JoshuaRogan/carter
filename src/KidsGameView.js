import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

// Simple educational quiz style game (ages ~4-8)
// Concepts: what is a stock (tiny piece), price up/down, long term growing tree, saving vs spending, diversification (basket), ticker letters, patience.
// Light words + emojis, positive reinforcement.

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #ffeec2, #e4f9ff 45%, #e8ffe5 85%);
  font-family: "Baloo 2", "Fredoka", "Comic Sans MS", sans-serif;
  color: #2b3742;
`;
const Header = styled.header`
  padding: 20px 22px 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
`;
const BackBtn = styled.button`
  background: #ffffff33;
  border: 2px solid #ffffff77;
  color: #2b3742;
  font-weight: 700;
  padding: 12px 20px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 0.9rem;
  backdrop-filter: blur(4px);
  transition:
    background 0.25s,
    transform 0.25s;
  &:hover {
    background: #ffffff55;
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
`;
const Title = styled.h1`
  font-size: clamp(1.6rem, 4.5vw, 2.4rem);
  margin: 0;
  background: linear-gradient(90deg, #ffb347, #ff7eb3, #7cd97c);
  -webkit-background-clip: text;
  color: transparent;
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Area = styled.main`
  flex: 1;
  padding: 10px 22px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  @media (max-width: 620px) {
    padding: 16px 18px calc(110px + env(safe-area-inset-bottom, 0px));
  }
`;
const Card = styled.div`
  background: linear-gradient(145deg, #ffffff, #f5fbff 55%, #f0ffe9);
  border: 3px solid #cfe8f2;
  border-radius: 32px;
  padding: 34px 30px 40px;
  width: 100%;
  max-width: 680px;
  text-align: center;
  box-shadow: 0 10px 26px -12px rgba(30, 70, 90, 0.28);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  @media (max-width: 620px) {
    padding: 30px 22px 36px;
    border-radius: 28px;
  }
`;
const Progress = styled.div`
  width: 100%;
  max-width: 680px;
  margin: 0 auto 24px;
  height: 14px;
  border-radius: 10px;
  background: #d9ebf3;
  overflow: hidden;
`;
const ProgressFill = styled.div`
  height: 100%;
  width: ${(p) => p.$w}%;
  background: linear-gradient(90deg, #ffcc33, #ff8a54, #b57bff);
  background-size: 200% 100%;
  animation: ${gradientMove} 5s linear infinite;
  transition: width 0.5s ease;
`;
const Prompt = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  margin: 0 0 26px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  @media (max-width: 620px) {
    font-size: 1.3rem;
    margin-bottom: 30px;
  }
`;
const SmallExplain = styled.div`
  font-size: 0.75rem;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: #4c6270;
  font-weight: 800;
`;
const Choices = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 18px;
  width: 100%;
  @media (max-width: 620px) {
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 14px;
    align-items: stretch;
  }
`;
const ChoiceBtn = styled.button`
  background: ${(p) => p.$color || "linear-gradient(135deg,#b2f7b2,#58d658)"};
  border: none;
  padding: 18px 28px;
  border-radius: 50px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  color: #133c1c;
  letter-spacing: 0.5px;
  box-shadow: 0 8px 18px -8px rgba(40, 90, 40, 0.35);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition:
    transform 0.25s,
    box-shadow 0.25s,
    filter 0.25s;
  min-height: 56px;
  @media (max-width: 620px) {
    width: 100%;
    font-size: 1.12rem;
    padding: 18px 22px;
    border-radius: 60px;
  }
  &:hover {
    transform: translateY(-5px) rotate(-1deg);
  }
  &:active {
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.55;
    filter: grayscale(0.3);
    cursor: default;
  }
  &:focus-visible {
    outline: 3px solid #ffcc33;
    outline-offset: 3px;
  }
`;
const Feedback = styled.div`
  margin-top: 26px;
  font-size: 1.2rem;
  font-weight: 800;
  @media (max-width: 620px) {
    font-size: 1.05rem;
    margin-top: 22px;
  }
`;
const ScoreRow = styled.div`
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
  margin: 20px 0 14px;
  color: #2d4c59;
`;
const StatBox = styled.div`
  background: #ffffffaa;
  padding: 10px 16px 12px;
  border-radius: 18px;
  line-height: 1.1;
`;
const Tiny = styled.div`
  font-size: 0.55rem;
  letter-spacing: 0.8px;
  font-weight: 800;
  opacity: 0.7;
  margin-bottom: 3px;
`;
const FinishCard = styled(Card)`
  background: linear-gradient(145deg, #fff6d5, #f1fdff 55%, #edffe9);
  @media (max-width: 620px) {
    padding-bottom: 42px;
  }
`;
const PlayAgain = styled(ChoiceBtn)`
  background: linear-gradient(135deg, #ffd36e, #ffa726);
  color: #5b3200;
  box-shadow: 0 6px 14px -6px rgba(120, 60, 10, 0.35);
`;
const MiniExplainList = styled.ul`
  text-align: left;
  margin: 20px 0 10px;
  padding: 0 0 0 20px;
  font-size: 0.9rem;
  line-height: 1.35;
  @media (max-width: 620px) {
    font-size: 0.85rem;
    line-height: 1.4;
  }
`;
const VideoWrap = styled.div`
  width: 100%;
  max-width: 780px;
  aspect-ratio: 16 / 9;
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  margin: 0 0 18px;
  background: #000;
  box-shadow:
    0 12px 28px -14px rgba(0, 0, 0, 0.45),
    0 4px 12px -4px rgba(0, 0, 0, 0.25);
  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
  @media (max-width: 620px) {
    border-radius: 20px;
    margin-bottom: 14px;
  }
`;
const CarouselContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 840px;
  margin: 0 0 36px;
  @media (max-width: 620px) {
    margin-bottom: 28px;
  }
`;
const CarouselHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 0 0 10px;
  flex-wrap: wrap;
`;
const CarouselTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.1rem, 2.6vw, 1.55rem);
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(90deg, #ffb347, #ff7eb3, #7cd97c);
  -webkit-background-clip: text;
  color: transparent;
`;
const NavBtns = styled.div`
  display: flex;
  gap: 10px;
`;
const NavBtn = styled.button`
  background: linear-gradient(135deg, #ffffffdd, #f2fbff);
  border: 2px solid #cde3ec;
  border-radius: 14px;
  width: 44px;
  height: 44px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  font-weight: 700;
  color: #2b3742;
  box-shadow: 0 6px 16px -8px rgba(40, 70, 90, 0.35);
  transition:
    transform 0.25s,
    background 0.35s;
  &:hover {
    transform: translateY(-4px);
  }
  &:active {
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;
const Dots = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
  justify-content: center;
`;
const DotBtn = styled.button`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 0;
  background: ${(p) =>
    p.$active ? "linear-gradient(135deg,#ffcc33,#ff8a54)" : "#cfdfe6"};
  box-shadow: ${(p) =>
    p.$active
      ? "0 0 0 3px #ffffffaa,0 4px 10px -4px rgba(0,0,0,.35)"
      : "0 0 0 2px #ffffff88"};
  cursor: pointer;
  transition:
    transform 0.25s,
    background 0.35s;
  &:hover {
    transform: scale(1.2);
  }
  &:focus-visible {
    outline: 3px solid #ffcc33;
    outline-offset: 2px;
  }
`;
const VideoMeta = styled.div`
  font-size: 0.75rem;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  font-weight: 700;
  opacity: 0.65;
  margin-top: 2px;
  text-align: center;
`;
const InlineNav = styled.div`
  width: 100%;
  max-width: 680px;
  display: flex;
  justify-content: center;
  margin: 4px 0 20px;
`;
const KidsHomeBtn = styled(ChoiceBtn)`
  background: linear-gradient(135deg, #ffe27a, #ffcc33);
  color: #5b3200;
  padding: 12px 22px;
  font-size: 0.85rem;
  border-radius: 44px;
  box-shadow: 0 6px 16px -8px rgba(120, 80, 10, 0.35);
  @media (max-width: 620px) {
    width: auto;
  }
`;

function buildQuestions(difficulty = "basic") {
  // Basic: simpler language (ages ~4-5)
  const basicPool = [
    {
      id: "b_piece",
      prompt: "A stock is a tiny ____ of a company.",
      correct: "piece",
      distractors: ["hat", "cloud", "sandwich", "pencil"],
      explain: "Stock = tiny piece of a company.",
    },
    {
      id: "b_up",
      prompt: "Price goes UP = it is…",
      correct: "growing 🌱",
      distractors: ["sleeping 😴", "melting 🍦", "shrinking 🧊"],
      explain: "Up means it is growing.",
    },
    {
      id: "b_down",
      prompt: "Price below what we paid needs…",
      correct: "time ⏱️",
      distractors: ["a balloon 🎈", "a nap 🛌", "a whistle 🎵"],
      explain: "Down? Give it time or learn.",
    },
    {
      id: "b_basket",
      prompt: "Many different stocks = a…",
      correct: "fruit basket 🍎🍌",
      distractors: ["one cookie 🍪", "lonely sock 🧦", "single pea 🟢"],
      explain: "Different kinds = fruit basket.",
    },
    {
      id: "b_letters",
      prompt: "AAPL are stock…",
      correct: "letters (ticker)",
      distractors: ["stickers 🩹", "tricks 🎩", "tickets 🎫"],
      explain: "Those short letters are a ticker.",
    },
    {
      id: "b_patience",
      prompt: "Patience helps little stocks…",
      correct: "grow 🌳",
      distractors: ["fly 🪽", "turn candy 🍬", "sing 🎤"],
      explain: "Time helps them grow.",
    },
    {
      id: "b_spend",
      prompt: "Candy money is for…",
      correct: "now 🍬",
      distractors: ["never 🚫", "space 🛸", "a dragon 🐉"],
      explain: "Spending = now. Investing = later.",
    },
    {
      id: "b_wiggle",
      prompt: "Prices wiggle. That is…",
      correct: "normal ✅",
      distractors: ["broken ❌", "magic 🪄", "cheating 🕳️"],
      explain: "Wiggles are normal.",
    },
    {
      id: "b_calm",
      prompt: "When prices wiggle we stay…",
      correct: "calm 😌",
      distractors: ["panicky 😱", "grumpy 😠", "sleepy 😴"],
      explain: "Calm helps us choose.",
    },
    {
      id: "b_time",
      prompt: "Best helper for growing money…",
      correct: "time ⏳",
      distractors: ["noise 🔊", "luck 🍀", "hats 🎩"],
      explain: "Time helps growth.",
    },
    {
      id: "b_save",
      prompt: "Coins not spent become…",
      correct: "savings 🏦",
      distractors: ["sprinkles 🍧", "secrets 🤫", "shadows 🌑"],
      explain: "Not spent = saved.",
    },
    {
      id: "b_manysafe",
      prompt: "Many different stocks help keep us…",
      correct: "safer 🛡️",
      distractors: ["sleepier 😴", "hungrier 😋", "louder 🔊"],
      explain: "Many kinds spread risk.",
    },
    {
      id: "b_own",
      prompt: "Stock owners are tiny…",
      correct: "owners 👤",
      distractors: ["janitors 🧹", "tourists 🧳", "drivers 🚗"],
      explain: "You own a little bit.",
    },
    {
      id: "b_long",
      prompt: "Stocks work best for…",
      correct: "long time 🐢",
      distractors: ["one second ⚡", "one sneeze 🤧", "a blink 👁️"],
      explain: "Long time matters.",
    },
    {
      id: "b_share",
      prompt: "A tiny share is still…",
      correct: "real ownership 🧩",
      distractors: ["pretend 🎭", "a coupon 🎟️", "a sticker 🩷"],
      explain: "Small is still real.",
    },
  ];

  // Advanced: deeper / more vocab (ages ~7-8)
  const advancedPool = [
    // Reuse & enrich prior advanced set
    {
      id: "a_piece",
      prompt: "A stock share means you are a tiny…",
      correct: "owner 👤",
      distractors: ["janitor 🧹", "mascot 🦊", "tourist 🧳", "driver 🚗"],
      explain: "Shareholders are owners.",
    },
    {
      id: "a_goal",
      prompt: "We invest mainly so money can…",
      correct: "grow over time 🌱",
      distractors: [
        "hide forever 🕳️",
        "vanish 💨",
        "juggle 🤹‍♂️",
        "spin plates 🍽️",
      ],
      explain: "Growth over time.",
    },
    {
      id: "a_wiggle",
      prompt: "A wiggly price chart shows prices are…",
      correct: "changing 📈📉",
      distractors: ["sleeping 😴", "crying 😢", "sneezing 🤧", "whistling 🎵"],
      explain: "Wiggles = change.",
    },
    {
      id: "a_risk",
      prompt: "Owning only ONE stock is more…",
      correct: "risky ⚠️",
      distractors: ["tasty 😋", "boring 😐", "sparkly ✨", "stretchy 🧵"],
      explain: "Lack of diversification.",
    },
    {
      id: "a_timefriend",
      prompt: "Biggest friend of growth is…",
      correct: "time ⏳",
      distractors: ["noise 🔊", "luck 🍀", "rushing 🏃‍♂️", "guessing 🎲"],
      explain: "Time powers compounding.",
    },
    {
      id: "a_sellreason",
      prompt: "A reason to sell might be business is…",
      correct: "doing badly 📉",
      distractors: [
        "smiling 🙂",
        "colorful 🌈",
        "telling jokes 🤡",
        "wearing hats 🎩",
      ],
      explain: "Bad fundamentals can matter.",
    },
    {
      id: "a_ticker",
      prompt: "MSFT is a stock…",
      correct: "ticker code 🔤",
      distractors: [
        "password 🔐",
        "secret map 🗺️",
        "dessert list 🍰",
        "ticket 🎫",
      ],
      explain: "Ticker identifies the stock.",
    },
    {
      id: "a_earnings",
      prompt: "Money a company makes is called…",
      correct: "earnings 💵",
      distractors: ["sprinkles 🍧", "feathers 🪶", "puddles 💧", "balloons 🎈"],
      explain: "Earnings measure profit.",
    },
    {
      id: "a_reinvest",
      prompt: "Using gains to buy more shares is…",
      correct: "reinvesting 🔁",
      distractors: [
        "rewinding ⏪",
        "repainting 🎨",
        "re-floating 🛟",
        "re-sneezing 🤧",
      ],
      explain: "Reinvesting fuels growth.",
    },
    {
      id: "a_dividend",
      prompt: "Cash paid to shareholders is a…",
      correct: "dividend 💰",
      distractors: ["spray 💦", "napkin 🧻", "glitter ✨", "drumroll 🥁"],
      explain: "Dividend = payout.",
    },
    {
      id: "a_emotion",
      prompt: "Good investors stay…",
      correct: "calm 😌",
      distractors: ["panicky 😱", "grumpy 😠", "ticklish 😆", "sleepy 😴"],
      explain: "Calm > emotion.",
    },
    {
      id: "a_dip",
      prompt: "A quick price drop is a…",
      correct: "dip 🕳️",
      distractors: ["dance 💃", "door 🚪", "whistle 🎶", "sticker 🩷"],
      explain: "Small move = dip.",
    },
    {
      id: "a_plan",
      prompt: "A written investing plan helps us…",
      correct: "make smart moves 🧠",
      distractors: [
        "skip math ➗",
        "eat paper 📄",
        "grow wings 🪽",
        "float away 🎈",
      ],
      explain: "Plan guides choices.",
    },
    {
      id: "a_safety",
      prompt: "Owning many kinds of stocks adds…",
      correct: "diversification 🧺",
      distractors: [
        "decoration 🎀",
        "duplication 📄",
        "delight 😄",
        "delegation 🧑‍🤝‍🧑",
      ],
      explain: "Diversification spreads risk.",
    },
    {
      id: "a_compare",
      prompt: "We compare companies using…",
      correct: "numbers & facts 📊",
      distractors: ["shoe size 👟", "colors 🎨", "hat shapes 🎩", "smells 👃"],
      explain: "Use data, not looks.",
    },
    {
      id: "a_longterm",
      prompt: "Stocks are best held for the…",
      correct: "long term 🐢",
      distractors: ["blink 👁️", "one sneeze 🤧", "instant ⚡", "one minute ⏱️"],
      explain: "Long horizon lowers risk.",
    },
    {
      id: "a_compound",
      prompt: "Growth on past growth is…",
      correct: "compounding 🔁",
      distractors: [
        "complaining 🙉",
        "compressing 🗜️",
        "combining 🧪",
        "confusing 🤯",
      ],
      explain: "Compounding multiplies gains.",
    },
    {
      id: "a_fees",
      prompt: "Lower fees leave…",
      correct: "more money 💵",
      distractors: [
        "more chores 🧽",
        "more raisins 🍇",
        "more shadows 🌑",
        "more noodles 🍜",
      ],
      explain: "Costs reduce returns.",
    },
    {
      id: "a_focus",
      prompt: "We ignore daily market…",
      correct: "noise 🔊",
      distractors: ["lunch 🍎", "socks 🧦", "bubbles 🫧", "cupcakes 🧁"],
      explain: "Focus on plan.",
    },
    {
      id: "a_balance",
      prompt: "Mix of assets aims for…",
      correct: "balance ⚖️",
      distractors: ["fire 🔥", "snow ❄️", "glue 🧴", "marbles 🔵"],
      explain: "Balance smooths swings.",
    },
    {
      id: "a_behavior",
      prompt: "Not selling just from fear avoids…",
      correct: "panic selling 🚨",
      distractors: [
        "bonus pizza 🍕",
        "extra naps 😴",
        "turbo socks 🧦",
        "speed taxes 🧾",
      ],
      explain: "Avoid emotional selling.",
    },
    {
      id: "a_research",
      prompt: "Studying a company first is…",
      correct: "research 🔍",
      distractors: [
        "daydreaming 💭",
        "doodling ✏️",
        "whistling 🎵",
        "tap dancing 👞",
      ],
      explain: "Research informs buys.",
    },
    {
      id: "a_consistent",
      prompt: "Adding money regularly is…",
      correct: "consistent 💪",
      distractors: ["random 🎲", "invisible 👻", "fluffy ☁️", "spicy 🌶️"],
      explain: "Consistency builds wealth.",
    },
    {
      id: "a_ownerfraction",
      prompt: "Even a tiny share still gives…",
      correct: "ownership rights 🧩",
      distractors: [
        "pretend points 🎭",
        "stickers 🩷",
        "balloons 🎈",
        "confetti 🎊",
      ],
      explain: "Rights scale with shares.",
    },
    {
      id: "a_diversifywhy",
      prompt: "Diversification mainly helps reduce…",
      correct: "risk swings 🎢",
      distractors: [
        "rain clouds 🌧️",
        "calendar pages 📅",
        "music beats 🎵",
        "keyboard taps ⌨️",
      ],
      explain: "Spreads risk across assets.",
    },
  ];

  const source = difficulty === "advanced" ? advancedPool : basicPool;
  const selected = source.sort(() => Math.random() - 0.5).slice(0, 10);
  return selected.map((q) => {
    const two = [...q.distractors].sort(() => Math.random() - 0.5).slice(0, 2);
    const choices = [q.correct, ...two].sort(() => Math.random() - 0.5);
    return {
      id: q.id,
      prompt: q.prompt,
      choices,
      answer: choices.indexOf(q.correct),
      explain: q.explain,
    };
  });
}

const learnCards = [
  {
    id: "l_piece",
    title: "What is a Stock?",
    text: "A stock is a tiny PIECE of a company. When you own a share you are a tiny OWNER.\nCompanies sell shares to get money to build things.",
  },
  {
    id: "l_wiggles",
    title: "Price Wiggles",
    text: "Prices go UP and DOWN every day. That is NORMAL.\nWe do not panic about wiggles; we think about the long journey.",
  },
  {
    id: "l_diverse",
    title: "Fruit Basket Idea",
    text: "Owning MANY DIFFERENT kinds is like a FRUIT BASKET.\nIf one fruit gets mushy the others are still tasty. This lowers RISK.",
  },
  {
    id: "l_time",
    title: "Time & Patience",
    text: "TIME lets little companies grow like trees. Patience helps growth build on growth (COMPOUNDING).\nMore years = more chances for growth.",
  },
  {
    id: "l_compound",
    title: "Compounding",
    text: "Growth on top of past growth is COMPOUNDING.\nExample: 1 coin grows to 2, then both grow to 4, then 8. It speeds up over time.",
  },
  {
    id: "l_ticker",
    title: "Ticker Letters",
    text: "Short letter codes (AAPL, MSFT) are TICKERS.\nThey are like name TAGS so we can find a company quickly.",
  },
  {
    id: "l_saving",
    title: "Save vs Spend vs Invest",
    text: "Spend = FUN NOW.\nSave = KEEP SAFE for emergencies.\nInvest = GROW for LATER goals.",
  },
  {
    id: "l_dividend",
    title: "Dividends",
    text: "Some companies share a little CASH with owners. That payment is a DIVIDEND.\nYou can spend it or buy more shares.",
  },
  {
    id: "l_reinvest",
    title: "Reinvesting",
    text: "REINVESTING means using dividends or new coins to buy MORE shares.\nThat boosts compounding over many years.",
  },
  {
    id: "l_fees",
    title: "Fees Matter",
    text: "High FEES take little bites from growth. Lower fees leave MORE to compound.\nSmall differences grow big over time.",
  },
  {
    id: "l_risk",
    title: "Why Diversify?",
    text: "Different stocks mean one bad day hurts LESS.\nSpreading RISK = smoother ride for your money.",
  },
  {
    id: "l_emotion",
    title: "Stay Calm",
    text: "Feelings like FEAR or FOMO can trick us.\nCalm + Plan > Panic. We use facts, not sudden feelings.",
  },
  {
    id: "l_consistent",
    title: "Consistency",
    text: "Adding a little money again and again (CONSISTENTLY) can beat adding a lot only once.\nRegular habits matter.",
  },
  {
    id: "l_plan",
    title: "Have a Plan",
    text: "A simple PLAN: Save first, invest slowly, diversify, stay calm, think long term, keep learning.",
  },
  {
    id: "l_sell",
    title: "When to Sell",
    text: "Maybe sell if a company is doing badly or you need to rebalance your basket.\nNOT just because of a normal wiggle.",
  },
  {
    id: "l_balance",
    title: "Balance",
    text: "Mixing different things (stocks, maybe later other assets) keeps BALANCE.\nBalance helps avoid giant swings.",
  },
];

export default function KidsGameView() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState(null); // 'basic' | 'advanced' | 'learn'
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplain, setShowExplain] = useState(false);
  const [done, setDone] = useState(false);
  const [learnIdx, setLearnIdx] = useState(0);
  const [vidIdx, setVidIdx] = useState(0); // carousel index

  useEffect(() => {
    if (difficulty === "basic" || difficulty === "advanced") {
      setQuestions(buildQuestions(difficulty));
      setIdx(0);
      setScore(0);
      setCoins(0);
      setSelected(null);
      setShowExplain(false);
      setDone(false);
    } else if (difficulty === "learn") {
      // reset learn mode
      setQuestions([]);
      setLearnIdx(0);
      setSelected(null);
      setShowExplain(false);
      setDone(false);
    }
  }, [difficulty]);

  const inLearn = difficulty === "learn";
  const current = questions[idx];
  const total = inLearn ? learnCards.length : questions.length || 10;
  const learnCard = inLearn ? learnCards[learnIdx] : null;

  const nextLearn = () => {
    setLearnIdx((i) => {
      const n = i + 1;
      if (n >= learnCards.length) {
        setDone(true);
        return i;
      }
      return n;
    });
  };

  const pick = (i) => {
    if (inLearn) return; // ignore in learn mode
    if (selected !== null || done) return;
    setSelected(i);
    if (current && i === current.answer) {
      setScore((s) => s + 1);
      const reward = 1 + Math.floor(Math.random() * 2);
      setCoins((c) => c + reward);
    }
    setShowExplain(true);
    setTimeout(() => {
      setShowExplain(false);
      setSelected(null);
      setIdx((prev) => {
        const next = prev + 1;
        if (next >= questions.length) {
          setDone(true);
          return prev;
        }
        return next;
      });
    }, 1600);
  };

  const playAgain = () => {
    if (inLearn) {
      setLearnIdx(0);
      setDone(false);
      return;
    }
    if (!difficulty) {
      changeLevel();
      return;
    }
    setQuestions(buildQuestions(difficulty));
    setIdx(0);
    setScore(0);
    setCoins(0);
    setSelected(null);
    setShowExplain(false);
    setDone(false);
  };

  const changeLevel = () => {
    setDifficulty(null);
    setQuestions([]);
    setIdx(0);
    setScore(0);
    setCoins(0);
    setSelected(null);
    setShowExplain(false);
    setDone(false);
    setLearnIdx(0);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [idx, done, learnIdx, difficulty, vidIdx]);

  const nextVideo = () => setVidIdx((i) => (i + 1) % introVideos.length);
  const prevVideo = () =>
    setVidIdx((i) => (i - 1 + introVideos.length) % introVideos.length);
  const goVideo = (n) => setVidIdx(n);

  // touch swipe support (lightweight)
  const touchData = React.useRef(null);
  const onTouchStart = (e) => {
    touchData.current = { x: e.touches[0].clientX };
  };
  const onTouchEnd = (e) => {
    if (!touchData.current) return;
    const dx = e.changedTouches[0].clientX - touchData.current.x;
    if (Math.abs(dx) > 50) {
      if (dx < 0) nextVideo();
      else prevVideo();
    }
    touchData.current = null;
  };

  const introVideos = [
    {
      id: "Epzr8azlxp8",
      title: "Stocks for Kids (EasyPeasyFinance)",
      by: "EasyPeasyFinance",
    },
    { id: "9CchpWy29es", title: "What Are Stocks? (PragerU)", by: "PragerU" },
    {
      id: "2fLd4VQHKNg",
      title: "What is the Stock Market?",
      by: "Super Simple",
    },
  ];

  return (
    <Wrapper>
      <Header>
        <BackBtn onClick={() => navigate("/")}>🏠 Home</BackBtn>
        <Title>Kids Stock Adventure ✨</Title>
      </Header>
      <Area>
        {difficulty === null && (
          <CarouselContainer>
            <CarouselHeader>
              <CarouselTitle aria-label="Intro Videos Carousel">
                🎬 Learn First
              </CarouselTitle>
              <NavBtns>
                <NavBtn
                  onClick={prevVideo}
                  aria-label="Previous video"
                  disabled={introVideos.length <= 1}
                >
                  ◀
                </NavBtn>
                <NavBtn
                  onClick={nextVideo}
                  aria-label="Next video"
                  disabled={introVideos.length <= 1}
                >
                  ▶
                </NavBtn>
              </NavBtns>
            </CarouselHeader>
            <VideoWrap
              role="group"
              aria-roledescription="slide"
              aria-label={`${introVideos[vidIdx].title} (${vidIdx + 1} of ${introVideos.length})`}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <iframe
                key={introVideos[vidIdx].id}
                src={`https://www.youtube.com/embed/${introVideos[vidIdx].id}`}
                title={introVideos[vidIdx].title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </VideoWrap>
            <VideoMeta>
              {introVideos[vidIdx].title} • {introVideos[vidIdx].by}
            </VideoMeta>
            <Dots role="tablist" aria-label="Video selection">
              {introVideos.map((v, i) => (
                <DotBtn
                  key={v.id}
                  aria-label={`Go to video ${i + 1}: ${v.title}`}
                  aria-selected={vidIdx === i}
                  $active={vidIdx === i}
                  onClick={() => goVideo(i)}
                />
              ))}
            </Dots>
          </CarouselContainer>
        )}
        {/* Progress / Score for quiz modes only */}
        {!done && !inLearn && difficulty && (
          <>
            <Progress aria-label="progress">
              <ProgressFill $w={(idx / total) * 100} />
            </Progress>
            <ScoreRow>
              <StatBox>
                <Tiny>QUESTION</Tiny>
                {idx + 1} / {total}
              </StatBox>
              <StatBox>
                <Tiny>SCORE</Tiny>
                {score}
              </StatBox>
              <StatBox>
                <Tiny>COINS</Tiny>
                {coins} 💰
              </StatBox>
            </ScoreRow>
            <InlineNav>
              <KidsHomeBtn
                onClick={changeLevel}
                aria-label="Return to kids home (mode selection)"
              >
                🏡 Kids Home
              </KidsHomeBtn>
            </InlineNav>
          </>
        )}
        {/* Learn mode progress */}
        {!done && inLearn && (
          <>
            <Progress aria-label="progress">
              <ProgressFill $w={(learnIdx / total) * 100} />
            </Progress>
            <InlineNav>
              <KidsHomeBtn
                onClick={changeLevel}
                aria-label="Return to kids home (mode selection)"
              >
                🏡 Kids Home
              </KidsHomeBtn>
            </InlineNav>
          </>
        )}

        {/* Mode selection */}
        {!done && difficulty === null && (
          <Card>
            <h2>Select Mode</h2>
            <p style={{ marginTop: 6, fontWeight: 600, fontSize: ".9rem" }}>
              Pick one to begin.
            </p>
            <Choices style={{ justifyContent: "center", marginTop: 16 }}>
              <ChoiceBtn
                onClick={() => setDifficulty("learn")}
                style={{ minWidth: 140 }}
                $color="linear-gradient(135deg,#b2e5ff,#58a6ff)"
              >
                📘 Learn
              </ChoiceBtn>
              <ChoiceBtn
                onClick={() => setDifficulty("basic")}
                style={{ minWidth: 140 }}
              >
                🧸 Basic Quiz
              </ChoiceBtn>
              <ChoiceBtn
                onClick={() => setDifficulty("advanced")}
                style={{ minWidth: 140 }}
              >
                🎓 Advanced Quiz
              </ChoiceBtn>
            </Choices>
          </Card>
        )}

        {/* Learn mode card */}
        {!done && inLearn && learnCard && (
          <Card aria-live="polite">
            <h2 style={{ marginTop: 0 }}>{learnCard.title}</h2>
            <p
              style={{
                whiteSpace: "pre-line",
                fontWeight: 600,
                fontSize: "1rem",
                lineHeight: 1.35,
              }}
            >
              {learnCard.text}
            </p>
            <div
              style={{
                marginTop: 24,
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                justifyContent: "center",
              }}
            >
              <ChoiceBtn
                onClick={nextLearn}
                $color="linear-gradient(135deg,#ffd36e,#ffa726)"
              >
                ➡️ {learnIdx + 1 >= learnCards.length ? "Finish" : "Next"}
              </ChoiceBtn>
              {/* Quiz buttons hidden until the end now */}
            </div>
            <div
              style={{
                marginTop: 18,
                fontSize: ".7rem",
                letterSpacing: ".8px",
                opacity: 0.7,
              }}
            >
              Card {learnIdx + 1} / {learnCards.length}
            </div>
          </Card>
        )}

        {/* Quiz question card */}
        {!done && !inLearn && difficulty && current && (
          <Card aria-live="polite">
            <Prompt>
              <span>{current.prompt}</span>
              <SmallExplain>Tap a bubble!</SmallExplain>
            </Prompt>
            <Choices>
              {current.choices.map((ch, i) => {
                const isAnswer = i === current.answer;
                const isPicked = selected === i;
                let bg = "linear-gradient(135deg,#b2f7b2,#58d658)";
                if (selected !== null) {
                  if (isPicked && isAnswer)
                    bg = "linear-gradient(135deg,#9af7d3,#25cfa2)";
                  else if (isPicked && !isAnswer)
                    bg = "linear-gradient(135deg,#ffb3b3,#ff7d7d)";
                  else if (isAnswer)
                    bg = "linear-gradient(135deg,#ffe27a,#ffcc33)";
                  else bg = "linear-gradient(135deg,#e3edf2,#c9dbe5)";
                }
                return (
                  <ChoiceBtn
                    key={ch}
                    onClick={() => pick(i)}
                    disabled={selected !== null}
                    $color={bg}
                    aria-label={`choice ${i + 1}`}
                  >
                    {ch}
                  </ChoiceBtn>
                );
              })}
            </Choices>
            {showExplain && (
              <Feedback>
                {selected === current.answer ? "✅ Nice!" : "❌ Oops!"}&nbsp;
                <span
                  style={{ fontSize: ".9rem", display: "block", marginTop: 6 }}
                >
                  {current.explain}
                </span>
              </Feedback>
            )}
          </Card>
        )}

        {/* Finish screens */}
        {done && !inLearn && (
          <FinishCard aria-live="polite">
            <h2 style={{ margin: "0 0 12px", fontSize: "2rem" }}>
              Great Job! 🏆
            </h2>
            <p style={{ margin: "0 0 10px", fontWeight: 600 }}>
              You answered {score} of {total} questions and earned {coins} coin
              {coins === 1 ? "" : "s"}!
            </p>
            <MiniExplainList>
              <li>Stock = tiny piece of a company.</li>
              <li>Up & down wiggles are normal.</li>
              <li>Different kinds (fruit basket) is safer.</li>
              <li>Patience helps them grow big.</li>
            </MiniExplainList>
            <div
              style={{
                marginTop: 28,
                display: "flex",
                gap: 18,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <PlayAgain onClick={playAgain}>▶️ Play Again</PlayAgain>
              <ChoiceBtn
                $color="linear-gradient(135deg,#b2e5ff,#58a6ff)"
                onClick={() => navigate("/")}
              >
                🏠 Home
              </ChoiceBtn>
              <ChoiceBtn
                $color="linear-gradient(135deg,#d3b2ff,#8f58ff)"
                onClick={changeLevel}
              >
                🔄 Change Mode
              </ChoiceBtn>
              <ChoiceBtn
                $color="linear-gradient(135deg,#9af7d3,#25cfa2)"
                onClick={() => setDifficulty("learn")}
              >
                📘 Learn
              </ChoiceBtn>
            </div>
          </FinishCard>
        )}
        {done && inLearn && (
          <FinishCard aria-live="polite">
            <h2 style={{ margin: "0 0 12px", fontSize: "2rem" }}>
              Learning Complete ✅
            </h2>
            <p style={{ margin: "0 0 14px", fontWeight: 600 }}>
              You explored {learnCards.length} core ideas. Ready for a quiz?
            </p>
            <MiniExplainList>
              <li>Stock = piece. Diversify like a basket.</li>
              <li>Wiggles normal. Stay calm.</li>
              <li>Time + reinvest + low fees = compounding.</li>
              <li>Plan + consistency + patience win.</li>
            </MiniExplainList>
            <div
              style={{
                marginTop: 28,
                display: "flex",
                gap: 18,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <PlayAgain onClick={playAgain}>📘 Review Again</PlayAgain>
              <ChoiceBtn
                $color="linear-gradient(135deg,#b2f7b2,#58d658)"
                onClick={() => setDifficulty("basic")}
              >
                🧸 Basic Quiz
              </ChoiceBtn>
              <ChoiceBtn
                $color="linear-gradient(135deg,#9af7d3,#25cfa2)"
                onClick={() => setDifficulty("advanced")}
              >
                🎓 Advanced Quiz
              </ChoiceBtn>
              <ChoiceBtn
                $color="linear-gradient(135deg,#d3b2ff,#8f58ff)"
                onClick={changeLevel}
              >
                🔄 Mode Select
              </ChoiceBtn>
              <ChoiceBtn
                $color="linear-gradient(135deg,#b2e5ff,#58a6ff)"
                onClick={() => navigate("/")}
              >
                🏠 Home
              </ChoiceBtn>
            </div>
          </FinishCard>
        )}
      </Area>
    </Wrapper>
  );
}
