document.getElementById("calcular").addEventListener("click", () => {
    const monto = parseFloat(document.getElementById("monto").value);

    if (isNaN(monto) || monto <= 0) {
        alert("Por favor ingresa un monto válido.");
        return;
    }

    const itbis = monto * 0.18;
    const total = monto + itbis;

    document.getElementById("itbis").textContent = `RD$ ${itbis.toFixed(2)}`;
    document.getElementById("total").textContent = `RD$ ${total.toFixed(2)}`;
});
