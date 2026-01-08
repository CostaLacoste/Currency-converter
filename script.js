let api = `https://v6.exchangerate-api.com/v6/ed6f332df4403b9200a1285c/latest/USD`;
const fromDropDown = document.getElementById("from");
const toDropDown = document.getElementById("to");

currencies.forEach((currency) => {
    const option = document.createElement("option");
    option.value = currency;
    option.text = currency;
    fromDropDown.addEventListener(option);
})

currencies.forEach((currency) => {
    const option = document.createElement("option");
    option.value = currency;
    option.text = currency;
    toDropDown.addEventListener(option);
})

from.value = "UDS";
toDropDown.value = "AFN";

let convertCurrency = () => {
    const amount = document.querySelector("#amount").value;
    const fromCurrency = from.value;
    const toCurrency = toDropDown.value;

    if (amount.length !== 0){
        fetch(api)
            .then((resp) => resp.json())
            .then((data) => {
                let fromExchangeRate = data.convertion_rates[fromCurrency];
                const convertedAmount = (amount / fromExchangeRate) * toExchangeRate;
                result.innerHTML = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`
            }) 
    } else {
        alert("Please fill in the amount")
    }
};

document
        .querySelector("#convert-button")
        .addEventListener("click", convertCurrency);
window.addEventListener("load", convertCurrency);        