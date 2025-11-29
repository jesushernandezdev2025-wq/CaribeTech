document.getElementById("calcular").addEventListener("click", () => {
    const monto = parseFloat(document.getElementById("monto").value);
    const interes = parseFloat(document.getElementById("interes").value);
    const meses = parseInt(document.getElementById("meses").value);

    if (isNaN(monto) || isNaN(interes) || isNaN(meses)) {
        alert("Completa todos los campos correctamente.");
        return;
    }

    const tasa = interes / 100 / 12;

    // Fórmula de cuota mensual (Sistema francés)
    const cuota = monto * (tasa / (1 - Math.pow(1 + tasa, -meses)));

    const total = cuota * meses;
    const interesTotal = total - monto;

    document.getElementById("cuota").textContent = `RD$ ${cuota.toFixed(2)}`;
    document.getElementById("total").textContent = `RD$ ${total.toFixed(2)}`;
    document.getElementById("interesTotal").textContent = `RD$ ${interesTotal.toFixed(2)}`;
});
