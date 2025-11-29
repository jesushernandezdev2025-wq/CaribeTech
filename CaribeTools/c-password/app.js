const passOutput = document.getElementById("passwordOutput");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const lengthInput = document.getElementById("length");
const lenValue = document.getElementById("lenValue");

const lowerEl = document.getElementById("lower");
const upperEl = document.getElementById("upper");
const numbersEl = document.getElementById("numbers");
const symbolsEl = document.getElementById("symbols");

// Actualizar valor visible de longitud
lengthInput.addEventListener("input", () => {
  lenValue.textContent = lengthInput.value;
});

// Set de caracteres (sin ambiguos por defecto: O/0, l/1, etc.)
const LOWER = "abcdefghijkmnopqrstuvwxyz"; // sin 'l'
const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";  // sin 'O'
const NUM   = "23456789";                  // sin 0 y 1
const SYM   = "!@#$%^&*()_+-=[]{};:,.<>?";

// Utilidad: número aleatorio críptico cuando esté disponible
function getRandInt(max) {
  if (window.crypto && crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
  }
  return Math.floor(Math.random() * max);
}

// Elegir un carácter aleatorio de un conjunto
function pick(set) {
  return set[getRandInt(set.length)];
}

// Mezclar (Fisher–Yates)
function shuffle(str) {
  const arr = str.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = getRandInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

// Generar contraseña garantizando inclusión mínima
function generatePassword() {
  const length = parseInt(lengthInput.value, 10);

  const sets = [];
  if (lowerEl.checked) sets.push(LOWER);
  if (upperEl.checked) sets.push(UPPER);
  if (numbersEl.checked) sets.push(NUM);
  if (symbolsEl.checked) sets.push(SYM);

  if (sets.length === 0) {
    toast("Selecciona al menos una opción.");
    return "";
  }

  // Construir pool combinado
  const pool = sets.join("");

  // Asegurar al menos 1 de cada tipo
  let pwd = sets.map(set => pick(set)).join("");

  // Completar hasta la longitud requerida
  while (pwd.length < length) {
    pwd += pick(pool);
  }

  // Mezclar para evitar que los primeros siempre sean garantizados
  pwd = shuffle(pwd);

  // Recortar si la longitud garantizada excede (solo ocurre si length < sets.length)
  if (pwd.length > length) {
    pwd = pwd.slice(0, length);
  }

  return pwd;
}

// Copiar al portapapeles con feedback sutil
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      toast("Contraseña copiada 📋");
    } else {
      // Fallback
      const temp = document.createElement("textarea");
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
      toast("Contraseña copiada 📋");
    }
  } catch {
    toast("No se pudo copiar. Copia manualmente.");
  }
}

// Mini toast (no intrusivo)
function toast(msg) {
  let el = document.getElementById("ct-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "ct-toast";
    el.style.position = "fixed";
    el.style.bottom = "20px";
    el.style.left = "50%";
    el.style.transform = "translateX(-50%)";
    el.style.background = "rgba(112,214,255,0.2)";
    el.style.border = "1px solid rgba(112,214,255,0.5)";
    el.style.color = "#e0e6ed";
    el.style.padding = "10px 16px";
    el.style.borderRadius = "8px";
    el.style.fontSize = "14px";
    el.style.backdropFilter = "blur(6px)";
    el.style.boxShadow = "0 6px 16px rgba(0,0,0,0.35)";
    el.style.zIndex = "9999";
    el.style.transition = "opacity 0.3s ease";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = "1";
  setTimeout(() => { el.style.opacity = "0"; }, 1800);
}

// Eventos
generateBtn.addEventListener("click", () => {
  const pwd = generatePassword();
  passOutput.value = pwd;
});

copyBtn.addEventListener("click", () => {
  const val = passOutput.value.trim();
  if (!val) {
    toast("Genera una contraseña primero.");
    return;
  }
  copyToClipboard(val);
});
