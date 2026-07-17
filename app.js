const STORAGE_KEY = "private-us-stock-desk-v1";
const DRAWINGS_STORAGE_KEY = "private-stock-desk-drawings-v1";
const DISPLAY_DECIMALS = 2;
const CHART_DECIMALS = 3;
const LOCAL_DATA_ORIGIN = "http://127.0.0.1:4173";
const CHART_MARGIN = Object.freeze({ top: 24, right: 80, bottom: 42, left: 16 });
const CHART_AXIS_GAP = 8;

const TIMEFRAME_CONFIG = {
  "15m": {
    range: "60d",
    interval: "15m",
    points: 960,
    stepMs: 15 * 60 * 1000,
    visibleCandles: 72,
  },
  "1H": {
    range: "6mo",
    interval: "60m",
    points: 760,
    stepMs: 60 * 60 * 1000,
    visibleCandles: 88,
  },
  "4H": {
    range: "1y",
    interval: "60m",
    points: 520,
    stepMs: 4 * 60 * 60 * 1000,
    visibleCandles: 80,
    aggregate: 4,
  },
  "1D": {
    range: "5y",
    interval: "1d",
    points: 1260,
    stepMs: 24 * 60 * 60 * 1000,
    visibleCandles: 90,
  },
  "1W": {
    range: "10y",
    interval: "1wk",
    points: 520,
    stepMs: 7 * 24 * 60 * 60 * 1000,
    visibleCandles: 110,
  },
};

const MARKET_CONFIG = {
  US: {
    label: "美股",
    currency: "USD",
  },
  CN: {
    label: "A 股",
    currency: "CNY",
  },
};

const ICONS = {
  refresh: '<svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 0 1-14.8 6.9"/><path d="M3 12A9 9 0 0 1 17.8 5.1"/><path d="M17 1v5h5"/><path d="M7 23v-5H2"/></svg>',
  save: '<svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',
  upload: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>',
  download: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
  database: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 15H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>',
  edit: '<svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  expand: '<svg viewBox="0 0 24 24"><path d="M15 3h6v6"/><path d="M21 3l-7 7"/><path d="M9 21H3v-6"/><path d="M3 21l7-7"/></svg>',
  collapse: '<svg viewBox="0 0 24 24"><path d="M8 3v5H3"/><path d="M3 8l6-6"/><path d="M16 21v-5h5"/><path d="M21 16l-6 6"/></svg>',
  trendLine: '<svg viewBox="0 0 24 24"><path d="M4 18 20 6"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="6" r="2"/></svg>',
  undo: '<svg viewBox="0 0 24 24"><path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-4"/></svg>',
  eye: '<svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg viewBox="0 0 24 24"><path d="m3 3 18 18"/><path d="M10.6 10.6A3 3 0 0 0 13.4 13.4"/><path d="M9.9 4.2A10.6 10.6 0 0 1 12 4.0c6.5 0 10 8 10 8a17.7 17.7 0 0 1-3.1 4.4"/><path d="M6.6 6.6C3.7 8.5 2 12 2 12s3.5 8 10 8a10.4 10.4 0 0 0 4.4-1"/></svg>',
};

const SAMPLE_HOLDINGS = [
  {
    id: createId(),
    symbol: "AAPL",
    market: "US",
    currency: "USD",
    name: "Apple",
    shares: 12,
    avgCost: 174.5,
    targetPrice: 230,
    stopLoss: 158,
    notes: "核心消费科技持仓，关注 iPhone 周期、服务收入和回购力度。",
  },
  {
    id: createId(),
    symbol: "NVDA",
    market: "US",
    currency: "USD",
    name: "NVIDIA",
    shares: 8,
    avgCost: 940,
    targetPrice: 1250,
    stopLoss: 820,
    notes: "AI 基础设施主线，重点观察数据中心收入增速和毛利率变化。",
  },
  {
    id: createId(),
    symbol: "MSFT",
    market: "US",
    currency: "USD",
    name: "Microsoft",
    shares: 6,
    avgCost: 390,
    targetPrice: 520,
    stopLoss: 360,
    notes: "云与 AI 平台型持仓，观察 Azure 增速和 Copilot 商业化。",
  },
  {
    id: createId(),
    symbol: "600519.SH",
    market: "CN",
    currency: "CNY",
    name: "贵州茅台",
    shares: 1,
    avgCost: 1500,
    targetPrice: 1800,
    stopLoss: 1350,
    notes: "A 股示例持仓，关注白酒消费趋势、分红和业绩稳定性。",
  },
];

const state = {
  holdings: loadHoldings(),
  quotes: {},
  charts: {},
  chartViews: {},
  chartSelections: {},
  chartHover: null,
  drawings: loadDrawings(),
  drawingMode: false,
  drawingDraft: null,
  drawingsHidden: false,
  activePointerId: null,
  dragStartX: 0,
  dragStartY: 0,
  dragStartOffset: 0,
  chartPointerMoved: false,
  selectedSymbol: null,
  selectedTimeframe: "1D",
  serverWarning: "",
  lastUpdated: null,
  lastRefreshHadOnlineData: false,
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  mountIcons();
  bindEvents();
  state.selectedSymbol = state.holdings[0]?.symbol ?? null;
  render();
  checkLocalServerVersion();
  refreshAllQuotes();
  updateClock();
  setInterval(updateClock, 30 * 1000);
  window.addEventListener("resize", drawSelectedChart);
});

function cacheElements() {
  els.form = document.getElementById("holdingForm");
  els.holdingId = document.getElementById("holdingId");
  els.marketInput = document.getElementById("marketInput");
  els.symbolInput = document.getElementById("symbolInput");
  els.nameInput = document.getElementById("nameInput");
  els.sharesInput = document.getElementById("sharesInput");
  els.avgCostInput = document.getElementById("avgCostInput");
  els.targetInput = document.getElementById("targetInput");
  els.stopInput = document.getElementById("stopInput");
  els.notesInput = document.getElementById("notesInput");
  els.formTitle = document.getElementById("formTitle");
  els.resetFormButton = document.getElementById("resetFormButton");
  els.refreshButton = document.getElementById("refreshButton");
  els.exportButton = document.getElementById("exportButton");
  els.importButton = document.getElementById("importButton");
  els.importFile = document.getElementById("importFile");
  els.loadSampleButton = document.getElementById("loadSampleButton");
  els.clearButton = document.getElementById("clearButton");
  els.summaryGrid = document.getElementById("summaryGrid");
  els.holdingsBody = document.getElementById("holdingsBody");
  els.holdingCount = document.getElementById("holdingCount");
  els.detailTitle = document.getElementById("detailTitle");
  els.detailSubtitle = document.getElementById("detailSubtitle");
  els.rangeTabs = document.getElementById("rangeTabs");
  els.drawLineButton = document.getElementById("drawLineButton");
  els.toggleDrawingsButton = document.getElementById("toggleDrawingsButton");
  els.undoDrawingButton = document.getElementById("undoDrawingButton");
  els.clearDrawingsButton = document.getElementById("clearDrawingsButton");
  els.fullscreenChartButton = document.getElementById("fullscreenChartButton");
  els.priceChart = document.getElementById("priceChart");
  els.chartSection = document.querySelector(".chart-section");
  els.insightList = document.getElementById("insightList");
  els.dataStatus = document.getElementById("dataStatus");
  els.marketClock = document.getElementById("marketClock");
  els.toast = document.getElementById("toast");
}

function mountIcons() {
  document.querySelectorAll("[data-icon]").forEach((node) => {
    const name = node.getAttribute("data-icon");
    node.innerHTML = ICONS[name] ?? "";
  });
}

function bindEvents() {
  els.form.addEventListener("submit", handleSaveHolding);
  els.resetFormButton.addEventListener("click", resetForm);
  els.refreshButton.addEventListener("click", refreshAllQuotes);
  els.exportButton.addEventListener("click", exportHoldings);
  els.importButton.addEventListener("click", () => els.importFile.click());
  els.importFile.addEventListener("change", importHoldings);
  els.loadSampleButton.addEventListener("click", loadSamples);
  els.clearButton.addEventListener("click", clearAllData);
  els.holdingsBody.addEventListener("click", handleTableClick);
  els.rangeTabs.addEventListener("click", handleRangeChange);
  els.drawLineButton.addEventListener("click", toggleDrawingMode);
  els.toggleDrawingsButton.addEventListener("click", toggleDrawingsVisibility);
  els.undoDrawingButton.addEventListener("click", undoLastDrawing);
  els.clearDrawingsButton.addEventListener("click", clearCurrentDrawings);
  els.fullscreenChartButton.addEventListener("click", toggleChartFullscreen);
  els.priceChart.addEventListener("pointerdown", handleChartPointerDown);
  els.priceChart.addEventListener("pointermove", handleChartPointerMove);
  els.priceChart.addEventListener("pointerup", handleChartPointerUp);
  els.priceChart.addEventListener("pointercancel", handleChartPointerCancel);
  els.priceChart.addEventListener("pointerleave", handleChartPointerLeave);
  els.priceChart.addEventListener("wheel", handleChartWheel, { passive: false });
  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("pointermove", handleDocumentPointerMove);
  document.addEventListener("keydown", handleGlobalKeydown);
}

function handleSaveHolding(event) {
  event.preventDefault();
  const formData = new FormData(els.form);
  const rawSymbol = formData.get("symbol");
  const market = inferMarket(rawSymbol, formData.get("market"));
  const symbol = normalizeSymbol(rawSymbol, market);
  const holding = {
    id: els.holdingId.value || createId(),
    symbol,
    market,
    currency: getMarketCurrency(market),
    name: String(formData.get("name") || "").trim(),
    shares: parseNumber(formData.get("shares")),
    avgCost: parseNumber(formData.get("avgCost")),
    targetPrice: parseOptionalNumber(formData.get("targetPrice")),
    stopLoss: parseOptionalNumber(formData.get("stopLoss")),
    notes: String(formData.get("notes") || "").trim(),
  };

  if (!holding.symbol || holding.shares <= 0 || holding.avgCost <= 0) {
    showToast("请填写有效的股票代码、持股数量和持仓均价。");
    return;
  }

  if (!holding.name) {
    holding.name = holding.symbol;
  }

  const existingIndex = state.holdings.findIndex((item) => item.id === holding.id);
  const duplicateIndex = state.holdings.findIndex(
    (item) => item.symbol === holding.symbol && item.market === holding.market && item.id !== holding.id,
  );

  if (duplicateIndex >= 0) {
    state.holdings[duplicateIndex] = { ...state.holdings[duplicateIndex], ...holding };
  } else if (existingIndex >= 0) {
    state.holdings[existingIndex] = holding;
  } else {
    state.holdings.push(holding);
  }

  state.selectedSymbol = holding.symbol;
  saveHoldings();
  resetForm();
  render();
  refreshQuoteForSymbol(holding.symbol, state.selectedTimeframe);
  showToast("持仓已保存。");
}

