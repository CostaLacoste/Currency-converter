const api = `https://v6.exchangerate-api.com/v6/ed6f332df4403b9200a1285c/latest/USD`;
const fromDropDown = document.getElementById("from");
const toDropDown = document.getElementById("to");
const resultEl = document.getElementById("result");
const amountEl = document.getElementById("amount");

currencies.forEach((currency) => {
  const option = document.createElement("option");
  option.value = currency;
  option.textContent = currency;
  fromDropDown.appendChild(option);
});

currencies.forEach((currency) => {
  const option = document.createElement("option");
  option.value = currency;
  option.textContent = currency;
  toDropDown.appendChild(option);
});

fromDropDown.value = "USD";
toDropDown.value = "AFN";

const convertCurrency = () => {
  const amount = amountEl.value;
  const fromCurrency = fromDropDown.value;
  const toCurrency = toDropDown.value;

  if (amount === "" || Number(amount) <= 0) {
    resultEl.textContent = "Please fill in the amount";
    return;
  }

  fetch(api)
    .then((resp) => resp.json())
    .then((data) => {
      const rates = data.conversion_rates;

      const fromRate = rates[fromCurrency];
      const toRate = rates[toCurrency];

      if (!fromRate || !toRate) {
        resultEl.textContent = "Rate not found for selected currency";
        return;
      }

      const convertedAmount = (Number(amount) / fromRate) * toRate;

      resultEl.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(
        2
      )} ${toCurrency}`;
    })
    .catch(() => {
      resultEl.textContent = "Error fetching exchange rates";
    });
};

document
  .querySelector("#convert-button")
  .addEventListener("click", convertCurrency);

window.addEventListener("load", convertCurrency);