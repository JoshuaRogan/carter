import { getStockData } from './stockApi';
import stocks from './stocks.json';

async function addPriceToStocks(stock) {
  stock.current = await getStockData(stock.ticker);
  return stock;
}

export async function getStocks() {
  const stocksWithPrice = await Promise.all(stocks.map(addPriceToStocks));
  return stocksWithPrice;
}

export function sumStocks(stocks) {
  return stocks.reduce((accum, stock) => {
    return accum + stock.current * stock.shares;
  }, 0)
}