function handleTableClick(event) {
  const button = event.target.closest("button[data-action]");
  const row = event.target.closest("tr[data-symbol]");

  if (button) {
    const action = button.dataset.action;
    const id = button.dataset.id;
    if (action === "edit") {
      fillFormForEdit(id);
    }
    if (action === "delete") {
      deleteHolding(id);
    }
    return;
  }

  if (row) {
    selectSymbol(row.dataset.symbol);
  }
}

function handleRangeChange(event) {
  const button = event.target.closest("button[data-timeframe]");
  if (!button) return;
  state.selectedTimeframe = button.dataset.timeframe;
  state.drawingDraft = null;
  els.rangeTabs.querySelectorAll("button").forEach((item) => {
    item.classList.toggle("active", item.dataset.timeframe === state.selectedTimeframe);
  });
  const symbol = state.selectedSymbol;
  if (!symbol) {
    drawSelectedChart();
    return;
  }
  if (!state.charts[chartKey(symbol, state.selectedTimeframe)]) {
    refreshQuoteForSymbol(symbol, state.selectedTimeframe);
  } else {
    render();
  }
}

function toggleDrawingMode() {
  if (!getSelectedHolding()) return;
  if (!state.drawingMode && !els.chartSection.classList.contains("fullscreen")) {
    toggleChartFullscreen();
  }
  state.drawingMode = !state.drawingMode;
  state.drawingDraft = null;
  if (state.drawingMode) state.drawingsHidden = false;
  clearActiveCandleSelection();
  renderChartDrawingControls();
  drawSelectedChart();
  showToast(state.drawingMode ? "画线模式：在图上点两次生成直线。" : "已退出画线模式。");
}

function toggleDrawingsVisibility() {
  if (!getSelectedHolding()) return;
  state.drawingsHidden = !state.drawingsHidden;
  state.drawingDraft = null;
  if (state.drawingsHidden) state.drawingMode = false;
  renderChartDrawingControls();
  drawSelectedChart();
  showToast(state.drawingsHidden ? "线条已隐藏。" : "线条已显示。");
}

function undoLastDrawing() {
  const key = getActiveDrawingKey();
  if (!key) return;
  const index = findLastDrawingIndex(key);
  if (index < 0) {
    showToast("当前图表没有可删除的线。");
    return;
  }
  state.drawings.splice(index, 1);
  if (state.drawingDraft?.key === key) state.drawingDraft = null;
  saveDrawings();
  renderChartDrawingControls();
  drawSelectedChart();
  showToast("已删除上一条线。");
}

function clearCurrentDrawings() {
  const key = getActiveDrawingKey();
  if (!key) return;
  const before = state.drawings.length;
  state.drawings = state.drawings.filter((line) => line.key !== key);
  if (before === state.drawings.length) {
    showToast("当前图表没有线条。");
    return;
  }
  if (state.drawingDraft?.key === key) state.drawingDraft = null;
  saveDrawings();
  renderChartDrawingControls();
  drawSelectedChart();
  showToast("当前图表的线条已清空。");
}

function getActiveDrawingKey() {
  const holding = getSelectedHolding();
  return holding ? chartKey(holding.symbol, state.selectedTimeframe) : null;
}

function findLastDrawingIndex(key) {
  for (let index = state.drawings.length - 1; index >= 0; index -= 1) {
    if (state.drawings[index].key === key) return index;
  }
  return -1;
}

function fillFormForEdit(id) {
  const holding = state.holdings.find((item) => item.id === id);
  if (!holding) return;
  els.holdingId.value = holding.id;
  els.marketInput.value = holding.market || "US";
  els.symbolInput.value = holding.symbol;
  els.nameInput.value = holding.name;
  els.sharesInput.value = holding.shares;
  els.avgCostInput.value = holding.avgCost;
  els.targetInput.value = holding.targetPrice ?? "";
  els.stopInput.value = holding.stopLoss ?? "";
  els.notesInput.value = holding.notes ?? "";
  els.formTitle.textContent = "编辑持仓";
  els.symbolInput.focus();
}

function deleteHolding(id) {
  const holding = state.holdings.find((item) => item.id === id);
  if (!holding) return;
  const confirmed = window.confirm(`删除 ${holding.symbol} 这条持仓记录？`);
  if (!confirmed) return;
  state.holdings = state.holdings.filter((item) => item.id !== id);
  delete state.quotes[holding.symbol];
  Object.keys(state.charts)
    .filter((key) => key.startsWith(`${holding.symbol}:`))
    .forEach((key) => delete state.charts[key]);
  state.drawings = state.drawings.filter((line) => line.symbol !== holding.symbol);
  saveDrawings();
  state.selectedSymbol = state.holdings[0]?.symbol ?? null;
  saveHoldings();
  resetForm();
  render();
  showToast("持仓已删除。");
}

function selectSymbol(symbol) {
  state.selectedSymbol = symbol;
  state.drawingDraft = null;
  render();
  const key = chartKey(symbol, state.selectedTimeframe);
  if (!state.charts[key]) {
    refreshQuoteForSymbol(symbol, state.selectedTimeframe);
  }
}

function resetForm() {
  els.form.reset();
  els.holdingId.value = "";
  els.formTitle.textContent = "添加持仓";
}

async function refreshAllQuotes() {
  if (!state.holdings.length) {
    render();
    return;
  }
  els.refreshButton.disabled = true;
  els.refreshButton.classList.add("loading");
  showToast("正在刷新行情...");

  const results = await Promise.allSettled(
    state.holdings.map((holding) =>
      refreshQuoteForSymbol(holding.symbol, state.selectedTimeframe, false),
    ),
  );

  state.lastUpdated = new Date();
  state.lastRefreshHadOnlineData = results.some(
    (result) => result.status === "fulfilled" && result.value?.isReliable === true,
  );
  els.refreshButton.disabled = false;
  els.refreshButton.classList.remove("loading");
  render();
  showToast(state.lastRefreshHadOnlineData ? "行情已刷新。" : "在线行情不可用，已按成本暂估。");
}

async function refreshQuoteForSymbol(symbol, timeframeKey = state.selectedTimeframe, shouldRender = true) {
  const holding = state.holdings.find((item) => item.symbol === symbol);
  try {
    const quote = await fetchYahooChart(symbol, timeframeKey);
    state.quotes[symbol] = quote;
    state.charts[chartKey(symbol, timeframeKey)] = quote.candles;
    resetChartView(symbol, timeframeKey);
    if (shouldRender) render();
    return quote;
  } catch (error) {
    const fallback = buildFallbackQuote(symbol, holding, timeframeKey, error);
    state.quotes[symbol] = fallback;
    state.charts[chartKey(symbol, timeframeKey)] = fallback.candles;
    resetChartView(symbol, timeframeKey);
    if (shouldRender) render();
    return fallback;
  }
}

async function fetchYahooChart(symbol, timeframeKey) {
  const holding = state.holdings.find((item) => item.symbol === symbol);
  const config = TIMEFRAME_CONFIG[timeframeKey] ?? TIMEFRAME_CONFIG["1D"];
  const yahooTicker = toYahooTicker(symbol, holding?.market);
  const url = buildMarketDataUrl(symbol, yahooTicker, config, holding?.market);
  const requestTimeout = holding?.market === "CN" ? 22000 : 8500;
  const data = await fetchJsonWithTimeout(url, requestTimeout);
  const result = data?.chart?.result?.[0];
  if (!result || data?.chart?.error) {
    throw new Error("行情接口没有返回有效数据");
  }

  const candles = parseChartCandles(result, config);
  if (!candles.length) {
    throw new Error("行情接口返回空 K 线");
  }

  const meta = result.meta ?? {};
  const last = candles[candles.length - 1];
  const dailyReference = await fetchDailyQuoteReference(symbol, yahooTicker, holding).catch(() => null);
  const price = firstFiniteNumber(dailyReference?.price, meta.regularMarketPrice, last.close);
  const previousClose = selectPreviousClose(price, meta, dailyReference);
  const dayChange = price - previousClose;

  return {
    symbol,
    price,
    previousClose,
    dayChange,
    dayChangePercent: previousClose ? (dayChange / previousClose) * 100 : 0,
    currency: meta.currency ?? holding?.currency ?? getMarketCurrency(holding?.market),
    marketState: meta.marketState ?? "UNKNOWN",
    source: meta.source ?? "Yahoo Finance",
    isReliable: true,
    isSyntheticChart: false,
    sourceNote: "免费非官方接口，可能延迟或受网络限制。",
    asOf: Date.now(),
    candles,
  };
}

async function fetchDailyQuoteReference(symbol, yahooTicker, holding) {
  const dailyConfig = { range: "5d", interval: "1d" };
  const url = buildMarketDataUrl(symbol, yahooTicker, dailyConfig, holding?.market);
  const requestTimeout = holding?.market === "CN" ? 22000 : 8500;
  const data = await fetchJsonWithTimeout(url, requestTimeout);
  const result = data?.chart?.result?.[0];
  if (!result || data?.chart?.error) {
    throw new Error("日线行情接口没有返回有效数据");
  }

  const candles = parseChartCandles(result, dailyConfig);
  if (!candles.length) throw new Error("日线行情接口返回空 K 线");

  const meta = result.meta ?? {};
  const last = candles[candles.length - 1];
  const previous = candles[candles.length - 2] ?? null;
  const price = firstFiniteNumber(meta.regularMarketPrice, last.close);
  const previousClose = firstFiniteNumber(
    meta.regularMarketPreviousClose,
    previous?.close,
    meta.previousClose,
    meta.chartPreviousClose,
    last.open,
  );

  return {
    price,
    previousClose,
  };
}

function parseChartCandles(result, config) {
  const timestamps = result.timestamp ?? [];
  const quote = result.indicators?.quote?.[0] ?? {};
  let candles = timestamps
    .map((timestamp, index) => ({
      time: timestamp * 1000,
      open: quote.open?.[index],
      high: quote.high?.[index],
      low: quote.low?.[index],
      close: quote.close?.[index],
      volume: quote.volume?.[index] ?? 0,
    }))
    .filter((item) =>
      [item.open, item.high, item.low, item.close].every((value) => Number.isFinite(Number(value))),
    );

  if (config.aggregate) {
    candles = aggregateCandles(candles, config.aggregate);
  }

  return candles;
}

