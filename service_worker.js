/* Euro Quick Quote - Service Worker (MV3)
   Data source: Yahoo Finance API (free, no API key required).

   European Stock Exchanges (Yahoo Finance suffixes):
   - .LS = Euronext Lisboa (Portugal)
   - .PA = Euronext Paris (France)
   - .AS = Euronext Amsterdam (Netherlands)
   - .DE = Xetra (Germany)
   - .MC = Bolsa de Madrid (Spain)
   - .MI = Borsa Italiana (Italy)
   - .BR = Euronext Brussels (Belgium)

   API Endpoint: https://query1.finance.yahoo.com/v8/finance/chart/{SYMBOL}
*/

const YAHOO_CHART_API = "https://query1.finance.yahoo.com/v8/finance/chart/";

// European stocks for Top 3 feature - organized by exchange
// Portugal (Euronext Lisboa - .LS)
const PORTUGAL_STOCKS = [
  "GALP.LS", "EDP.LS", "EDPR.LS", "JMT.LS", "BCP.LS", 
  "NOS.LS", "SON.LS", "CTT.LS", "ALTR.LS", "SEM.LS"
];

// France (Euronext Paris - .PA)
const FRANCE_STOCKS = [
  "TTE.PA", "AIR.PA", "SAN.PA", "OR.PA", "MC.PA", 
  "BNP.PA", "AI.PA", "CS.PA", "DG.PA", "CAP.PA"
];

// Netherlands (Euronext Amsterdam - .AS)
const NETHERLANDS_STOCKS = [
  "ASML.AS", "SHELL.AS", "UNA.AS", "INGA.AS", "PHIA.AS", 
  "HEIA.AS", "AD.AS", "WKL.AS", "RAND.AS", "ABN.AS"
];

// Germany (Xetra - .DE)
const GERMANY_STOCKS = [
  "SAP.DE", "SIE.DE", "ALV.DE", "MBG.DE", "BMW.DE", 
  "DTE.DE", "BAS.DE", "MUV2.DE", "VOW3.DE", "ADS.DE"
];

// Spain (Bolsa de Madrid - .MC)
const SPAIN_STOCKS = [
  "SAN.MC", "IBE.MC", "TEF.MC", "ITX.MC", "REP.MC", 
  "BBVA.MC", "CABK.MC", "FER.MC", "ACS.MC", "ENG.MC"
];

// Combined European stocks list for Top 3
const EURO_STOCKS = [
  ...PORTUGAL_STOCKS,
  ...FRANCE_STOCKS.slice(0, 5),
  ...NETHERLANDS_STOCKS.slice(0, 5),
  ...GERMANY_STOCKS.slice(0, 5),
  ...SPAIN_STOCKS.slice(0, 5)
];

// European ETFs/Indices (as alternative to REITs which are less common in Europe)
const EURO_ETFS = [
  "VEUR.AS",   // Vanguard FTSE Developed Europe
  "IEUR.AS",   // iShares Core MSCI Europe
  "EXW1.DE",   // iShares STOXX Europe 600
  "MEUD.PA",   // Amundi MSCI Europe
  "PSI20.LS",  // PSI-20 Index (Portugal)
  "CAC.PA",    // CAC 40 ETF (France)
  "DAX.DE",    // DAX ETF (Germany)
  "IBEX.MC"    // IBEX 35 ETF (Spain)
];

function cleanTicker(input) {
  // Allow alphanumeric, dots, and hyphens for European tickers like GALP.LS
  return String(input || "").trim().toUpperCase();
}

function normalizeSymbol(ticker) {
  // If ticker already has exchange suffix, use as-is
  // Otherwise, we'll need user to specify or default to a common exchange
  const cleaned = cleanTicker(ticker);
  if (!cleaned) return "";
  
  // Check if already has exchange suffix (contains a dot followed by 2-3 letters)
  if (/\.[A-Z]{2,3}$/.test(cleaned)) {
    return cleaned;
  }
  
  // Return as-is - user needs to provide full symbol
  return cleaned;
}

function num(x) {
  const v = parseFloat(x);
  return Number.isFinite(v) ? v : null;
}

async function fetchYahooChart(symbol) {
  const url = `${YAHOO_CHART_API}${encodeURIComponent(symbol)}?interval=1d&range=5d`;
  
  const res = await fetch(url, { 
    method: "GET", 
    cache: "no-store",
    headers: {
      "Accept": "application/json"
    }
  });
  
  if (!res.ok) {
    throw new Error(`Yahoo Finance request failed (${res.status})`);
  }
  
  const data = await res.json();
  
  if (data.chart?.error) {
    throw new Error(data.chart.error.description || "Yahoo Finance error");
  }
  
  if (!data.chart?.result?.[0]) {
    throw new Error("Symbol not found or no data available.");
  }
  
  return data.chart.result[0];
}

