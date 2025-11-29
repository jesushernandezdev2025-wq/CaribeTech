const convertBtn = document.getElementById("convertBtn");
const fileInput = document.getElementById("fileInput");
const conversionType = document.getElementById("conversionType");
const statusBox = document.getElementById("status");

const API_SECRET = "TU_SECRET_KEY"; // reemplaza con tu clave real
const BASE_URL = "https://v2.convertapi.com/convert";

async function convertFile() {
  const file = fileInput.files[0];
  if (!file) {
    statusBox.textContent = "⚠️ Selecciona un archivo primero.";
    return;
  }

  // Mensaje inicial
  statusBox.textContent = `⏳ Convirtiendo (${conversionType.value})…`;

  let endpoint = "";

  switch (conversionType.value) {
    case "pdf-to-docx":
      endpoint = "pdf/to/docx";
      break;
    case "docx-to-pdf":
      endpoint = "docx/to/pdf";
      break;
    case "pdf-to-png":
      endpoint = "pdf/to/png";
      break;
    case "img-to-pdf":
      endpoint = "jpg/to/pdf"; // también funciona con PNG
      break;
    case "pdf-to-xlsx":
      endpoint = "pdf/to/xlsx";
      break;
    case "xlsx-to-pdf":
      endpoint = "xlsx/to/pdf";
      break;
    case "ppt-to-pdf":
      endpoint = "pptx/to/pdf";
      break;
    case "pdf-to-ppt":
      endpoint = "pdf/to/pptx";
      break;
    case "img-to-webp":
      endpoint = "jpg/to/webp"; // también funciona con PNG
      break;
    case "txt-to-pdf":
      endpoint = "txt/to/pdf";
      break;
    default:
      statusBox.textContent = "❌ Tipo de conversión no soportado.";
      return;
  }

  const formData = new FormData();
  formData.append("File", file);

  try {
    const res = await fetch(`${BASE_URL}/${endpoint}?Secret=${API_SECRET}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data.Files || !data.Files[0]) {
      statusBox.textContent = "❌ Error en la conversión.";
      return;
    }

    const fileUrl = data.Files[0].Url;

    statusBox.innerHTML = `
      ✅ Conversión lista <br><br>
      <a href="${fileUrl}" download class="btn">⬇️ Descargar archivo</a>
    `;
  } catch (err) {
    console.error(err);
    statusBox.textContent = "❌ Ocurrió un error en la API.";
  }
}

convertBtn.addEventListener("click", convertFile);