function selectPreviousClose(price, meta, dailyReference) {
  const candidates = [
    dailyReference?.previousClose,
    meta.regularMarketPreviousClose,
  ]
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0);

  const reasonable = candidates.find((value) => Math.abs(price - value) / value <= 0.25);
  return reasonable ?? price;
}

function firstFiniteNumber(...values) {
  const match = values.map((value) => Number(value)).find((value) => Number.isFinite(value));
  return match ?? 0;
}

function buildMarketDataUrl(symbol, yahooTicker, config, market = "US") {
  const params = new URLSearchParams({
    symbol,
    yahooSymbol: yahooTicker,
    market: market || "US",
    range: config.range,
    interval: config.interval,
  });

  if (shouldUseLocalDataProxy()) {
    return buildLocalApiUrl(`/api/chart?${params.toString()}`);
  }

  return `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    yahooTicker,
  )}?range=${config.range}&interval=${config.interval}&includePrePost=false&events=div%2Csplits`;
}

function shouldUseLocalDataProxy() {
  return window.location.protocol === "file:" || ["127.0.0.1", "localhost"].includes(window.location.hostname);
}

function buildLocalApiUrl(path) {
  if (["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return path;
  }
  return `${LOCAL_DATA_ORIGIN}${path}`;
}

async function fetchJsonWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!response.ok) {
      let message = `HTTP ${response.status}`;
      try {
        const payload = await response.json();
        if (payload?.error) message = payload.error;
      } catch (error) {}
      throw new Error(message);
    }
    return await response.json();
  } catch (error) {
    if (String(url).startsWith(LOCAL_DATA_ORIGIN)) {
      const isAbort = error?.name === "AbortError";
      throw new Error(
        isAbort
          ? "本地行情服务响应超时，请确认启动窗口没有报错。"
          : "本地行情服务未启动，请双击“启动投资工作台.command”。",
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function checkLocalServerVersion() {
  if (!shouldUseLocalDataProxy()) return;
  try {
    const data = await fetchJsonWithTimeout(buildLocalApiUrl("/api/version"), 3500);
    const cnSource = String(data?.cnSource ?? "");
    state.serverWarning =
      cnSource.includes("东方财富") && cnSource.includes("新浪财经")
        ? ""
        : "本地服务版本较旧，请重新双击启动文件。";
  } catch (error) {
    state.serverWarning =
      window.location.protocol === "file:"
        ? "在线行情需要先双击“启动投资工作台.command”。直接打开页面时，只能录入和查看本地持仓。"
        : "本地行情服务未启动或已中断，请重新双击“启动投资工作台.command”。";
  }
  renderDataStatus();
  if (state.serverWarning) showToast(state.serverWarning);
}

function aggregateCandles(candles, groupSize) {
  const grouped = [];
  for (let index = 0; index < candles.length; index += groupSize) {
    const group = candles.slice(index, index + groupSize);
    if (group.length < groupSize && grouped.length) continue;
    grouped.push({
      time: group[0].time,
      open: group[0].open,
      high: Math.max(...group.map((item) => item.high)),
      low: Math.min(...group.map((item) => item.low)),
      close: group[group.length - 1].close,
      volume: group.reduce((sum, item) => sum + (item.volume || 0), 0),
    });
  }
  return grouped;
}

function buildFallbackQuote(symbol, holding, timeframeKey, error = null) {
  const base = holding?.avgCost || 100 + (hashString(symbol) % 240);
  const candles = generateSyntheticCandles(symbol, timeframeKey, base);
  const placeholderPrice = holding?.avgCost || candles[candles.length - 1].close;
  return {
    symbol,
    price: placeholderPrice,
    previousClose: placeholderPrice,
    dayChange: 0,
    dayChangePercent: 0,
    currency: holding?.currency ?? getMarketCurrency(holding?.market),
    marketState: "UNAVAILABLE",
    source: "无在线行情",
    isReliable: false,
    isSyntheticChart: true,
    sourceNote: `在线行情不可用，估值暂按持仓均价占位；K 线仅用于展示，不参与盈亏。${error?.message ? `错误：${error.message}` : ""}`,
    asOf: Date.now(),
    candles,
  };
}

function generateSyntheticCandles(symbol, timeframeKey, basePrice) {
  const config = TIMEFRAME_CONFIG[timeframeKey] ?? TIMEFRAME_CONFIG["1D"];
  const seed = hashString(`${symbol}-${timeframeKey}-${new Date().toISOString().slice(0, 10)}`);
  const random = mulberry32(seed);
  const candles = [];
  let close = basePrice * (0.94 + random() * 0.16);
  const now = Date.now();

  for (let index = config.points - 1; index >= 0; index -= 1) {
    const drift = (random() - 0.48) * (timeframeKey === "15m" ? 0.012 : 0.032);
    const open = close;
    close = Math.max(1, open * (1 + drift));
    const spread = Math.max(open, close) * (0.004 + random() * 0.018);
    const high = Math.max(open, close) + spread;
    const low = Math.max(0.5, Math.min(open, close) - spread);
    candles.push({
      time: now - index * config.stepMs,
      open,
      high,
      low,
      close,
      volume: Math.round(300000 + random() * 4500000),
    });
  }
  return candles;
}

function render() {
  renderSummary();
  renderHoldingsTable();
  renderDetail();
  renderInsights();
  renderDataStatus();
  renderChartDrawingControls();
}

function renderSummary() {
  const metrics = getPortfolioMetrics();
  const hasMissingQuotes = metrics.missingQuoteCount > 0;
  const concentration = formatTopAllocationValues(metrics.topAllocationsByMarket);

  const cards = [
    {
      label: "组合市值",
      value: formatCurrencyGroups(metrics.byCurrency, "marketValue"),
      subtext: hasMissingQuotes
        ? `按成本暂估 · ${metrics.missingQuoteCount} 只待行情`
        : `<span class="summary-subtitle">投入成本</span>${formatCurrencyGroups(metrics.byCurrency, "costBasis")}`,
      tone: "neutral",
    },
    {
      label: "总浮动盈亏",
      value: hasMissingQuotes
        ? "待行情"
        : formatCurrencyGroups(metrics.byCurrency, "totalPnl", true, true),
      subtext: hasMissingQuotes
        ? "刷新到在线行情后计算"
        : formatPercentGroups(metrics.byCurrency, "totalPnlPercent", true),
      tone: hasMissingQuotes ? "neutral" : "neutral",
    },
    {
      label: "今日变动",
      value: hasMissingQuotes ? "待行情" : formatCurrencyGroups(metrics.byCurrency, "dayPnl", true, true),
      subtext: hasMissingQuotes
        ? "需要在线行情"
        : formatPercentGroups(metrics.byCurrency, "dayPnlPercent", true),
      tone: hasMissingQuotes ? "neutral" : "neutral",
    },
    {
      label: "市场分布",
      value: concentration,
      subtext: metrics.topSymbol
        ? formatTopAllocationNotes(metrics.topAllocationsByMarket)
        : formatMarketCounts(metrics.marketCounts),
      tone: metrics.topAllocation > 35 ? "negative" : "neutral",
    },
  ];

  els.summaryGrid.innerHTML = cards
    .map(
      (card) => `
        <article class="summary-card">
          <p class="summary-label">${card.label}</p>
          <p class="summary-value ${card.tone}">${card.value}</p>
          <p class="summary-subtext">${card.subtext}</p>
        </article>
      `,
    )
    .join("");
}

function renderHoldingsTable() {
  els.holdingCount.textContent = `${state.holdings.length} 只股票`;
  if (!state.holdings.length) {
    els.holdingsBody.innerHTML = `
      <tr>
        <td colspan="9">
          <div class="empty-state">先在左侧添加第一条持仓，或载入示例数据快速看看效果。</div>
        </td>
      </tr>
    `;
    return;
  }

  const metrics = getPortfolioMetrics();
  els.holdingsBody.innerHTML = state.holdings
    .map((holding) => {
      const quote = state.quotes[holding.symbol];
      const reliable = hasReliableQuote(holding);
      const currency = getHoldingCurrency(holding);
      const price = getPrice(holding);
      const marketValue = holding.shares * price;
      const cost = holding.shares * holding.avgCost;
      const pnl = marketValue - cost;
      const pnlPercent = cost ? (pnl / cost) * 100 : 0;
      const dayPnl = reliable ? holding.shares * (quote?.dayChange ?? 0) : 0;
      const groupValue = metrics.byCurrency[currency]?.marketValue ?? 0;
      const allocation = groupValue ? (marketValue / groupValue) * 100 : 0;
      const selected = state.selectedSymbol === holding.symbol ? "selected" : "";
      const priceCell = reliable
        ? formatCurrency(price, currency)
        : `${formatCurrency(price, currency)} <span class="status-badge warning">待行情</span>`;
      const pnlCell = reliable
        ? `${pnl >= 0 ? "+" : ""}${formatCurrency(pnl, currency)}
            <span class="muted">(${pnlPercent >= 0 ? "+" : ""}${formatPercent(pnlPercent)})</span>`
        : '<span class="muted">待行情</span>';
      const dayCell = reliable
        ? `${dayPnl >= 0 ? "+" : ""}${formatCurrency(dayPnl, currency)}`
        : '<span class="muted">待行情</span>';
      return `
        <tr class="${selected}" data-symbol="${holding.symbol}">
          <td>
            <div class="symbol-cell">
              <span class="symbol-main">${escapeHtml(holding.symbol)}</span>
              <span class="symbol-name">${escapeHtml(holding.name || holding.symbol)} · ${getMarketLabel(holding.market)}</span>
            </div>
          </td>
          <td>${formatNumber(holding.shares)}</td>
          <td>${formatCurrency(holding.avgCost, currency)}</td>
          <td>${priceCell}</td>
          <td>${formatCurrency(marketValue, currency)}</td>
          <td class="${reliable ? getToneClass(pnl) : "neutral"}">${pnlCell}</td>
          <td class="${reliable ? getToneClass(dayPnl) : "neutral"}">${dayCell}</td>
          <td><span class="pill">${allocation.toFixed(DISPLAY_DECIMALS)}%</span></td>
          <td>
            <div class="row-actions">
              <button class="icon-button" type="button" title="编辑" data-action="edit" data-id="${holding.id}">
                <span data-icon="edit"></span>
              </button>
              <button class="icon-button" type="button" title="删除" data-action="delete" data-id="${holding.id}">
                <span data-icon="x"></span>
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
  mountIcons();
}

function renderDetail() {
  const holding = getSelectedHolding();
  if (!holding) {
    els.detailTitle.textContent = "选择一只持仓";
    els.detailSubtitle.textContent = "K 线、成本线和当前盈亏会显示在这里";
    drawEmptyChart("暂无持仓");
    return;
  }

  const quote = state.quotes[holding.symbol];
  const reliable = hasReliableQuote(holding);
  const currency = getHoldingCurrency(holding);
  const price = getPrice(holding);
  const pnlPercent = holding.avgCost ? ((price - holding.avgCost) / holding.avgCost) * 100 : 0;
  els.detailTitle.textContent = `${holding.symbol} · ${holding.name || holding.symbol}`;
  els.detailSubtitle.innerHTML = reliable
    ? `
      ${getMarketLabel(holding.market)} · 现价 <strong>${formatCurrency(price, currency)}</strong>
      <span class="${getToneClass(pnlPercent)}">${pnlPercent >= 0 ? "+" : ""}${formatPercent(pnlPercent)} vs 成本</span>
      <span class="muted">来源：${quote?.source ?? "等待刷新"}</span>
    `
    : `
      ${getMarketLabel(holding.market)} · 暂按持仓均价 <strong>${formatCurrency(price, currency)}</strong> 占位
      <span class="status-badge warning">待行情</span>
      <span class="muted">K 线为示例走势，不参与盈亏</span>
    `;
  drawSelectedChart();
}

function renderInsights() {
  const insights = buildInsights();
  els.insightList.innerHTML = insights
    .map(
      (item) => `
        <article class="insight-item ${item.type}">
          <strong>${item.title}</strong>
          <p>${item.body}</p>
        </article>
      `,
    )
    .join("");
}

function renderDataStatus() {
  const quoteSources = Object.values(state.quotes).reduce((acc, quote) => {
    acc[quote.source] = (acc[quote.source] ?? 0) + 1;
    return acc;
  }, {});
  const sourceText = Object.entries(quoteSources)
    .map(([source, count]) => `${source} ${count} 只`)
    .join("，");
  const updated = state.lastUpdated ? formatDateTime(state.lastUpdated) : "尚未刷新";
  els.dataStatus.innerHTML = `
    <div><strong>当前来源：</strong>${sourceText || "等待添加持仓"}</div>
    <div><strong>最近刷新：</strong>${updated}</div>
    ${state.serverWarning ? `<div class="status-warning">${state.serverWarning}</div>` : ""}
    <div>说明：在线行情需要本地行情服务运行。请优先双击“启动投资工作台.command”；若只直接打开 index.html，页面仍可录入和查看持仓，但行情可能不可用。</div>
  `;
}

function renderChartDrawingControls() {
  if (!els.drawLineButton || !els.toggleDrawingsButton || !els.undoDrawingButton || !els.clearDrawingsButton) return;
  const holding = getSelectedHolding();
  const hasHolding = Boolean(holding);
  const activeKey = getActiveDrawingKey();
  const activeLineCount = activeKey
    ? state.drawings.filter((line) => line.key === activeKey).length
    : 0;

  els.drawLineButton.disabled = !hasHolding;
  els.drawLineButton.classList.toggle("active", state.drawingMode);
  els.drawLineButton.setAttribute("aria-pressed", String(state.drawingMode));
  els.drawLineButton.title = state.drawingMode ? "退出画线" : "画线：全屏后点两次生成直线";
  els.chartSection.classList.toggle("draw-mode", state.drawingMode);

  els.toggleDrawingsButton.disabled = !hasHolding || activeLineCount === 0;
  els.toggleDrawingsButton.classList.toggle("active", !state.drawingsHidden && activeLineCount > 0);
  els.toggleDrawingsButton.classList.toggle("muted-toggle", state.drawingsHidden);
  els.toggleDrawingsButton.setAttribute("aria-pressed", String(!state.drawingsHidden));
  els.toggleDrawingsButton.title = state.drawingsHidden ? "显示线条" : "隐藏线条";
  els.toggleDrawingsButton.querySelector("[data-icon]").setAttribute("data-icon", state.drawingsHidden ? "eyeOff" : "eye");

  els.undoDrawingButton.disabled = !hasHolding || activeLineCount === 0;
  els.undoDrawingButton.title = activeLineCount ? "删除上一条线" : "没有可删除的线";

  els.clearDrawingsButton.disabled = !hasHolding || activeLineCount === 0;
  els.clearDrawingsButton.title = activeLineCount ? "清除当前图表所有线" : "没有可清除的线";
  mountIcons();
}

function buildInsights() {
  if (!state.holdings.length) {
    return [
      {
        type: "info",
        title: "从第一条持仓开始",
        body: "录入股票代码、数量和持仓均价后，这里会自动生成组合关注点。",
      },
    ];
  }

  const metrics = getPortfolioMetrics();
  const insights = [];

  metrics.topAllocationsByMarket.forEach((item) => {
    if (item.allocation <= 35) return;
    insights.push({
      type: "warning",
      title: `${item.symbol} ${getMarketLabel(item.market)}仓位偏高`,
      body: `当前在${getMarketLabel(item.market)}持仓中占 ${item.allocation.toFixed(DISPLAY_DECIMALS)}%。如果这不是有意集中，后续可以设置仓位上限提醒。`,
    });
  });

  state.holdings.forEach((holding) => {
    const quote = state.quotes[holding.symbol];
    const reliable = hasReliableQuote(holding);
    const currency = getHoldingCurrency(holding);
    const price = getPrice(holding);
    const pnlPercent = holding.avgCost ? ((price - holding.avgCost) / holding.avgCost) * 100 : 0;
    const dayPercent = quote?.dayChangePercent ?? 0;

    if (!reliable) {
      insights.push({
        type: "info",
        title: `${holding.symbol} 未取得在线行情`,
        body: quote?.sourceNote || "当前按持仓均价临时占位，盈亏和今日变动会等在线行情刷新成功后再计算。",
      });
      return;
    }

    if (holding.stopLoss && price <= holding.stopLoss) {
      insights.push({
        type: "danger",
        title: `${holding.symbol} 触及警戒价`,
        body: `现价 ${formatCurrency(price, currency)} 已低于你设置的 ${formatCurrency(holding.stopLoss, currency)}，建议优先复核买入理由。`,
      });
    }

    if (holding.targetPrice && price >= holding.targetPrice) {
      insights.push({
        type: "good",
        title: `${holding.symbol} 到达目标价`,
        body: `现价 ${formatCurrency(price, currency)} 已达到你设置的 ${formatCurrency(holding.targetPrice, currency)}，可以考虑是否分批止盈或继续持有。`,
      });
    }

    if (pnlPercent <= -10) {
      insights.push({
        type: "warning",
        title: `${holding.symbol} 距成本回撤较大`,
        body: `当前较持仓均价低 ${Math.abs(pnlPercent).toFixed(DISPLAY_DECIMALS)}%。适合检查基本面变化和原始买入逻辑。`,
      });
    }

    if (Math.abs(dayPercent) >= 3) {
      insights.push({
        type: dayPercent > 0 ? "good" : "danger",
        title: `${holding.symbol} 今日波动较大`,
        body: `相对昨收变化 ${dayPercent >= 0 ? "+" : ""}${formatPercent(dayPercent)}，建议查看是否由财报、新闻或板块行情驱动。`,
      });
    }
  });

  const industryInsights = buildIndustryInsights(metrics);

  if (!insights.length) {
    insights.push({
      type: "info",
      title: "当前没有明显异常",
      body: "持仓未触发目标价、警戒价、较大日内波动或集中度提醒。后续可以加入新闻和财报日历。",
    });
  }

  const selected = getSelectedHolding();
  if (selected?.notes) {
    insights.push({
      type: "info",
      title: `${selected.symbol} 观察点`,
      body: escapeHtml(selected.notes),
    });
  }

  const maxInsights = 10;
  const regularLimit = Math.max(0, maxInsights - industryInsights.length);
  return [...insights.slice(0, regularLimit), ...industryInsights].slice(0, maxInsights);
}

function buildIndustryInsights(metrics) {
  const insights = [];
  const markets = new Set(state.holdings.map((holding) => holding.market));
  const tags = new Set(state.holdings.flatMap((holding) => getIndustryTags(holding)));

  if (tags.has("financial")) {
    insights.push({
      type: "industry",
      title: "金融板块动态",
      body: "重点跟踪利率预期、银行信贷质量、净息差和金融监管表态。金融类 ETF 对这些变量通常比较敏感。",
    });
  }

  if (tags.has("tech")) {
    insights.push({
      type: "industry",
      title: "科技成长动态",
      body: "重点跟踪 AI 算力、半导体景气度、科创板成交额和风险偏好变化。成长板块通常更受流动性影响。",
    });
  }

  if (tags.has("consumer")) {
    insights.push({
      type: "industry",
      title: "消费板块动态",
      body: "重点跟踪消费复苏、提价能力、渠道库存和分红稳定性。若持有白酒或消费龙头，财报质量比短期波动更关键。",
    });
  }

  if (markets.has("US")) {
    insights.push({
      type: "industry",
      title: "美股宏观关注",
      body: "关注美债收益率、美元指数、财报指引和降息预期变化。它们会影响美股估值和板块轮动。",
    });
  }

  if (markets.has("CN")) {
    insights.push({
      type: "industry",
      title: "A 股政策与流动性",
      body: "关注人民币汇率、成交额、政策会议、行业扶持方向和风险偏好。A 股持仓短期常受流动性与政策预期影响。",
    });
  }

  return insights.slice(0, 4);
}

function getIndustryTags(holding) {
  const text = `${holding.symbol} ${holding.name} ${holding.notes || ""}`.toLowerCase();
  const tags = [];
  if (/xlf|financial|finance|bank|insurance|broker|金融|银行|保险|券商/.test(text)) {
    tags.push("financial");
  }
  if (/科技|科创|半导体|芯片|ai|人工智能|算力|云|软件|nvda|nvidia|msft|microsoft|aapl|apple|qqq|soxx|smh/.test(text)) {
    tags.push("tech");
  }
  if (/消费|白酒|食品|饮料|茅台|moutai|retail|consumer/.test(text)) {
    tags.push("consumer");
  }
  return tags;
}

function drawSelectedChart() {
  const holding = getSelectedHolding();
  if (!holding) {
    drawEmptyChart("暂无持仓");
    return;
  }
  const quote = state.quotes[holding.symbol];
  const candles = state.charts[chartKey(holding.symbol, state.selectedTimeframe)] ?? [];
  if (!candles.length) {
    drawEmptyChart("正在等待行情");
    return;
  }
  drawCandlestickChart(candles, holding, quote);
}

function drawCandlestickChart(candles, holding, quote) {
  const canvas = els.priceChart;
  const wrap = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  const width = wrap.clientWidth;
  const height = wrap.clientHeight;
  canvas.width = Math.max(1, Math.floor(width * dpr));
  canvas.height = Math.max(1, Math.floor(height * dpr));
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d");
  const currency = getHoldingCurrency(holding);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const margin = CHART_MARGIN;
  const volumeHeight = 58;
  const chartBottom = height - margin.bottom - volumeHeight;
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = chartBottom - margin.top;
  const key = chartKey(holding.symbol, state.selectedTimeframe);
  const { start, visibleCandles } = getVisibleChartSlice(key, candles);

  if (!visibleCandles.length) {
    drawEmptyChart("正在等待行情");
    return;
  }

  const { min, max } = getVisiblePriceRange(visibleCandles, holding);

  const xFor = (index) => margin.left + (plotWidth * index) / Math.max(1, visibleCandles.length - 1);
  const yFor = (value) => margin.top + ((max - value) / Math.max(0.0001, max - min)) * plotHeight;

  ctx.fillStyle = "#fbfcfa";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#e1e6df";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#6d756f";
  ctx.font = "12px Inter, system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  for (let tick = 0; tick <= 4; tick += 1) {
    const value = min + ((max - min) * tick) / 4;
    const y = yFor(value);
    ctx.beginPath();
    ctx.moveTo(margin.left, y);
    ctx.lineTo(width - margin.right + CHART_AXIS_GAP, y);
    ctx.stroke();
    ctx.fillText(formatChartCompactCurrency(value, currency), width - 8, y);
  }

  const costY = yFor(holding.avgCost);
  ctx.save();
  ctx.strokeStyle = "#ad6b00";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(margin.left, costY);
  ctx.lineTo(width - margin.right + CHART_AXIS_GAP, costY);
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = "#ad6b00";
  ctx.textAlign = "left";
  ctx.fillText(`成本 ${formatChartCompactCurrency(holding.avgCost, currency)}`, margin.left + 6, Math.max(12, costY - 10));

  const maxVolume = Math.max(...visibleCandles.map((item) => item.volume || 0), 1);
  const volumeTop = height - margin.bottom - volumeHeight + 12;
  const candleSlot = plotWidth / Math.max(1, visibleCandles.length);
  const candleWidth = clamp(candleSlot * 0.58, 2, 13);

  visibleCandles.forEach((candle, index) => {
    const x = xFor(index);
    const isUp = candle.close >= candle.open;
    const color = isUp ? "#137a46" : "#b3261e";
    const highY = yFor(candle.high);
    const lowY = yFor(candle.low);
    const openY = yFor(candle.open);
    const closeY = yFor(candle.close);
    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.max(Math.abs(closeY - openY), 1);

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, highY);
    ctx.lineTo(x, lowY);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);

    const volumeRatio = (candle.volume || 0) / maxVolume;
    const volumeBarHeight = volumeRatio * (volumeHeight - 18);
    ctx.globalAlpha = 0.28;
    ctx.fillRect(
      x - candleWidth / 2,
      volumeTop + (volumeHeight - 18 - volumeBarHeight),
      candleWidth,
      volumeBarHeight,
    );
    ctx.globalAlpha = 1;
  });

  ctx.fillStyle = "#6d756f";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  const firstLabel = formatAxisDate(visibleCandles[0].time);
  const lastLabel = formatAxisDate(visibleCandles[visibleCandles.length - 1].time);
  ctx.fillText(firstLabel, margin.left, height - 28);
  ctx.textAlign = "right";
  ctx.fillText(lastLabel, width - margin.right, height - 28);

  if (quote?.isSyntheticChart) {
    ctx.fillStyle = "rgba(173, 107, 0, 0.92)";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = "13px Inter, system-ui, sans-serif";
    ctx.fillText("示例 K 线，仅占位", margin.left + 6, margin.top + 6);
  }

  drawChartDrawings(ctx, {
    candles,
    chartBottom,
    height,
    key,
    margin,
    plotHeight,
    plotWidth,
    start,
    visibleCandles,
    width,
    xFor,
    yFor,
  });

  drawSelectedCandleInfo(ctx, {
    candles,
    currency,
    holding,
    key,
    margin,
    plotWidth,
    start,
    visibleCandles,
    width,
    height,
    xFor,
    yFor,
  });

  drawHoverPriceGuide(ctx, {
    chartBottom,
    currency,
    height,
    key,
    margin,
    max,
    min,
    plotHeight,
    width,
  });
}

function drawEmptyChart(message) {
  const canvas = els.priceChart;
  const wrap = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  const width = wrap.clientWidth || 600;
  const height = wrap.clientHeight || 360;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fbfcfa";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#6d756f";
  ctx.font = "15px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(message, width / 2, height / 2);
}

function drawChartDrawings(ctx, options) {
  const { candles, key, margin, plotHeight, plotWidth, start, visibleCandles, xFor, yFor } = options;
  if (!visibleCandles.length) return;
  if (state.drawingsHidden) return;

  const xForGlobalTime = (time) => {
    const index = candles.findIndex((item) => item.time === time);
    if (index < 0) return null;
    return margin.left + (plotWidth * (index - start)) / Math.max(1, visibleCandles.length - 1);
  };

  const activeLines = state.drawings.filter((line) => line.key === key);
  ctx.save();
  ctx.beginPath();
  ctx.rect(margin.left, margin.top, plotWidth, plotHeight);
  ctx.clip();

  activeLines.forEach((line) => {
    const x1 = xForGlobalTime(line.startTime);
    const x2 = xForGlobalTime(line.endTime);
    if (x1 === null || x2 === null) return;
    const y1 = yFor(line.startPrice);
    const y2 = yFor(line.endPrice);
    ctx.strokeStyle = "rgba(32, 94, 86, 0.95)";
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "rgba(32, 94, 86, 0.95)";
    [x1, x2].forEach((x, index) => {
      const y = index === 0 ? y1 : y2;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  });

  if (state.drawingMode && state.drawingDraft?.key === key) {
    const draftX = xForGlobalTime(state.drawingDraft.time);
    const draftY = yFor(state.drawingDraft.price);
    if (draftX !== null) {
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#ad6b00";
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(draftX, draftY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (state.chartHover?.key === key) {
        const hoverIndex = Math.round(
          ((state.chartHover.x - margin.left) / Math.max(1, plotWidth)) *
            Math.max(1, visibleCandles.length - 1),
        );
        const clampedIndex = clamp(hoverIndex, 0, visibleCandles.length - 1);
        const previewX = xFor(clampedIndex);
        const previewY = state.chartHover.y;
        ctx.strokeStyle = "rgba(173, 107, 0, 0.72)";
        ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.moveTo(draftX, draftY);
        ctx.lineTo(previewX, previewY);
        ctx.stroke();
      }
    }
  }

  ctx.restore();
}

function drawSelectedCandleInfo(ctx, options) {
  const { candles, currency, holding, key, margin, plotWidth, start, visibleCandles, width, height, xFor, yFor } = options;
  const selectedTime = state.chartSelections[key];
  if (!selectedTime) return;

  const globalIndex = candles.findIndex((item) => item.time === selectedTime);
  const visibleIndex = globalIndex - start;
  if (globalIndex < 0 || visibleIndex < 0 || visibleIndex >= visibleCandles.length) return;

  const candle = candles[globalIndex];
  const previous = candles[globalIndex - 1] ?? null;
  const reference = previous?.close ?? candle.open;
  const change = candle.close - reference;
  const changePercent = reference ? (change / reference) * 100 : 0;
  const x = xFor(visibleIndex);
  const highY = yFor(candle.high);
  const lowY = yFor(candle.low);
  const openY = yFor(candle.open);
  const closeY = yFor(candle.close);
  const color = candle.close >= candle.open ? "#137a46" : "#b3261e";
  const toneColor = change >= 0 ? "#137a46" : "#b3261e";

  ctx.save();
  ctx.strokeStyle = "rgba(39, 96, 85, 0.38)";
  ctx.setLineDash([3, 5]);
  ctx.beginPath();
  ctx.moveTo(x, margin.top);
  ctx.lineTo(x, height - margin.bottom - 6);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(x, highY);
  ctx.lineTo(x, lowY);
  ctx.stroke();
  ctx.strokeRect(x - 8, Math.min(openY, closeY) - 3, 16, Math.max(Math.abs(closeY - openY), 1) + 6);
  ctx.restore();

  const lines = [
    { label: formatCandleTime(candle.time, holding), value: "", tone: "#16231f", strong: true },
    { label: "开", value: formatChartCurrency(candle.open, currency) },
    { label: "高", value: formatChartCurrency(candle.high, currency) },
    { label: "低", value: formatChartCurrency(candle.low, currency) },
    { label: "收", value: formatChartCurrency(candle.close, currency) },
    {
      label: "涨跌",
      value: `${change >= 0 ? "+" : ""}${formatChartCurrency(change, currency)} (${changePercent >= 0 ? "+" : ""}${formatChartPercent(changePercent)})`,
      tone: toneColor,
    },
    { label: "量", value: formatVolume(candle.volume) },
  ];

  ctx.save();
  ctx.font = "12px Inter, system-ui, sans-serif";
  const lineHeight = 18;
  const paddingX = 12;
  const paddingY = 10;
  const titleWidth = ctx.measureText(lines[0].label).width;
  const bodyWidth = Math.max(
    ...lines.slice(1).map((line) => ctx.measureText(`${line.label} ${line.value}`).width),
  );
  const boxWidth = clamp(Math.max(titleWidth, bodyWidth) + paddingX * 2, 160, Math.min(250, width - 18));
  const boxHeight = paddingY * 2 + lineHeight * lines.length;
  let boxX = x + 14;
  if (boxX + boxWidth > width - 8) boxX = x - boxWidth - 14;
  boxX = clamp(boxX, 8, width - boxWidth - 8);

  let boxY = Math.min(openY, closeY) - boxHeight - 14;
  if (boxY < 8) boxY = Math.max(8, Math.max(openY, closeY) + 14);
  if (boxY + boxHeight > height - 8) boxY = height - boxHeight - 8;

  ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
  ctx.strokeStyle = "rgba(39, 96, 85, 0.22)";
  ctx.lineWidth = 1;
  drawRoundRect(ctx, boxX, boxY, boxWidth, boxHeight, 8);
  ctx.fill();
  ctx.stroke();

  let textY = boxY + paddingY + 1;
  lines.forEach((line, index) => {
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    if (index === 0) {
      ctx.fillStyle = line.tone;
      ctx.font = "700 12px Inter, system-ui, sans-serif";
      ctx.fillText(line.label, boxX + paddingX, textY);
    } else {
      ctx.font = "700 12px Inter, system-ui, sans-serif";
      ctx.fillStyle = "#6d756f";
      ctx.fillText(line.label, boxX + paddingX, textY);
      ctx.font = "700 12px Inter, system-ui, sans-serif";
      ctx.fillStyle = line.tone ?? "#16231f";
      ctx.textAlign = "right";
      ctx.fillText(line.value, boxX + boxWidth - paddingX, textY);
    }
    textY += lineHeight;
  });
  ctx.restore();
}

function drawHoverPriceGuide(ctx, options) {
  const { chartBottom, currency, height, key, margin, max, min, plotHeight, width } = options;
  const hover = state.chartHover;
  if (!hover || hover.key !== key) return;

  const y = clamp(hover.y, margin.top, chartBottom);
  const x = clamp(hover.x, margin.left, width - margin.right);
  const price = max - ((y - margin.top) / Math.max(1, plotHeight)) * (max - min);
  const label = formatChartCurrency(price, currency);

  ctx.save();
  ctx.strokeStyle = "rgba(39, 96, 85, 0.36)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(margin.left, y);
  ctx.lineTo(width - margin.right + CHART_AXIS_GAP, y);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(39, 96, 85, 0.12)";
  ctx.strokeStyle = "rgba(39, 96, 85, 0.72)";
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.font = "800 12px Inter, system-ui, sans-serif";
  const labelWidth = Math.max(58, ctx.measureText(label).width + 14);
  const labelHeight = 24;
  const labelX = width - labelWidth - 6;
  const labelY = clamp(y - labelHeight / 2, 5, height - labelHeight - 5);
  ctx.fillStyle = "#276055";
  drawRoundRect(ctx, labelX, labelY, labelWidth, labelHeight, 7);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, labelX + labelWidth / 2, labelY + labelHeight / 2);
  ctx.restore();
}

function drawRoundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function getVisibleChartSlice(key, candles) {
  const view = getChartView(key, candles);
  const end = candles.length - view.offsetFromEnd;
  const start = Math.max(0, end - view.visibleCandles);
  return {
    view,
    start,
    end,
    visibleCandles: candles.slice(start, end),
  };
}

function getVisiblePriceRange(visibleCandles, holding) {
  const highs = visibleCandles.map((item) => item.high);
  const lows = visibleCandles.map((item) => item.low);
  let min = Math.min(...lows, holding.avgCost);
  let max = Math.max(...highs, holding.avgCost);
  const padding = Math.max((max - min) * 0.08, max * 0.01);
  return {
    min: min - padding,
    max: max + padding,
  };
}

function getChartView(key, candles) {
  const config = TIMEFRAME_CONFIG[state.selectedTimeframe] ?? TIMEFRAME_CONFIG["1D"];
  const maxVisible = Math.max(1, candles.length);
  if (!state.chartViews[key]) {
    state.chartViews[key] = {
      offsetFromEnd: 0,
      visibleCandles: clamp(config.visibleCandles ?? 70, 12, maxVisible),
    };
  }

  const view = state.chartViews[key];
  view.visibleCandles = Math.round(clamp(view.visibleCandles, 12, maxVisible));
  const maxOffset = Math.max(0, candles.length - view.visibleCandles);
  view.offsetFromEnd = Math.round(clamp(view.offsetFromEnd, 0, maxOffset));
  return view;
}

function resetChartView(symbol, timeframeKey) {
  const key = chartKey(symbol, timeframeKey);
  delete state.chartViews[key];
  delete state.chartSelections[key];
  if (state.chartHover?.key === key) state.chartHover = null;
}

function getActiveChartData() {
  const holding = getSelectedHolding();
  if (!holding) return null;
  const key = chartKey(holding.symbol, state.selectedTimeframe);
  const candles = state.charts[key] ?? [];
  if (!candles.length) return null;
  return { holding, key, candles };
}

function handleChartPointerDown(event) {
  const active = getActiveChartData();
  if (!active) return;
  updateChartHover(event, false);
  if (state.drawingMode) {
    state.activePointerId = event.pointerId;
    state.dragStartX = event.clientX;
    state.dragStartY = event.clientY;
    state.chartPointerMoved = false;
    els.priceChart.setPointerCapture(event.pointerId);
    return;
  }
  const view = getChartView(active.key, active.candles);
  state.activePointerId = event.pointerId;
  state.dragStartX = event.clientX;
  state.dragStartY = event.clientY;
  state.dragStartOffset = view.offsetFromEnd;
  state.chartPointerMoved = false;
  els.priceChart.setPointerCapture(event.pointerId);
  els.priceChart.classList.add("dragging");
}

function handleChartPointerMove(event) {
  if (state.activePointerId !== event.pointerId) {
    updateChartHover(event);
    return;
  }
  const active = getActiveChartData();
  if (!active) return;
  updateChartHover(event, false);

  const movedX = Math.abs(event.clientX - state.dragStartX);
  const movedY = Math.abs(event.clientY - state.dragStartY);
  if (movedX > 5 || movedY > 5) state.chartPointerMoved = true;

  if (state.drawingMode) {
    drawSelectedChart();
    return;
  }

  const view = getChartView(active.key, active.candles);
  const plotWidth = Math.max(1, els.priceChart.clientWidth - CHART_MARGIN.left - CHART_MARGIN.right);
  const candleSlot = plotWidth / Math.max(1, view.visibleCandles);
  const offsetDelta = Math.round((event.clientX - state.dragStartX) / Math.max(4, candleSlot));
  const maxOffset = Math.max(0, active.candles.length - view.visibleCandles);
  view.offsetFromEnd = clamp(state.dragStartOffset + offsetDelta, 0, maxOffset);
  drawSelectedChart();
}

function handleChartPointerUp(event) {
  if (state.activePointerId !== event.pointerId) return;
  const wasClick = !state.chartPointerMoved;
  state.activePointerId = null;
  state.chartPointerMoved = false;
  els.priceChart.classList.remove("dragging");
  try {
    els.priceChart.releasePointerCapture(event.pointerId);
  } catch (error) {}
  updateChartHover(event, false);
  if (wasClick && state.drawingMode) {
    handleChartDrawingClick(event);
  } else if (wasClick) {
    selectCandleAt(event);
  }
  drawSelectedChart();
}

function handleChartPointerCancel(event) {
  if (state.activePointerId !== event.pointerId) return;
  state.activePointerId = null;
  state.chartPointerMoved = false;
  els.priceChart.classList.remove("dragging");
  try {
    els.priceChart.releasePointerCapture(event.pointerId);
  } catch (error) {}
  clearChartHover();
}

function handleChartPointerLeave(event) {
  if (state.activePointerId === event.pointerId) return;
  clearChartHover();
}

function updateChartHover(event, shouldDraw = true) {
  const active = getActiveChartData();
  if (!active) {
    clearChartHover();
    return;
  }

  const rect = els.priceChart.getBoundingClientRect();
  const pointX = event.clientX - rect.left;
  const pointY = event.clientY - rect.top;
  const margin = CHART_MARGIN;
  const volumeHeight = 58;
  const chartBottom = rect.height - margin.bottom - volumeHeight;
  const insideHorizontal = pointX >= margin.left && pointX <= rect.width - margin.right + CHART_AXIS_GAP;
  const insidePriceArea = pointY >= margin.top && pointY <= chartBottom;

  if (!insideHorizontal || !insidePriceArea) {
    if (state.chartHover?.key === active.key) {
      state.chartHover = null;
      if (shouldDraw) drawSelectedChart();
    }
    return;
  }

  state.chartHover = {
    key: active.key,
    x: pointX,
    y: pointY,
  };
  if (shouldDraw) drawSelectedChart();
}

function clearChartHover() {
  if (!state.chartHover) return;
  state.chartHover = null;
  drawSelectedChart();
}

function selectCandleAt(event) {
  const active = getActiveChartData();
  if (!active) return;

  const rect = els.priceChart.getBoundingClientRect();
  const pointX = event.clientX - rect.left;
  const pointY = event.clientY - rect.top;
  const width = rect.width;
  const height = rect.height;
  const margin = CHART_MARGIN;
  const volumeHeight = 58;
  const chartBottom = height - margin.bottom - volumeHeight;
  const plotWidth = width - margin.left - margin.right;
  if (pointY < margin.top - 12 || pointY > height - margin.bottom + 8) {
    clearActiveCandleSelection();
    return;
  }

  const { start, visibleCandles } = getVisibleChartSlice(active.key, active.candles);
  if (!visibleCandles.length) return;

  const rawIndex = ((pointX - margin.left) / Math.max(1, plotWidth)) * Math.max(1, visibleCandles.length - 1);
  const visibleIndex = Math.round(clamp(rawIndex, 0, visibleCandles.length - 1));
  const candle = active.candles[start + visibleIndex];
  if (!candle) return;

  const xFor = (index) => margin.left + (plotWidth * index) / Math.max(1, visibleCandles.length - 1);
  const candleX = xFor(visibleIndex);
  const candleSlot = plotWidth / Math.max(1, visibleCandles.length);
  const closeEnoughX = Math.abs(pointX - candleX) <= Math.max(9, candleSlot * 0.65);
  const volumeTop = height - margin.bottom - volumeHeight + 12;
  const hitsPriceArea = pointY >= margin.top && pointY <= chartBottom;
  const hitsVolumeArea = pointY >= volumeTop && pointY <= height - margin.bottom;

  if (!closeEnoughX || (!hitsPriceArea && !hitsVolumeArea)) {
    clearActiveCandleSelection();
    return;
  }

  state.chartSelections[active.key] = candle.time;
  drawSelectedChart();
}

function handleChartDrawingClick(event) {
  if (!els.chartSection.classList.contains("fullscreen")) {
    showToast("画线请先进入全屏。");
    return;
  }

  const point = getChartPointFromEvent(event);
  if (!point) {
    showToast("请在价格图区域内点选。");
    return;
  }

  if (!state.drawingDraft || state.drawingDraft.key !== point.key) {
    state.drawingDraft = point;
    clearActiveCandleSelection();
    showToast("已选择起点，再点一次终点。");
    renderChartDrawingControls();
    return;
  }

  const start = state.drawingDraft;
  if (start.time === point.time && Math.abs(start.price - point.price) < 0.000001) {
    showToast("终点需要和起点不同。");
    return;
  }

  state.drawings.push({
    id: createId(),
    key: point.key,
    symbol: point.symbol,
    timeframe: point.timeframe,
    startTime: start.time,
    startPrice: start.price,
    endTime: point.time,
    endPrice: point.price,
    createdAt: new Date().toISOString(),
  });
  saveDrawings();
  state.drawingDraft = null;
  state.drawingsHidden = false;
  renderChartDrawingControls();
  showToast("线条已添加。");
}

function getChartPointFromEvent(event) {
  const active = getActiveChartData();
  if (!active) return null;

  const rect = els.priceChart.getBoundingClientRect();
  const pointX = event.clientX - rect.left;
  const pointY = event.clientY - rect.top;
  const margin = CHART_MARGIN;
  const volumeHeight = 58;
  const chartBottom = rect.height - margin.bottom - volumeHeight;
  const plotWidth = rect.width - margin.left - margin.right;
  const plotHeight = chartBottom - margin.top;

  if (
    pointX < margin.left ||
    pointX > rect.width - margin.right ||
    pointY < margin.top ||
    pointY > chartBottom
  ) {
    return null;
  }

  const { start, visibleCandles } = getVisibleChartSlice(active.key, active.candles);
  if (!visibleCandles.length) return null;

  const { min, max } = getVisiblePriceRange(visibleCandles, active.holding);
  const rawIndex = ((pointX - margin.left) / Math.max(1, plotWidth)) * Math.max(1, visibleCandles.length - 1);
  const visibleIndex = Math.round(clamp(rawIndex, 0, visibleCandles.length - 1));
  const candle = active.candles[start + visibleIndex];
  if (!candle) return null;

  const price = max - ((pointY - margin.top) / Math.max(1, plotHeight)) * (max - min);
  return {
    key: active.key,
    symbol: active.holding.symbol,
    timeframe: state.selectedTimeframe,
    time: candle.time,
    price,
  };
}

function handleDocumentClick(event) {
  const active = getActiveChartData();
  if (!active || !state.chartSelections[active.key]) return;
  if (event.target === els.priceChart || event.target.closest?.(".chart-canvas-wrap")) return;
  clearActiveCandleSelection();
}

function handleDocumentPointerMove(event) {
  if (!state.chartHover) return;
  if (state.activePointerId !== null) return;
  if (event.target === els.priceChart || event.target.closest?.(".chart-canvas-wrap")) return;
  clearChartHover();
}

function clearActiveCandleSelection() {
  const active = getActiveChartData();
  if (!active || !state.chartSelections[active.key]) return;
  delete state.chartSelections[active.key];
  drawSelectedChart();
}

function handleChartWheel(event) {
  const active = getActiveChartData();
  if (!active) return;
  event.preventDefault();
  const view = getChartView(active.key, active.candles);
  const oldVisible = view.visibleCandles;
  const factor = event.deltaY > 0 ? 1.025 : 0.975;
  view.visibleCandles = Math.round(clamp(oldVisible * factor, 12, active.candles.length));
  const maxOffset = Math.max(0, active.candles.length - view.visibleCandles);
  view.offsetFromEnd = clamp(view.offsetFromEnd, 0, maxOffset);
  drawSelectedChart();
}

function toggleChartFullscreen() {
  const enabled = !els.chartSection.classList.contains("fullscreen");
  els.chartSection.classList.toggle("fullscreen", enabled);
  document.body.classList.toggle("chart-modal-open", enabled);
  if (!enabled) {
    state.drawingMode = false;
    state.drawingDraft = null;
  }
  els.fullscreenChartButton.title = enabled ? "退出全屏" : "全屏图表";
  els.fullscreenChartButton.querySelector("[data-icon]").setAttribute("data-icon", enabled ? "collapse" : "expand");
  mountIcons();
  renderChartDrawingControls();
  requestAnimationFrame(drawSelectedChart);
}

function handleGlobalKeydown(event) {
  if (event.key === "Escape" && els.chartSection.classList.contains("fullscreen")) {
    toggleChartFullscreen();
  }
}

function getPortfolioMetrics() {
  const byCurrency = {};
  const byMarket = {};
  const marketCounts = {};
  let missingQuoteCount = 0;
  const allocations = [];

  state.holdings.forEach((holding) => {
    const quote = state.quotes[holding.symbol];
    const reliable = hasReliableQuote(holding);
    const currency = getHoldingCurrency(holding);
    const price = getPrice(holding);
    const value = holding.shares * price;
    const cost = holding.shares * holding.avgCost;
    const daily = reliable ? holding.shares * (quote?.dayChange ?? 0) : 0;
    if (!byCurrency[currency]) {
      byCurrency[currency] = {
        currency,
        marketValue: 0,
        costBasis: 0,
        totalPnl: 0,
        totalPnlPercent: 0,
        dayPnl: 0,
        dayPnlPercent: 0,
        missingQuoteCount: 0,
      };
    }
    if (!byMarket[holding.market]) {
      byMarket[holding.market] = {
        market: holding.market,
        currency,
        marketValue: 0,
        costBasis: 0,
        totalPnl: 0,
        totalPnlPercent: 0,
        dayPnl: 0,
        dayPnlPercent: 0,
        missingQuoteCount: 0,
      };
    }
    byCurrency[currency].marketValue += value;
    byCurrency[currency].costBasis += cost;
    byCurrency[currency].dayPnl += daily;
    byMarket[holding.market].marketValue += value;
    byMarket[holding.market].costBasis += cost;
    byMarket[holding.market].dayPnl += daily;
    if (!reliable) missingQuoteCount += 1;
    if (!reliable) byCurrency[currency].missingQuoteCount += 1;
    if (!reliable) byMarket[holding.market].missingQuoteCount += 1;
    marketCounts[holding.market] = (marketCounts[holding.market] ?? 0) + 1;
    allocations.push({
      symbol: holding.symbol,
      name: holding.name,
      value,
      currency,
      market: holding.market,
    });
  });

  [...Object.values(byCurrency), ...Object.values(byMarket)].forEach((group) => {
    group.totalPnl = group.marketValue - group.costBasis;
    group.totalPnlPercent = group.costBasis ? (group.totalPnl / group.costBasis) * 100 : 0;
    const previousValue = group.marketValue - group.dayPnl;
    group.dayPnlPercent = previousValue ? (group.dayPnl / previousValue) * 100 : 0;
  });

  const allocationsWithPercent = allocations.map((item) => ({
    ...item,
    allocation: byMarket[item.market]?.marketValue
      ? (item.value / byMarket[item.market].marketValue) * 100
      : 0,
  }));
  const top = allocationsWithPercent.sort((a, b) => b.allocation - a.allocation)[0];
  const topAllocationsByMarket = Object.values(byMarket)
    .map((group) =>
      allocationsWithPercent
        .filter((item) => item.market === group.market)
        .sort((a, b) => b.allocation - a.allocation)[0],
    )
    .filter(Boolean);
  const primary = Object.values(byCurrency)[0] ?? null;

  return {
    byCurrency,
    byMarket,
    primary,
    marketCounts,
    topSymbol: top?.symbol ?? null,
    topCurrency: top?.currency ?? null,
    topMarket: top?.market ?? null,
    topAllocation: top?.allocation ?? 0,
    topAllocationsByMarket,
    missingQuoteCount,
  };
}

function getSelectedHolding() {
  return state.holdings.find((item) => item.symbol === state.selectedSymbol) ?? state.holdings[0] ?? null;
}

function getPrice(holding) {
  return Number(state.quotes[holding.symbol]?.price ?? holding.avgCost);
}

function hasReliableQuote(holding) {
  return state.quotes[holding.symbol]?.isReliable === true;
}

function loadDrawings() {
  try {
    const raw = localStorage.getItem(DRAWINGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeDrawing).filter(Boolean);
  } catch (error) {
    return [];
  }
}

function saveDrawings() {
  localStorage.setItem(DRAWINGS_STORAGE_KEY, JSON.stringify(state.drawings));
}

function normalizeDrawing(item) {
  if (!item || typeof item !== "object") return null;
  const symbol = String(item.symbol || "").trim().toUpperCase();
  const timeframe = String(item.timeframe || "").trim();
  const key = item.key || (symbol && timeframe ? chartKey(symbol, timeframe) : "");
  const startTime = Number(item.startTime);
  const endTime = Number(item.endTime);
  const startPrice = Number(item.startPrice);
  const endPrice = Number(item.endPrice);
  if (!key || !symbol || !timeframe) return null;
  if (![startTime, endTime, startPrice, endPrice].every(Number.isFinite)) return null;
  return {
    id: item.id || createId(),
    key,
    symbol,
    timeframe,
    startTime,
    startPrice,
    endTime,
    endPrice,
    createdAt: item.createdAt || new Date().toISOString(),
  };
}

function loadHoldings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeHolding).filter(Boolean);
  } catch (error) {
    return [];
  }
}

function saveHoldings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.holdings));
}

function normalizeHolding(item) {
  const market = inferMarket(item.symbol, item.market);
  const symbol = normalizeSymbol(item.symbol, market);
  const shares = Number(item.shares);
  const avgCost = Number(item.avgCost);
  if (!symbol || !Number.isFinite(shares) || !Number.isFinite(avgCost)) return null;
  return {
    id: item.id || createId(),
    symbol,
    market,
    currency: item.currency || getMarketCurrency(market),
    name: String(item.name || symbol).trim(),
    shares,
    avgCost,
    targetPrice: parseOptionalNumber(item.targetPrice),
    stopLoss: parseOptionalNumber(item.stopLoss),
    notes: String(item.notes || "").trim(),
  };
}

function loadSamples() {
  const confirmed =
    !state.holdings.length || window.confirm("载入示例会替换当前持仓数据，是否继续？");
  if (!confirmed) return;
  state.holdings = SAMPLE_HOLDINGS.map((holding) => ({ ...holding, id: createId() }));
  state.quotes = {};
  state.charts = {};
  state.drawings = [];
  state.drawingDraft = null;
  saveDrawings();
  state.selectedSymbol = state.holdings[0].symbol;
  saveHoldings();
  resetForm();
  render();
  refreshAllQuotes();
}

function clearAllData() {
  if (!state.holdings.length) return;
  const confirmed = window.confirm("清空所有本地持仓数据？这个操作不会影响导出的备份文件。");
  if (!confirmed) return;
  state.holdings = [];
  state.quotes = {};
  state.charts = {};
  state.drawings = [];
  state.drawingDraft = null;
  state.selectedSymbol = null;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DRAWINGS_STORAGE_KEY);
  resetForm();
  render();
  showToast("本地持仓已清空。");
}

function exportHoldings() {
  const payload = {
    exportedAt: new Date().toISOString(),
    version: 1,
    holdings: state.holdings,
    drawings: state.drawings,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `portfolio-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  showToast("持仓备份已导出。");
}

function importHoldings(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const imported = Array.isArray(parsed) ? parsed : parsed.holdings;
      if (!Array.isArray(imported)) throw new Error("无效文件");
      const nextHoldings = imported.map(normalizeHolding).filter(Boolean);
      if (!nextHoldings.length) throw new Error("没有有效持仓");
      state.holdings = nextHoldings;
      state.quotes = {};
      state.charts = {};
      state.drawings = Array.isArray(parsed.drawings) ? parsed.drawings.map(normalizeDrawing).filter(Boolean) : [];
      state.drawingDraft = null;
      state.selectedSymbol = state.holdings[0].symbol;
      saveHoldings();
      saveDrawings();
      resetForm();
      render();
      refreshAllQuotes();
      showToast("持仓已导入。");
    } catch (error) {
      showToast("导入失败，请确认文件格式正确。");
    } finally {
      els.importFile.value = "";
    }
  };
  reader.readAsText(file);
}

function updateClock() {
  const now = new Date();
  const eastern = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "America/New_York",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  }).format(now);
  const beijing = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  }).format(now);
  els.marketClock.innerHTML = `
    <span class="market-clock-line">美东 ${eastern} · ${getMarketStatus(now)}</span>
    <span class="market-clock-line">北京 ${beijing} · ${getChinaMarketStatus(now)}</span>
  `;
}

