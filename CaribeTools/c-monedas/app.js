const API_URL = "https://open.er-api.com/v6/latest/USD";

// Elementos
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const convertBtn = document.getElementById("convertBtn");
const resultBox = document.getElementById("result");

// Cargar monedas
async function loadCurrencies() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        const currencies = Object.keys(data.rates);

        currencies.forEach(code => {
            const opt1 = document.createElement("option");
            const opt2 = document.createElement("option");

            opt1.value = code;
            opt1.textContent = code;

            opt2.value = code;
            opt2.textContent = code;

            fromSelect.appendChild(opt1);
            toSelect.appendChild(opt2);
        });

        fromSelect.value = "USD";
        toSelect.value = "DOP";

    } catch (error) {
        resultBox.innerHTML = "Error cargando monedas.";
    }
}

loadCurrencies();

// Convertir
convertBtn.addEventListener("click", async () => {
    const amount = parseFloat(document.getElementById("amount").value);
    const from = fromSelect.value;
    const to = toSelect.value;

    if (isNaN(amount)) {
        resultBox.innerHTML = "Introduce un monto válido.";
        return;
    }

    try {
        const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
        const data = await res.json();

        const rate = data.rates[to];
        const converted = (amount * rate).toFixed(2);

        resultBox.innerHTML = `
            ${amount} ${from} = <strong>${converted} ${to}</strong>
        `;
    } catch (e) {
        resultBox.innerHTML = "No se pudo convertir.";
    }
});
