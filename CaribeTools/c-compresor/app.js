const imageInput = document.getElementById("imageInput");
const qualityInput = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");
const compressBtn = document.getElementById("compressBtn");
const preview = document.getElementById("preview");

// Botones de descarga en varios formatos
const downloadOptions = document.getElementById("downloadOptions");
const downloadJPG = document.getElementById("downloadJPG");
const downloadPNG = document.getElementById("downloadPNG");
const downloadWEBP = document.getElementById("downloadWEBP");

// Elemento para mostrar tamaños
const sizeInfo = document.createElement("p");
sizeInfo.style.marginTop = "15px";
sizeInfo.style.fontSize = "0.95rem";
sizeInfo.style.opacity = "0.85";
preview.appendChild(sizeInfo);

let originalImage = null;
let originalSize = 0;

// Mostrar valor de calidad
qualityInput.addEventListener("input", () => {
  qualityValue.textContent = qualityInput.value;
});

// Cargar imagen seleccionada
imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  originalSize = file.size; // tamaño original en bytes

  const reader = new FileReader();
  reader.onload = (event) => {
    originalImage = new Image();
    originalImage.src = event.target.result;

    originalImage.onload = () => {
      preview.innerHTML = `<img src="${originalImage.src}" alt="preview">`;
      preview.appendChild(sizeInfo);
      sizeInfo.textContent = `Tamaño original: ${(originalSize / 1024).toFixed(2)} KB`;
    };
  };
  reader.readAsDataURL(file);
});

// Comprimir imagen y generar enlaces de descarga
compressBtn.addEventListener("click", () => {
  if (!originalImage) {
    alert("Primero selecciona una imagen.");
    return;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = originalImage.width;
  canvas.height = originalImage.height;

  ctx.drawImage(originalImage, 0, 0);

  const quality = parseFloat(qualityInput.value);

  // Generar versiones en distintos formatos
  const jpgData = canvas.toDataURL("image/jpeg", quality);
  const pngData = canvas.toDataURL("image/png"); // PNG no usa calidad
  const webpData = canvas.toDataURL("image/webp", quality);

  // Mostrar preview con la versión JPG
  preview.innerHTML = `<img src="${jpgData}" alt="compressed">`;
  preview.appendChild(sizeInfo);

  // Calcular tamaño comprimido en bytes
  const compressedSize = Math.round((jpgData.length * 3) / 4); // base64 → bytes

  sizeInfo.textContent = `Tamaño original: ${(originalSize / 1024).toFixed(2)} KB | Comprimido: ${(compressedSize / 1024).toFixed(2)} KB`;

  // Asignar enlaces de descarga
  downloadJPG.href = jpgData;
  downloadPNG.href = pngData;
  downloadWEBP.href = webpData;

  // Mostrar opciones de descarga
  downloadOptions.style.display = "block";
});