function getMarketStatus(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  const minutes = hour * 60 + minute;
  const isWeekday = !["Sat", "Sun"].includes(weekday);
  if (!isWeekday) return "休市";
  if (minutes >= 9 * 60 + 30 && minutes < 16 * 60) return "盘中";
  if (minutes >= 4 * 60 && minutes < 9 * 60 + 30) return "盘前";
  if (minutes >= 16 * 60 && minutes < 20 * 60) return "盘后";
  return "休市";
}

function getChinaMarketStatus(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Shanghai",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  const minutes = hour * 60 + minute;
  const isWeekday = !["Sat", "Sun"].includes(weekday);
  if (!isWeekday) return "休市";
  if (minutes >= 9 * 60 + 30 && minutes < 11 * 60 + 30) return "盘中";
  if (minutes >= 13 * 60 && minutes < 15 * 60) return "盘中";
  if (minutes >= 9 * 60 && minutes < 9 * 60 + 30) return "集合竞价";
  if (minutes >= 11 * 60 + 30 && minutes < 13 * 60) return "午休";
  return "休市";
}

function chartKey(symbol, rangeKey) {
  return `${symbol}:${rangeKey}`;
}

function normalizeSymbol(value, market = "US") {
  const raw = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");

  if (market === "CN") {
    const cleaned = raw
      .replace(/\.SSE$/, ".SH")
      .replace(/\.SS$/, ".SH")
      .replace(/\.SHA$/, ".SH")
      .replace(/\.SH$/, ".SH")
      .replace(/\.SZSE$/, ".SZ")
      .replace(/\.SHE$/, ".SZ")
      .replace(/\.SZ$/, ".SZ")
      .replace(/\.BJ$/, ".BJ");
    const match = cleaned.match(/^(\d{6})(?:\.(SH|SZ|BJ))?$/);
    if (!match) return cleaned;
    const code = match[1];
    const suffix = match[2] || inferAshareSuffix(code);
    return suffix ? `${code}.${suffix}` : code;
  }

  return raw;
}

