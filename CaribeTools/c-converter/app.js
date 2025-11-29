const convertBtn = document.getElementById("convertBtn");
const fileInput = document.getElementById("fileInput");
const conversionType = document.getElementById("conversionType");
const statusBox = document.getElementById("status");

const conversions = {
  "pdf-to-docx": { output: "docx" },
  "docx-to-pdf": { output: "pdf" },
  "pdf-to-png": { output: "png" },
  "img-to-pdf": { output: "pdf" },
  "pdf-to-xlsx": { output: "xlsx" },
  "xlsx-to-pdf": { output: "pdf" },
  "ppt-to-pdf": { output: "pdf" },
  "pdf-to-ppt": { output: "pptx" },
  "img-to-webp": { output: "webp" },
  "txt-to-pdf": { output: "pdf" }
};

async function convertFile() {
  const file = fileInput.files[0];

  if (!file) {
    statusBox.textContent = "⚠️ Selecciona un archivo primero.";
    return;
  }

  const type = conversions[conversionType.value];
  if (!type) {
    statusBox.textContent = "❌ Tipo de conversión no soportado.";
    return;
  }

  statusBox.textContent = "⏳ Convirtiendo archivo…";

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("to", type.output);

    const res = await fetch("https://converter-api.vercel.app/api/convert", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (!data || !data.download) {
      throw new Error("La API no devolvió un archivo válido");
    }

    const downloadUrl = data.download;

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `convertido.${type.output}`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    statusBox.textContent = "✅ Conversión completada.";
  } catch (err) {
    console.error(err);
    statusBox.textContent = `❌ Error: ${err.message}`;
  }
}

convertBtn.addEventListener("click", convertFile);
