const API_KEY = 'buc51vv48v6oa2u4gkpg';

export async function getStockData(ticker) {
    const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${API_KEY}`

    const res = await fetch(url);

    if (!res.ok) {
        return false;
    }

    const data = await res.json();

    return data.c;
}


