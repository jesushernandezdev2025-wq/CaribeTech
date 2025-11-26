// script.js

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     MENÚ MÓVIL SIMPLE Y FUNCIONAL
  ===================================================== */
  const mobileBtn = document.querySelector(".mobile-menu-toggle");
  const navList = document.querySelector(".nav ul");

  if (mobileBtn && navList) {
    mobileBtn.addEventListener("click", () => {
      navList.classList.toggle("nav-open");

      const expanded = mobileBtn.getAttribute("aria-expanded") === "true";
      mobileBtn.setAttribute("aria-expanded", !expanded);
    });
  }

  /* =====================================================
     FORMULARIO CONTACTO — Web3Forms
  ===================================================== */
  const form = document.getElementById("form");
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (form && submitBtn) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Campos
      const nombre = document.getElementById("nombre").value.trim();
      const email = document.getElementById("email").value.trim();
      const mensaje = document.getElementById("mensaje").value.trim();

      // Validaciones
      if (!nombre || !email || !mensaje) {
        return showMessage("Por favor completa todos los campos.", "error");
      }

      const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(email)) {
        return showMessage("Ingresa un correo electrónico válido.", "error");
      }

      // Preparación para enviar
      const formData = new FormData(form);
      formData.append("access_key", "95ee9bab-6195-4e68-b2d2-2639adf83ec0");

      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Enviando...";
      submitBtn.disabled = true;

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          showMessage("¡Mensaje enviado correctamente!", "success");
          form.reset();
        } else {
          showMessage(result.message || "Hubo un problema al enviar.", "error");
        }

      } catch (error) {
        showMessage("Error de conexión. Intenta más tarde.", "error");

      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});

/* =====================================================
   MENSAJES BONITOS
===================================================== */
function showMessage(text, type = "success") {
  const form = document.querySelector("form");
  let box = document.querySelector(".form-msg");

  if (!box) {
    box = document.createElement("div");
    box.classList.add("form-msg");
    form.after(box);
  }

  box.textContent = text;
  box.className = `form-msg ${type}`;

  setTimeout(() => box.classList.add("hide"), 3500);
  setTimeout(() => box.remove(), 4500);
}