// ===================== CONFIG =====================
const apiKey = "ed6f332df4403b9200a1285c";
const apiBase = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/`;

const STORAGE_KEY = "converterState";
const RATES_KEY = "cachedRates";
const CACHE_TIME = 2 * 60 * 1000; // 2 минуты

// ===================== DOM =====================
const fromDropDown = document.querySelector("#from");
const toDropDown = document.querySelector("#to");
const resultEl = document.querySelector("#result");
const amountEl = document.querySelector("#amount");
const convertBtn = document.querySelector("#convert-button");

// ===================== UI: OPTIONS =====================
// если в HTML уже были option'ы — убираем, чтобы не было дублей
fromDropDown.innerHTML = "";
toDropDown.innerHTML = "";

// currencies должен быть определён в currecy-codes.js
currencies.forEach((currency) => {
  const o1 = document.createElement("option");
  o1.value = currency;
  o1.textContent = currency;
  fromDropDown.appendChild(o1);

  const o2 = document.createElement("option");
  o2.value = currency;
  o2.textContent = currency;
  toDropDown.appendChild(o2);
});

// значения по умолчанию (если storage пуст)
fromDropDown.value = "USD";
toDropDown.value = "AFN";

// ===================== localStorage: STATE =====================
const saveState = () => {
  const state = {
    amount: amountEl.value,
    from: fromDropDown.value,
    to: toDropDown.value,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const loadState = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const state = JSON.parse(saved);

    if (state.amount !== undefined) amountEl.value = state.amount;
    if (state.from) fromDropDown.value = state.from;
    if (state.to) toDropDown.value = state.to;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
};

// ===================== API: RATES + CACHE =====================
const getRates = async (baseCurrency) => {
  const cachedRaw = localStorage.getItem(RATES_KEY);
  const cached = cachedRaw ? JSON.parse(cachedRaw) : null;

  if (
    cached &&
    cached.base === baseCurrency &&
    Date.now() - cached.timestamp < CACHE_TIME
  ) {
    return cached.rates;
  }

  const response = await fetch(`${apiBase}${baseCurrency}`);
  const data = await response.json();

  // exchangerate-api: { result: "success" | "error", "error-type": "..." }
  if (data.result !== "success") {
    throw new Error(data["error-type"] || "api-error");
  }

  const rates = data.conversion_rates;

  localStorage.setItem(
    RATES_KEY,
    JSON.stringify({
      base: baseCurrency,
      rates,
      timestamp: Date.now(),
    })
  );

  return rates;
};

// ===================== CONVERT =====================
const convertCurrency = async () => {
  const amount = Number(amountEl.value);
  const fromCurrency = fromDropDown.value;
  const toCurrency = toDropDown.value;

  if (!Number.isFinite(amount) || amount <= 0) {
    resultEl.textContent = "Please enter valid amount";
    return;
  }

  try {
    const rates = await getRates(fromCurrency);
    const rate = rates[toCurrency];

    if (!rate) {
      resultEl.textContent = "Rate not found";
      return;
    }

    const convertedAmount = amount * rate;

    resultEl.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(
      2
    )} ${toCurrency}`;

    saveState();
  } catch (err) {
    // покажем точную причину — поможет понять, ключ ли умер / лимит ли
    resultEl.textContent = `Error fetching exchange rates (${err.message})`;
  }
};

// ===================== EVENTS =====================
convertBtn.addEventListener("click", convertCurrency);

amountEl.addEventListener("input", saveState);

fromDropDown.addEventListener("change", () => {
  saveState();
  convertCurrency();
});

toDropDown.addEventListener("change", () => {
  saveState();
  convertCurrency();
});

// ===================== INIT =====================
window.addEventListener("load", () => {
  loadState();       // восстановит amount/from/to (если было сохранено)
  convertCurrency(); // сразу покажет result
});
