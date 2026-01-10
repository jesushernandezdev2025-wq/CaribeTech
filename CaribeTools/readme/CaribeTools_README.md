# 🇩🇴 CaribeTools --- Suite de Herramientas Útiles para República Dominicana

CaribeTools es una colección de herramientas diseñadas especialmente
para usuarios de la República Dominicana, con cálculos y utilidades
basadas en la vida diaria del país.\
El objetivo es ofrecer funciones realmente útiles, rápidas y sin
depender de APIs costosas.

------------------------------------------------------------------------

## 🌟 Objetivo Principal

Crear una plataforma de mini‑aplicaciones dominicanas con cálculos
reales, datos locales y funciones que la gente usa todos los días.

------------------------------------------------------------------------

## 🇩🇴 Herramientas Planeadas

### ✔ 1. Calculadora de Importaciones (Aduanas)

-   Cálculo estimado de impuestos y costos por courier.
-   Exención \< USD 200.
-   Cargos adicionales (manejo, ITBIS, gravamen, etc.)
-   Comparación por tiendas (Amazon, Shein, Temu, eBay).

------------------------------------------------------------------------

### ✔ 2. Conversor de Sueldo Bruto ↔ Neto (RD)

-   Cálculo de ISR.
-   AFP y ARS.
-   Sueldo real recibido.
-   Costo total para empleador.

------------------------------------------------------------------------

### ✔ 3. Verificador de Loterías Dominicanas

Sin API --- scraping liviano. - La Primera\
- Real\
- Nacional\
- Loteka\
- Leidsa\
- Super Kino TV\
- Quinielas

------------------------------------------------------------------------

### ✔ 4. Simulador de Préstamos

-   Interés simple o compuesto.
-   Cuota mensual.
-   Tabla de amortización.
-   Comparación bancos vs prestamistas.

------------------------------------------------------------------------

### ✔ 5. Precio de Combustibles (Actualizado semanalmente)

-   Gasolina regular & premium
-   Gasoil
-   GLP
-   Variaciones por semana
-   Gráfica histórica

------------------------------------------------------------------------

## 🧩 Tecnologías Sugeridas

-   **Front-end:** HTML, TailwindCSS, JavaScript\
-   **Back-end:** Node.js + Express\
-   **Scraping:** Cheerio / Puppeteer\
-   **Deploy:** Vercel, Render o Railway

------------------------------------------------------------------------

## 📁 Estructura del Proyecto (Propuesta)

    caribetools/
    │
    ├─ public/
    │   ├─ assets/
    │   └─ styles/
    │
    ├─ src/
    │   ├─ tools/
    │   │   ├─ import-calculator/
    │   │   ├─ salary-converter/
    │   │   ├─ lottery-checker/
    │   │   ├─ loan-simulator/
    │   │   └─ fuel-prices/
    │   │
    │   ├─ utils/
    │   ├─ routes/
    │   ├─ controllers/
    │   └─ server.js
    │
    └─ README.md

------------------------------------------------------------------------

## 🚀 Fases del Proyecto

### **Fase 1 -- Core**

-   Calculadora de importaciones\
-   Sueldo bruto → neto\
-   Simulador de préstamos

### **Fase 2 -- Datos externos**

-   Verificador de loterías\
-   Combustibles

### **Fase 3 -- UI Pro**

-   Dashboard con tarjetas\
-   Buscador interno\
-   Modo oscuro/claro

------------------------------------------------------------------------

## 📝 Licencia

Proyecto cerrado para uso exclusivo de **CaribeTech**.

------------------------------------------------------------------------

## 👤 Autor

**CaribeTech** --- Ecosistema digital para RD.
