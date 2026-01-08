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