function inferMarket(symbol, requestedMarket) {
  const raw = String(symbol || "").trim().toUpperCase();
  if (looksLikeAshare(raw)) return "CN";
  return normalizeMarket(requestedMarket);
}

function normalizeMarket(value) {
  return MARKET_CONFIG[value] ? value : "US";
}

function looksLikeAshare(symbol) {
  return /^(\d{6})(\.(SH|SS|SSE|SHA|SZ|SZSE|SHE|BJ))?$/.test(symbol.trim().toUpperCase());
}

function inferAshareSuffix(code) {
  if (/^(5|6|9)/.test(code)) return "SH";
  if (/^(0|1|2|3)/.test(code)) return "SZ";
  if (/^(4|8)/.test(code)) return "BJ";
  return "";
}

function toYahooTicker(symbol, market = "US") {
  if (market === "CN") {
    return symbol.replace(/\.SH$/, ".SS");
  }
  return symbol.replace(/\./g, "-");
}

function getMarketCurrency(market = "US") {
  return MARKET_CONFIG[normalizeMarket(market)].currency;
}

function getHoldingCurrency(holding) {
  return holding.currency || getMarketCurrency(holding.market);
}

function getMarketLabel(market = "US") {
  return MARKET_CONFIG[normalizeMarket(market)].label;
}

function parseNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function parseOptionalNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function createId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  return function next() {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatCurrency(value, currency = "USD", decimals = DISPLAY_DECIMALS) {
  if (currency === "CNY") {
    return formatYuan(value, false, decimals);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(value) || 0);
}

function formatCompactCurrency(value, currency = "USD", decimals = DISPLAY_DECIMALS) {
  if (currency === "CNY") {
    return formatYuan(value, Math.abs(value) >= 10000, decimals);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: Math.abs(value) >= 10000 ? "compact" : "standard",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(value) || 0);
}

function formatYuan(value, compact = false, decimals = DISPLAY_DECIMALS) {
  const number = Number(value) || 0;
  const sign = number < 0 ? "-" : "";
  const formatted = new Intl.NumberFormat("en-US", {
    notation: compact ? "compact" : "standard",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(number));
  return `${sign}¥${formatted}`;
}

function formatChartCurrency(value, currency = "USD") {
  return formatCurrency(value, currency, CHART_DECIMALS);
}

function formatChartCompactCurrency(value, currency = "USD") {
  return formatCompactCurrency(value, currency, CHART_DECIMALS);
}

function formatChartPercent(value) {
  return formatPercent(value, CHART_DECIMALS);
}

function formatCurrencyGroups(groups, field, signed = false, colorByValue = false) {
  const values = Object.values(groups);
  if (!values.length) return "--";
  const lines = values.map((group) => {
    const value = group[field] || 0;
    const prefix = signed && value > 0 ? "+" : "";
    const tone = colorByValue ? getToneClass(value) : "";
    return `<span class="${tone}">${formatCurrencyLabel(group.currency)} ${prefix}${formatCurrency(value, group.currency)}</span>`;
  });
  return `<span class="metric-stack">${lines.join("")}</span>`;
}

function formatPercentGroups(groups, field, colorByValue = false) {
  const values = Object.values(groups);
  if (!values.length) return "添加持仓后显示";
  const lines = values.map((group) => {
    const value = group[field] || 0;
    const tone = colorByValue ? getToneClass(value) : "";
    return `<span class="${tone}">${formatCurrencyLabel(group.currency)} ${value >= 0 ? "+" : ""}${formatPercent(value)}</span>`;
  });
  return `<span class="metric-stack">${lines.join("")}</span>`;
}

function formatTopAllocationValues(items) {
  if (!items?.length) return "--";
  const lines = items.map(
    (item) => `<span>${getMarketLabel(item.market)} ${item.allocation.toFixed(DISPLAY_DECIMALS)}%</span>`,
  );
  return `<span class="metric-stack">${lines.join("")}</span>`;
}

function formatTopAllocationNotes(items) {
  if (!items?.length) return "添加持仓后显示";
  const lines = items.map(
    (item) => `<span>${escapeHtml(getHoldingDisplayName(item))} 在${getInlineMarketLabel(item.market)}持仓中占比最高</span>`,
  );
  return `<span class="metric-stack">${lines.join("")}</span>`;
}

function getHoldingDisplayName(item) {
  const name = String(item?.name || "").trim();
  const symbol = String(item?.symbol || "").trim();
  return name || symbol || "这只股票";
}

function getInlineMarketLabel(market) {
  return getMarketLabel(market).replace(/\s+/g, "");
}

function formatCurrencyLabel(currency) {
  if (currency === "CNY") return "人民币";
  if (currency === "USD") return "美元";
  return currency || "";
}

function formatMarketCounts(counts) {
  const parts = Object.entries(counts).map(([market, count]) => `<span>${getMarketLabel(market)} ${count}</span>`);
  return parts.length ? `<span class="metric-stack">${parts.join("")}</span>` : "添加持仓后显示";
}

function formatPercent(value, decimals = DISPLAY_DECIMALS) {
  return `${(Number(value) || 0).toFixed(decimals)}%`;
}

function formatNumber(value, decimals = DISPLAY_DECIMALS) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(value) || 0);
}

