/* Euro Quick Quote - Popup logic */
const $ = (id) => document.getElementById(id);

const els = {
  ticker: $("ticker"),
  btnSearch: $("btnSearch"),
  btnRefresh: $("btnRefresh"),
  quoteState: $("quoteState"),
  quoteBox: $("quoteBox"),
  qSymbol: $("qSymbol"),
  qName: $("qName"),
  qExchange: $("qExchange"),
  qPrice: $("qPrice"),
  qChange: $("qChange"),
  qOpen: $("qOpen"),
  qHigh: $("qHigh"),
  qLow: $("qLow"),
  qVol: $("qVol"),
  qTime: $("qTime"),

  btnLoadTops: $("btnLoadTops"),
  topsState: $("topsState"),
  topsBox: $("topsBox"),
  stocksGainers: $("stocksGainers"),
  stocksLosers: $("stocksLosers"),
  fiisGainers: $("fiisGainers"),
  fiisLosers: $("fiisLosers"),
};

// Currency formatting with dynamic currency support
function fmtCurrency(v, currency = "EUR") {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  try {
    // Map currency to locale
    const localeMap = {
      "EUR": "de-DE",
      "GBP": "en-GB",
      "USD": "en-US",
      "CHF": "de-CH",
      "SEK": "sv-SE",
      "NOK": "nb-NO",
      "DKK": "da-DK",
      "PLN": "pl-PL"
    };
    const locale = localeMap[currency] || "de-DE";
    return new Intl.NumberFormat(locale, { style: "currency", currency: currency }).format(v);
  } catch {
    return `€ ${Number(v).toFixed(2)}`;
  }
}

function fmtNum(v) {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  return new Intl.NumberFormat("de-DE").format(v);
}

