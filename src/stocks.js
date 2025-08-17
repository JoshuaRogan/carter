import bradleyStocks from "./bradleyStocks.json";
import andrewStocks from "./andrewStocks.json";
import carterStocks from "./carterStocks.json";
import reaganStocks from "./reaganStocks.json";
import patrickStocks from "./patrickStocks.json";
import oliviaStocks from "./oliviaStocks.json";
import trinityStocks from "./trinityStocks.json";
import grantStocks from "./grantStocks.json";
import { getStockData } from "./stockApi";

// Compute weighted average cost & totalShares from lots
export function computeLotAverages(lots) {
  if (!lots || !Array.isArray(lots) || lots.length === 0) {
    return { averageCost: undefined, totalShares: 0 };
  }
  let totalShares = 0;
  let totalCost = 0;
  for (const lot of lots) {
    const lotShares = parseFloat(lot.shares);
    const lotPrice = parseFloat(lot.price);
    if (!isNaN(lotShares) && lotShares > 0 && !isNaN(lotPrice)) {
      totalShares += lotShares;
      totalCost += lotShares * lotPrice;
    }
  }
  if (totalShares <= 0) {
    return { averageCost: undefined, totalShares: 0 };
  }
  return {
    averageCost: parseFloat((totalCost / totalShares).toFixed(4)),
    totalShares,
  };
}

async function addPriceToStocks(stock) {
  if (stock.lots) {
    const { averageCost, totalShares } = computeLotAverages(stock.lots);
    if (averageCost !== undefined) {
      stock.averageCost = averageCost;
      stock.shares = totalShares;
    } else {
      stock.averageCost = parseFloat(stock.averageCost);
      stock.shares =
        typeof stock.shares === "number"
          ? stock.shares
          : parseFloat(stock.shares);
    }
  } else {
    stock.averageCost = parseFloat(stock.averageCost);
    stock.shares =
      typeof stock.shares === "number"
        ? stock.shares
        : parseFloat(stock.shares);
  }

  const fetched = await getStockData(stock.ticker);
  if (fetched === false) {
    stock._priceFetchFailed = true; // mark failure for UI warnings
    stock.current = stock.averageCost; // graceful fallback to cost
  } else {
    stock.current = fetched;
  }
  if (!stock.current || isNaN(stock.current)) {
    stock._priceFetchFailed = true;
    stock.current = stock.averageCost;
  }
  return stock;
}

async function getStocks(stocks) {
  return await Promise.all(stocks.map(addPriceToStocks));
}

export async function getBradleyStocks() {
  return getStocks(bradleyStocks);
}

export async function getReaganStocks() {
  return getStocks(reaganStocks);
}

export async function getPatrickStocks() {
  return getStocks(patrickStocks);
}

export async function getCarterStocks() {
  return getStocks(carterStocks);
}

export async function getOliviaStocks() {
  return getStocks(oliviaStocks);
}

export async function getTrinityStocks() {
  return getStocks(trinityStocks);
}

export async function getGrantStocks() {
  return getStocks(grantStocks);
}

export async function getAndrewStocks() {
  return getStocks(andrewStocks);
}

// Generic utility to enrich any provided stocks JSON array with current prices
export async function enrichStocks(rawStocks) {
  // clone to avoid mutating original imported JSON arrays
  const cloned = rawStocks.map((s) => ({ ...s }));
  return getStocks(cloned);
}

export function sumStocks(stocks) {
  return stocks.reduce((accum, stock) => {
    return accum + stock.current * stock.shares;
  }, 0);
}

export function sumInvestmentAmount(stocks) {
  return stocks.reduce((accum, stock) => {
    return accum + stock.averageCost * stock.shares;
  }, 0);
}