function formatAxisDate(timestamp) {
  const options = ["15m", "1H", "4H"].includes(state.selectedTimeframe)
    ? {
        timeZone: "America/New_York",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
    : {
        timeZone: "America/New_York",
        month: "2-digit",
        day: "2-digit",
      };
  return new Intl.DateTimeFormat("zh-CN", options).format(new Date(timestamp));
}

function formatCandleTime(timestamp, holding) {
  const includesTime = ["15m", "1H", "4H"].includes(state.selectedTimeframe);
  const timeZone = holding?.market === "CN" ? "Asia/Shanghai" : "America/New_York";
  const options = includesTime
    ? {
        timeZone,
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
    : {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };
  return new Intl.DateTimeFormat("zh-CN", options).format(new Date(timestamp));
}

function formatVolume(value) {
  const number = Number(value) || 0;
  if (Math.abs(number) >= 100000000) return `${formatNumber(number / 100000000)}亿`;
  if (Math.abs(number) >= 10000) return `${formatNumber(number / 10000)}万`;
  return formatNumber(number);
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function getToneClass(value) {
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "neutral";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

let toastTimeout = null;
function showToast(message) {
  clearTimeout(toastTimeout);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimeout = setTimeout(() => {
    els.toast.classList.remove("show");
  }, 2600);
}