function parseYahooQuote(result, originalSymbol) {
  const meta = result.meta || {};
  const quotes = result.indicators?.quote?.[0] || {};
  
  // Get latest valid price data
  const timestamps = result.timestamp || [];
  let lastValidIdx = timestamps.length - 1;
  
  // Find last non-null close price
  const closes = quotes.close || [];
  while (lastValidIdx >= 0 && closes[lastValidIdx] == null) {
    lastValidIdx--;
  }
  
  const regularMarketPrice = meta.regularMarketPrice ?? num(closes[lastValidIdx]);
  const previousClose = meta.chartPreviousClose ?? meta.previousClose;
  
  // Calculate change
  let change = null;
  let changePercent = null;
  if (regularMarketPrice != null && previousClose != null && previousClose !== 0) {
    change = regularMarketPrice - previousClose;
    changePercent = (change / previousClose) * 100;
  }
  
  // Get OHLV for the current day
  const opens = quotes.open || [];
  const highs = quotes.high || [];
  const lows = quotes.low || [];
  const volumes = quotes.volume || [];
  
  // Find first valid open of the day
  let firstValidIdx = 0;
  while (firstValidIdx < opens.length && opens[firstValidIdx] == null) {
    firstValidIdx++;
  }
  
  // Calculate day high/low from intraday data or use meta
  let dayHigh = meta.regularMarketDayHigh;
  let dayLow = meta.regularMarketDayLow;
  let dayOpen = num(opens[firstValidIdx]);
  let totalVolume = meta.regularMarketVolume || 0;
  
  // Sum up volume if not in meta
  if (!totalVolume) {
    totalVolume = volumes.reduce((sum, v) => sum + (v || 0), 0);
  }
  
  return {
    displaySymbol: originalSymbol,
    symbol: meta.symbol || originalSymbol,
    shortName: meta.shortName || originalSymbol,
    longName: meta.longName || meta.shortName || originalSymbol,
    currency: meta.currency || "EUR",
    exchangeName: meta.fullExchangeName || meta.exchangeName || "",
    regularMarketPrice: regularMarketPrice,
    regularMarketOpen: dayOpen,
    regularMarketDayHigh: dayHigh,
    regularMarketDayLow: dayLow,
    regularMarketVolume: totalVolume,
    regularMarketChange: change,
    regularMarketChangePercent: changePercent,
    previousClose: previousClose,
    marketTime: meta.regularMarketTime || Math.floor(Date.now() / 1000)
  };
}

async function getQuote(inputTicker) {
  const symbol = normalizeSymbol(inputTicker);
  if (!symbol) throw new Error("Invalid ticker. Use format: SYMBOL.EXCHANGE (e.g., GALP.LS, SAP.DE)");
  
  const result = await fetchYahooChart(symbol);
  const quote = parseYahooQuote(result, symbol);
  
  if (quote.regularMarketPrice == null) {
    throw new Error("No price data available for this symbol.");
  }
  
  return quote;
}

async function getQuotesMany(tickers, concurrency = 6) {
  const out = [];
  let idx = 0;
  
  async function worker() {
    while (idx < tickers.length) {
      const i = idx++;
      const t = tickers[i];
      try {
        const q = await getQuote(t);
        out.push(q);
      } catch (_e) {
        // Skip failed quotes silently
      }
    }
  }
  
  await Promise.all(Array.from({ length: concurrency }, worker));
  return out;
}

function top3FromQuotes(quotes, direction) {
  const clean = quotes
    .filter(q => typeof q.regularMarketChangePercent === "number" && isFinite(q.regularMarketChangePercent))
    .map(q => ({ 
      displaySymbol: q.displaySymbol, 
      pct: q.regularMarketChangePercent,
      currency: q.currency 
    }));

  clean.sort((a, b) => a.pct - b.pct);
  const sorted = direction === "gainers" ? clean.slice().reverse() : clean.slice();
  return sorted.slice(0, 3);
}

async function getTops() {
  const now = Date.now();
  const store = chrome.storage.session || chrome.storage.local;
  const cache = await store.get(["topsCache"]).catch(() => ({}));
  const cached = cache?.topsCache;
  
  // Cache for 60 seconds (increased from 30s to reduce API calls)
  if (cached && (now - cached.updatedAt) < 60000) return cached;

  const [stocksQuotes, etfsQuotes] = await Promise.all([
    getQuotesMany(EURO_STOCKS, 6),
    getQuotesMany(EURO_ETFS, 4)
  ]);

  const data = {
    stocks: {
      gainers: top3FromQuotes(stocksQuotes, "gainers"),
      losers: top3FromQuotes(stocksQuotes, "losers")
    },
    fiis: { // Using "fiis" key for compatibility, but these are ETFs in Europe
      gainers: top3FromQuotes(etfsQuotes, "gainers"),
      losers: top3FromQuotes(etfsQuotes, "losers")
    },
    updatedAt: now
  };

  await store.set({ topsCache: data }).catch(() => {});
  return data;
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    try {
      if (msg?.type === "GET_QUOTE") {
        const data = await getQuote(msg.symbol);
        sendResponse({ ok: true, data });
        return;
      }
      if (msg?.type === "GET_TOPS") {
        const data = await getTops();
        sendResponse({ ok: true, data });
        return;
      }
      sendResponse({ ok: false, error: "Unknown message." });
    } catch (e) {
      sendResponse({ ok: false, error: e?.message || String(e) });
    }
  })();
  return true;
});
