const convertBtn = document.getElementById("convertBtn");
const fileInput = document.getElementById("fileInput");
const conversionType = document.getElementById("conversionType");
const statusBox = document.getElementById("status");

// Tu API Key Convertio
const API_KEY = "38f71645d94c716fc786671bef576457";

const conversions = {
  "pdf-to-docx": { input: "pdf", output: "docx" },
  "docx-to-pdf": { input: "docx", output: "pdf" },
  "pdf-to-png": { input: "pdf", output: "png" },
  "img-to-pdf": { input: "jpg", output: "pdf" }, 
  "pdf-to-xlsx": { input: "pdf", output: "xlsx" },
  "xlsx-to-pdf": { input: "xlsx", output: "pdf" },
  "ppt-to-pdf": { input: "pptx", output: "pdf" },
  "pdf-to-ppt": { input: "pdf", output: "pptx" },
  "img-to-webp": { input: "jpg", output: "webp" },
  "txt-to-pdf": { input: "txt", output: "pdf" }
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

  statusBox.textContent = "⏳ Subiendo archivo...";

  try {
    // 1. Crear Job
    const createRes = await fetch("https://api.convertio.co/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apikey: API_KEY,
        input: "upload",
        inputformat: type.input,
        outputformat: type.output
      })
    });

    const createData = await createRes.json();
    if (!createData.data || !createData.data.id) {
      throw new Error("No se pudo crear la conversión.");
    }

    const jobId = createData.data.id;

    // 2. Subir archivo
    statusBox.textContent = "⏳ Enviando archivo...";

    const formData = new FormData();
    formData.append("file", file);

    await fetch(createData.data.upload_url, {
      method: "POST",
      body: formData
    });

    // 3. Revisar estado
    statusBox.textContent = "⏳ Convirtiendo archivo...";

    let status = "";
    while (status !== "finished") {
      await new Promise(r => setTimeout(r, 2000));

      const checkRes = await fetch(`https://api.convertio.co/convert/${jobId}/status`);
      const checkData = await checkRes.json();

      status = checkData.data.status;

      if (status === "error") {
        throw new Error("La conversión falló.");
      }
    }

    // 4. Descargar archivo
    const downloadUrl = "https:" + createData.data.output.url;

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `convertido.${type.output}`;
    a.click();

    statusBox.textContent = "✅ Conversión completada.";
  } catch (err) {
    console.error(err);
    statusBox.textContent = `❌ Error: ${err.message}`;
  }
}

convertBtn.addEventListener("click", convertFile);
