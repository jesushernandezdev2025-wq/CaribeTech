async function downloadTT() {
    const url = document.getElementById("tiktokUrl").value;
    const result = document.getElementById("result");

    if (!url) {
        result.innerHTML = "Pega un enlace primero.";
        return;
    }

    try {
        const res = await fetch("https://www.tikwm.com/api/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url })
        });

        const data = await res.json();

        if (!data.data) {
            result.innerHTML = "No se pudo obtener el video.";
            return;
        }

        const video = data.data.play;
        const videoMark = data.data.play_watermark;
        const audio = data.data.music;
        const cover = data.data.cover;

        result.innerHTML = `
            <h2>${data.data.title || "Video de TikTok"}</h2>
            <img src="${cover}" width="200"><br><br>

            <a href="${video}" download>⬇ Descargar Video (sin marca de agua)</a><br><br>
            <a href="${videoMark}" download>⬇ Descargar Video (con marca de agua)</a><br><br>
            <a href="${audio}" download>🎵 Descargar Audio (MP3)</a>
        `;
    } catch (e) {
        result.innerHTML = "Error al procesar el enlace.";
        console.error(e);
    }
}
