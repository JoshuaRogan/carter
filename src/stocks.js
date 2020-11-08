import { getStockData } from "./stockApi";
import carterStocks from "./carterStocks.json";
import bradleyStocks from "./bradleyStocks.json";

async function addPriceToStocks(stock) {
  stock.current = await getStockData(stock.ticker);
  return stock;
}

async function getStocks(stocks) {
  const stocksWithPrice = await Promise.all(stocks.map(addPriceToStocks));
  return stocksWithPrice;
}

export async function getBradleyStocks() {
  return getStocks(bradleyStocks);
}

export async function getCarterStocks() {
  return getStocks(bradleyStocks);
}

export function sumStocks(stocks) {
  return stocks.reduce((accum, stock) => {
    return accum + stock.current * stock.shares;
  }, 0);
}
