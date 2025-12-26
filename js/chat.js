const userList = document.getElementById("user-list");
const activeTab = document.getElementById("active-tab");
const archivedTab = document.getElementById("archived-tab");
const chatHeader = document.getElementById("chat-header");
const chatMessages = document.getElementById("chat-messages");
const sendMessageBtn = document.getElementById("send-message");
const messageInput = document.getElementById("message-input");
const emojiBtn = document.getElementById("emoji-btn");
const emojiPanel = document.getElementById("emoji-panel");
const closeChatBtn = document.getElementById("close-chat");
const chatTitle = document.getElementById("chat-title");

messageInput.disabled = true;
sendMessageBtn.disabled = true;
emojiBtn.disabled = true;
let currentUser = null;
let viewMode = "active"; // active | archived

let clientId = localStorage.getItem("support_client_id");

if (!clientId) {
  clientId = "client_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
  localStorage.setItem("support_client_id", clientId);
}


/*
  users = {
    nombre: {
      mensajes: [{ texto, sender }],
      archivado: false,
      notificacion: false
    }
  }
*/
const users = {};

// ==========================
// SIMULACIÓN MENSAJE ENTRANTE
// ==========================
function recibirMensaje(nombre, texto) {
  if (!users[nombre]) {
    users[nombre] = {
      mensajes: [],
      archivado: false,
      notificacion: true
    };
  }

  // 🔥 AUTO-DESARCHIVAR SI LLEGA MENSAJE
  if (users[nombre].archivado) {
    users[nombre].archivado = false;
    viewMode = "active";

    activeTab.classList.add("active-tab");
    archivedTab.classList.remove("active-tab");

    closeChat();
  }

  users[nombre].mensajes.push({ texto, sender: "user" });

  if (currentUser === nombre) {
    addMessage(texto, "user");
    users[nombre].notificacion = false;
  } else {
    users[nombre].notificacion = true;
  }

  renderUserList();
}

// ==========================
// RENDER LISTAS
// ==========================
function renderUserList() {
  userList.innerHTML = "";

  Object.keys(users).forEach(nombre => {
    const user = users[nombre];

    // Filtrar según modo
    if (viewMode === "active" && users[nombre].archivado) return;
    if (viewMode === "archived" && !users[nombre].archivado) return;

    const div = document.createElement("div");
    div.className = "user-item";
    div.textContent = nombre;

    if (user.notificacion && viewMode === "active") {
      const notif = document.createElement("span");
      notif.className = "notification";
      notif.textContent = "Nuevo";
      div.appendChild(notif);
    }

    const archiveBtn = document.createElement("span");
    archiveBtn.className = "archive-btn";
    archiveBtn.textContent =
      user.archivado ? "Desarchivar" : "Archivar";

    archiveBtn.onclick = e => {
      e.stopPropagation();
      user.archivado = !user.archivado;

      // 🔥 si archivó el chat actual, se cierra
      if (currentUser === nombre) closeChat();

      renderUserList();
    };

    div.appendChild(archiveBtn);
    div.onclick = () => openChat(nombre);

    userList.appendChild(div);
  });
}

// ==========================
// ABRIR CHAT
// ==========================
function openChat(nombre) {
  currentUser = nombre;

  chatTitle.textContent = `Chat con ${nombre}`;
  chatMessages.innerHTML = "";

  messageInput.disabled = false;
  sendMessageBtn.disabled = false;
  emojiBtn.disabled = false;
  closeChatBtn.style.display = "block";

  users[nombre].mensajes.forEach(m =>
    addMessage(m.texto, m.sender)
  );

  users[nombre].notificacion = false;
  renderUserList();
}

// ==========================
// MENSAJES
// ==========================
sendMessageBtn.onclick = sendMessage;

messageInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text || !currentUser) return;

  users[currentUser].mensajes.push({
    texto: text,
    sender: "support"
  });

  addMessage(text, "support");

  // 🔥 RESPUESTA AL USUARIO
window.postMessage({
  channel: "caribetech-support-reply",
  nombre: currentUser,
  texto: text
}, "*");

  messageInput.value = "";
}

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerHTML = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ==========================
// EMOJIS / GIFS (SOLUCIÓN FINAL)
// ==========================
emojiBtn.onclick = () => {
  if (!currentUser) return; // 🔒 sin chat, no emojis
  emojiPanel.classList.toggle("active");
};

document.addEventListener("click", e => {
  if (
    !emojiPanel.contains(e.target) &&
    !emojiBtn.contains(e.target)
  ) {
    emojiPanel.classList.remove("active");
  }
});

document.querySelectorAll(".emoji-item").forEach(item => {
  item.onclick = () => {
    if (!currentUser) return;

    let emoji = "";

    // ✅ Si es Unicode
    if (item.textContent.trim()) {
      emoji = item.textContent.trim();
    }
    // ✅ Si es imagen (img)
    else if (item.tagName === "IMG") {
      emoji = item.outerHTML;
    }

    if (!emoji) return;

    const currentText = messageInput.value.trim();

    if (currentText.length > 0) {
      messageInput.value += " " + emoji;
      messageInput.focus();
    } else {
      users[currentUser].mensajes.push({
        texto: emoji,
        sender: "support"
      });

      addMessage(emoji, "support");
    }

    emojiPanel.classList.remove("active");
  };
});

// ==========================
// ARCHIVAR / DESARCHIVAR LISTAS
// ==========================
activeTab.onclick = () => {
  viewMode = "active";
  activeTab.classList.add("active-tab");
  archivedTab.classList.remove("active-tab");

  closeChat();
  renderUserList();
};

archivedTab.onclick = () => {
  viewMode = "archived";
  archivedTab.classList.add("active-tab");
  activeTab.classList.remove("active-tab");

  closeChat();
  renderUserList();
};

// ==========================
// DEMO
// ==========================
setTimeout(() => recibirMensaje("Juan Pérez", "Hola, necesito ayuda"), 1000);
setTimeout(() => recibirMensaje("Ana Gómez", "Mi web no carga 😥"), 2000);

chatMessages.innerHTML = `
  <div style="
    text-align:center;
    color:#777;
    margin-top:40px;
    font-size:14px;
  ">
    Selecciona un usuario para iniciar el chat
  </div>
`;

function closeChat() {
  currentUser = null;

  chatTitle.textContent = "Selecciona un usuario";
  chatMessages.innerHTML = `
    <div style="
      text-align:center;
      color:#777;
      margin-top:40px;
      font-size:14px;
    ">
      Selecciona un usuario para iniciar el chat
    </div>
  `;

  messageInput.value = "";
  messageInput.disabled = true;
  sendMessageBtn.disabled = true;
  emojiBtn.disabled = true;

  emojiPanel.classList.remove("active");
  closeChatBtn.style.display = "none";
}

/* 🔥 ESTA LÍNEA FALTABA */
closeChatBtn.onclick = closeChat;

activeTab.classList.add("active-tab");
renderUserList();

// ==========================
// CONEXIÓN CHAT WEB → DASHBOARD
// ==========================
window.addEventListener("message", (e) => {
  const data = e.data;

  if (!data || data.channel !== "caribetech-support-reply") return;

  const nombreLocal = localStorage.getItem("support_client_name");

  if (!nombreLocal) return;
  if (data.nombre !== nombreLocal) return; // 🔥 filtro clave

  addMessage(data.texto, "support");
});
