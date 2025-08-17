import bradleyStocks from "./bradleyStocks.json";
import andrewStocks from "./andrewStocks.json";
import carterStocks from "./carterStocks.json";
import reaganStocks from "./reaganStocks.json";
import patrickStocks from "./patrickStocks.json";
import oliviaStocks from "./oliviaStocks.json";
import trinityStocks from "./trinityStocks.json";
import grantStocks from "./grantStocks.json";
import { getStockData } from "./stockApi";

async function addPriceToStocks(stock) {
  stock.current = await getStockData(stock.ticker);
  if (!stock.current || isNaN(stock.current)) {
    // Fallback to average cost if live price not available
    stock.current = parseFloat(stock.averageCost);
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
  const cloned = rawStocks.map(s => ({ ...s }));
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
