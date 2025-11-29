const btn = document.getElementById("btnDownload");
const input = document.getElementById("videoUrl");
const loading = document.getElementById("loading");
const results = document.getElementById("result");
const videoTitle = document.getElementById("videoTitle");
const videoList = document.getElementById("videoList");
const audioList = document.getElementById("audioList");

btn.addEventListener("click", async () => {
  let url = input.value.trim();

  if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
    alert("Por favor ingresa un enlace válido de YouTube.");
    return;
  }

  // Extraer ID del video
  const videoID = extractVideoID(url);
  if (!videoID) {
    alert("No se pudo obtener el ID del video.");
    return;
  }

  loading.classList.remove("hidden");
  results.classList.add("hidden");

  try {
    const api = `https://piped.video/api/v1/videos/${videoID}`;
    const res = await fetch(api);
    const data = await res.json();

    console.log(data);

    // Mostrar título
    if (videoTitle) videoTitle.textContent = data.title || "Video sin título";

    // Limpiar listas anteriores
    videoList.innerHTML = "";
    audioList.innerHTML = "";

    // Mostrar videos MP4
    if (data.streams && data.streams.length > 0) {
      data.streams.forEach(stream => {
        if (stream.url && stream.quality) {
          let a = document.createElement("a");
          a.href = stream.url;
          a.target = "_blank";
          a.textContent = `${stream.quality} (${stream.format})`;
          a.classList.add("download-btn");
          videoList.appendChild(a);
        }
      });
    } else {
      videoList.innerHTML = "<p>No hay streams de video disponibles.</p>";
    }

    // Mostrar audios
    if (data.audioStreams && data.audioStreams.length > 0) {
      data.audioStreams.forEach(audio => {
        if (audio.url) {
          let a = document.createElement("a");
          a.href = audio.url;
          a.target = "_blank";
          a.textContent = `${audio.format.toUpperCase()} - ${audio.bitrate} kbps`;
          a.classList.add("download-btn");
          audioList.appendChild(a);
        }
      });
    } else {
      audioList.innerHTML = "<p>No hay streams de audio disponibles.</p>";
    }

    results.classList.remove("hidden");

  } catch (err) {
    alert("Error al obtener datos del video.");
    console.error(err);
  }

  loading.classList.add("hidden");
});


// EXTRAER ID DEL VIDEO
function extractVideoID(url) {
  try {
    // Links normales
    if (url.includes("v=")) {
      return url.split("v=")[1].split("&")[0];
    }

    // Links cortos
    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1].split("?")[0];
    }

    return null;

  } catch {
    return null;
  }
}
