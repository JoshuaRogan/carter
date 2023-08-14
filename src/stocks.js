import bradleyStocks from "./bradleyStocks.json";
import carterStocks from "./carterStocks.json";
import reaganStocks from "./reaganStocks.json";
import patrickStocks from "./patrickStocks.json";
import { getStockData } from "./stockApi";

async function addPriceToStocks(stock) {
  stock.current = await getStockData(stock.ticker);
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
