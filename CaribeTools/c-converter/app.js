const convertBtn = document.getElementById("convertBtn");
const fileInput = document.getElementById("fileInput");
const conversionType = document.getElementById("conversionType");
const statusBox = document.getElementById("status");

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

  statusBox.textContent = `⏳ Subiendo archivo…`;

  try {
    // 1. Crear tarea
    const jobRes = await fetch("https://api.convertio.co/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: "upload",
        file: file.name,
        convertto: type.output
      })
    });

    const job = await jobRes.json();
    const jobId = job.data.id;

    // 2. Subir archivo
    const uploadUrl = job.data.upload_url;

    const formData = new FormData();
    formData.append("file", file);

    await fetch(uploadUrl, { method: "POST", body: formData });

    statusBox.textContent = "⏳ Convirtiendo archivo…";

    // 3. Esperar conversión
    let status = "";
    while (status !== "finished") {
      await new Promise(r => setTimeout(r, 2000));

      const checkRes = await fetch(`https://api.convertio.co/convert/${jobId}/status`);
      const check = await checkRes.json();

      status = check.data.status;
    }

    const downloadUrl = `https:${job.data.output.url}`;

    // 4. Descargar archivo convertido
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `convertido.${type.output}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    statusBox.textContent = "✅ Conversión completada.";
  } catch (err) {
    console.error(err);
    statusBox.textContent = `❌ Error: ${err.message}`;
  }
}

convertBtn.addEventListener("click", convertFile);
