// ================================
//  CALCULADORA DE IMPORTACIONES RD
// ================================

// Tarifas estimadas por tienda (ajústalas cuando tengas datos reales)
const tarifasCourier = {
    amazon: 3.50, // USD por libra
    shein: 2.80,
    temu: 2.50,
    ebay: 4.00
};

// Costo fijo de manejo del courier
const costoManejo = 5.00; // USD

document.getElementById("calcular").addEventListener("click", () => {
    const precio = parseFloat(document.getElementById("precio").value);
    const libras = parseFloat(document.getElementById("libras").value);
    const tienda = document.getElementById("tienda").value;

    const resultadoDiv = document.getElementById("resultado");

    // VALIDACIONES
    if (!precio || precio <= 0 || !libras || libras <= 0) {
        resultadoDiv.style.display = "block";
        resultadoDiv.innerHTML = `<strong>Por favor completa todos los campos correctamente.</strong>`;
        return;
    }

    // ================================
    //  1. COSTO DE COURIER
    // ================================
    const tarifaPorLb = tarifasCourier[tienda];
    const costoCourier = libras * tarifaPorLb;

    // ================================
    //  2. VERIFICAR EXENCIÓN < 200 USD
    // ================================
    let itbis = 0;
    let gravamen = 0;
    let impuestoTotal = 0;

    if (precio > 200) {
        // ITBIS 18%
        itbis = precio * 0.18;

        // Gravamen aproximado 20%
        gravamen = precio * 0.20;

        // Total de impuestos
        impuestoTotal = itbis + gravamen;
    }

    // ================================
    //  3. TOTAL FINAL
    // ================================
    const totalFinal = precio + impuestoTotal + costoCourier + costoManejo;

    // ================================
    //  4. MOSTRAR RESULTADO
    // ================================
    resultadoDiv.style.display = "block";
    resultadoDiv.innerHTML = `
        <h3>📦 Resultado del Cálculo</h3>

        <p><strong>Precio del artículo:</strong> US$ ${precio.toFixed(2)}</p>
        <p><strong>Costo de Courier (${libras} lb a US$ ${tarifaPorLb}/lb):</strong> US$ ${costoCourier.toFixed(2)}</p>
        <p><strong>Costo de Manejo:</strong> US$ ${costoManejo.toFixed(2)}</p>

        ${
            precio < 200
                ? `<p style="color:green;"><strong>Exento de impuestos (menor a US$200)</strong></p>`
                : `
            <p><strong>ITBIS (18%):</strong> US$ ${itbis.toFixed(2)}</p>
            <p><strong>Gravamen (20%):</strong> US$ ${gravamen.toFixed(2)}</p>
            <p><strong>Total de Impuestos:</strong> US$ ${impuestoTotal.toFixed(2)}</p>
        `
        }

        <hr style="margin: 15px 0;">

        <p style="font-size: 1.2rem;"><strong>Total a pagar:</strong> US$ ${totalFinal.toFixed(2)}</p>
    `;
});
