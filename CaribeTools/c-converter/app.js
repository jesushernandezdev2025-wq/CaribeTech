const convertBtn = document.getElementById("convertBtn");
const fileInput = document.getElementById("fileInput");
const conversionType = document.getElementById("conversionType");
const statusBox = document.getElementById("status");

const API_SECRET = "rKw9hUoGDXbHnGyYo7fdwyas577q4xwC"; // tu clave real
const BASE_URL = "https://v2.convertapi.com/convert";

async function convertFile() {
  const file = fileInput.files[0];
  if (!file) {
    statusBox.textContent = "⚠️ Selecciona un archivo primero.";
    return;
  }

  statusBox.textContent = `⏳ Convirtiendo (${conversionType.value})…`;

  let endpoint = "";
  switch (conversionType.value) {
    case "pdf-to-docx": endpoint = "pdf/to/docx"; break;
    case "docx-to-pdf": endpoint = "docx/to/pdf"; break;
    case "pdf-to-png": endpoint = "pdf/to/png"; break;
    case "img-to-pdf": endpoint = "jpg/to/pdf"; break;
    case "pdf-to-xlsx": endpoint = "pdf/to/xlsx"; break;
    case "xlsx-to-pdf": endpoint = "xlsx/to/pdf"; break;
    case "ppt-to-pdf": endpoint = "pptx/to/pdf"; break;
    case "pdf-to-ppt": endpoint = "pdf/to/pptx"; break;
    case "img-to-webp": endpoint = "jpg/to/webp"; break;
    case "txt-to-pdf": endpoint = "txt/to/pdf"; break;
    default:
      statusBox.textContent = "❌ Tipo de conversión no soportado.";
      return;
  }

  const formData = new FormData();
  formData.append("File", file);

  try {
    // OJO: el parámetro es "secret" en minúsculas
    const res = await fetch(`${BASE_URL}/${endpoint}?secret=${API_SECRET}`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

    const data = await res.json();
    if (!data.Files || !data.Files[0]) {
      statusBox.textContent = "❌ Error en la conversión.";
      return;
    }

    const fileUrl = data.Files[0].Url;
    const fileName = data.Files[0].FileName || "archivo_convertido";

    // Descarga inmediata como blob (para evitar que el link caduque)
    const resFile = await fetch(fileUrl);
    const blob = await resFile.blob();
    const urlBlob = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = urlBlob;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    statusBox.textContent = "✅ Conversión lista y descargada automáticamente.";
  } catch (err) {
    console.error(err);
    statusBox.textContent = `❌ Ocurrió un error: ${err.message}`;
  }
}

convertBtn.addEventListener("click", convertFile);