function fmtPct(v) {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(2)}%`;
}

function setState(el, text) {
  el.textContent = text;
}

function setChangeClass(el, pct) {
  el.classList.remove("good", "bad", "neutral");
  if (pct > 0) el.classList.add("good");
  else if (pct < 0) el.classList.add("bad");
  else el.classList.add("neutral");
}

function normalizeTicker(input) {
  const t = (input || "").trim().toUpperCase();
  if (!t) return "";
  // Allow alphanumeric, dots, and hyphens for European tickers
  return t.replace(/[^A-Z0-9.\-]/g, "");
}

async function sendMessage(msg) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, (resp) => {
      const err = chrome.runtime.lastError;
      if (err) return reject(err);
      resolve(resp);
    });
  });
}

// Store current quote currency for formatting
let currentCurrency = "EUR";

function renderQuote(q) {
  els.quoteState.classList.add("hidden");
  els.quoteBox.classList.remove("hidden");

  // Update current currency
  currentCurrency = q.currency || "EUR";

  els.qSymbol.textContent = q.displaySymbol || q.symbol || "—";
  els.qName.textContent = q.shortName || q.longName || "—";
  
  // Show exchange name
  if (els.qExchange) {
    els.qExchange.textContent = q.exchangeName || "";
  }
  
  els.qPrice.textContent = fmtCurrency(q.regularMarketPrice, currentCurrency);
  
  const pct = q.regularMarketChangePercent ?? null;
  const chg = q.regularMarketChange ?? null;
  const sign = (chg ?? 0) > 0 ? "+" : "";
  els.qChange.textContent = `${fmtPct(pct)} (${sign}${(chg ?? 0).toFixed(2)})`;
  setChangeClass(els.qChange, pct ?? 0);

  els.qOpen.textContent = fmtCurrency(q.regularMarketOpen, currentCurrency);
  els.qHigh.textContent = fmtCurrency(q.regularMarketDayHigh, currentCurrency);
  els.qLow.textContent = fmtCurrency(q.regularMarketDayLow, currentCurrency);
  els.qVol.textContent = fmtNum(q.regularMarketVolume);

  els.qTime.textContent = q.marketTime
    ? `Updated: ${new Date(q.marketTime * 1000).toLocaleString("pt-PT")}`
    : "Updated: —";
}

function renderList(container, items) {
  container.innerHTML = "";
  items.forEach((it) => {
    const row = document.createElement("div");
    row.className = "item";
    const left = document.createElement("div");
    left.className = "sym";
    left.textContent = it.displaySymbol;

    const right = document.createElement("div");
    right.className = "chg " + (it.pct > 0 ? "good" : it.pct < 0 ? "bad" : "neutral");
    right.textContent = fmtPct(it.pct);

    row.appendChild(left);
    row.appendChild(right);
    container.appendChild(row);
  });
}

async function doSearch(refreshOnly = false) {
  const raw = els.ticker.value;
  const symbol = normalizeTicker(raw);
  if (!symbol) {
    els.quoteBox.classList.add("hidden");
    els.quoteState.classList.remove("hidden");
    setState(els.quoteState, "Enter a valid ticker (e.g., GALP.LS, ASML.AS, SAP.DE).");
    return;
  }

  els.btnSearch.disabled = true;
  els.btnRefresh.disabled = true;

  els.quoteBox.classList.add("hidden");
  els.quoteState.classList.remove("hidden");
  setState(els.quoteState, refreshOnly ? "Updating..." : "Fetching quote...");

  try {
    const resp = await sendMessage({ type: "GET_QUOTE", symbol });
    if (!resp?.ok) throw new Error(resp?.error || "Failed to get quote.");
    renderQuote(resp.data);

    // persist last ticker
    chrome.storage.local.set({ lastTicker: raw.trim().toUpperCase() }).catch(() => {});
  } catch (e) {
    els.quoteBox.classList.add("hidden");
    els.quoteState.classList.remove("hidden");
    setState(els.quoteState, `Error: ${e.message || e}`);
  } finally {
    els.btnSearch.disabled = false;
    els.btnRefresh.disabled = false;
  }
}

async function loadTops() {
  els.btnLoadTops.disabled = true;
  els.topsBox.classList.add("hidden");
  els.topsState.classList.remove("hidden");
  setState(els.topsState, "Loading Top 3...");

  try {
    const resp = await sendMessage({ type: "GET_TOPS" });
    if (!resp?.ok) throw new Error(resp?.error || "Failed to get Top 3.");

    const { stocks, fiis, updatedAt } = resp.data;

    renderList(els.stocksGainers, stocks.gainers);
    renderList(els.stocksLosers, stocks.losers);
    renderList(els.fiisGainers, fiis.gainers);
    renderList(els.fiisLosers, fiis.losers);

    els.topsState.classList.add("hidden");
    els.topsBox.classList.remove("hidden");

    // add timestamp to state if needed
    const note = document.querySelector(".mini-note");
    if (note && updatedAt) {
      note.textContent = `Note: Top 3 is calculated from a curated list of European assets. Updated: ${new Date(updatedAt).toLocaleString("pt-PT")}.`;
    }
  } catch (e) {
    els.topsBox.classList.add("hidden");
    els.topsState.classList.remove("hidden");
    setState(els.topsState, `Error: ${e.message || e}`);
  } finally {
    els.btnLoadTops.disabled = false;
  }
}

els.btnSearch.addEventListener("click", () => doSearch(false));
els.btnRefresh.addEventListener("click", () => doSearch(true));
els.btnLoadTops.addEventListener("click", () => loadTops());

els.ticker.addEventListener("keydown", (e) => {
  if (e.key === "Enter") doSearch(false);
});

// Load last ticker
chrome.storage.local.get(["lastTicker"], (res) => {
  if (res?.lastTicker) els.ticker.value = res.lastTicker;
});

// Auto refresh quote while popup is open (every 30s) if quote is visible
setInterval(() => {
  const isVisible = !els.quoteBox.classList.contains("hidden");
  if (isVisible) doSearch(true);
}, 30000);
