const input = document.querySelector("#audioFile");
const dropzone = document.querySelector("#dropzone");
const fileRow = document.querySelector("#fileRow");
const fileName = document.querySelector("#fileName");
const fileMeta = document.querySelector("#fileMeta");
const playerTitle = document.querySelector("#playerTitle");
const playerSubtitle = document.querySelector("#playerSubtitle");
const player = document.querySelector("#audioPlayer");
const processBtn = document.querySelector("#processBtn");
const downloadBtn = document.querySelector("#downloadBtn");
const notice = document.querySelector("#notice");
const pitch = document.querySelector("#pitch");
const pitchOutput = document.querySelector("#pitchOutput");
const speed = document.querySelector("#speed");
const speedOutput = document.querySelector("#speedOutput");
let selectedFile = null;
let objectUrl = null;

function fmtBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
function showNotice(message, isError = false) {
  notice.textContent = message;
  notice.classList.remove("hidden");
  notice.style.background = isError ? "#32171d" : "#1a2a22";
  notice.style.borderColor = isError ? "#71313c" : "#315b43";
  notice.style.color = isError ? "#fecdd3" : "#b7f7ce";
}
function chooseFile(file) {
  if (!file) return;
  if (file.size > 200 * 1024 * 1024) {
    showNotice("Ukuran file melebihi batas 200 MB.", true);
    return;
  }
  if (!file.type.startsWith("audio/") && !/\.(mp3|wav|ogg|flac|aac|m4a|webm)$/i.test(file.name)) {
    showNotice("Pilih file audio seperti MP3, WAV, OGG, atau FLAC.", true);
    return;
  }
  selectedFile = file;
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = URL.createObjectURL(file);
  player.src = objectUrl;
  player.playbackRate = Number(speed.value);
  player.preservesPitch = false;
  fileName.textContent = file.name;
  fileMeta.textContent = `${fmtBytes(file.size)} · ${file.type || "audio"}`;
  playerTitle.textContent = file.name;
  playerSubtitle.textContent = "Audio siap dipreview";
  fileRow.classList.remove("hidden");
  processBtn.disabled = false;
  downloadBtn.href = objectUrl;
  downloadBtn.download = file.name;
  downloadBtn.classList.remove("disabled");
  downloadBtn.textContent = "↓ Download audio asli";
  notice.classList.add("hidden");
  document.querySelector("#dropTitle").textContent = "File audio berhasil dipilih";
  document.querySelector("#dropSubtitle").textContent = "Pilih file lain jika ingin menggantinya";
}
input.addEventListener("change", () => chooseFile(input.files[0]));
["dragenter", "dragover"].forEach(event => dropzone.addEventListener(event, e => {
  e.preventDefault(); dropzone.classList.add("dragover");
}));
["dragleave", "drop"].forEach(event => dropzone.addEventListener(event, e => {
  e.preventDefault(); dropzone.classList.remove("dragover");
}));
dropzone.addEventListener("drop", e => chooseFile(e.dataTransfer.files[0]));
pitch.addEventListener("input", () => {
  const value = Number(pitch.value);
  pitchOutput.textContent = `${value > 0 ? "+" : ""}${value} semitone`;
  // Playback rate changes pitch as a simple preview approximation.
  // Accurate pitch shifting without changing duration needs DSP/FFmpeg processing.
  if (player.src) player.playbackRate = Number(speed.value) * Math.pow(2, value / 12);
});
speed.addEventListener("input", () => {
  speedOutput.textContent = `${Number(speed.value).toFixed(2)}×`;
  if (player.src) player.playbackRate = Number(speed.value) * Math.pow(2, Number(pitch.value) / 12);
});
document.querySelector("#removeFile").addEventListener("click", () => {
  selectedFile = null;
  player.pause(); player.removeAttribute("src"); player.load();
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = null;
  input.value = "";
  fileRow.classList.add("hidden");
  processBtn.disabled = true;
  downloadBtn.href = "#";
  downloadBtn.classList.add("disabled");
  playerTitle.textContent = "Belum ada audio dipilih";
  playerSubtitle.textContent = "Pilih file audio untuk mulai";
  document.querySelector("#dropTitle").innerHTML = 'Tarik file ke sini atau <em>pilih file</em>';
  document.querySelector("#dropSubtitle").textContent = "Maksimal 200 MB · File diproses di prototipe ini";
  notice.classList.add("hidden");
});
processBtn.addEventListener("click", async () => {
  if (!selectedFile) return;
  processBtn.disabled = true;
  processBtn.textContent = "Memeriksa file…";
  try {
    const data = new FormData();
    data.append("audio", selectedFile);
    const response = await fetch("/api/upload", { method: "POST", body: data });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Upload gagal.");
    showNotice(`${result.message} Untuk saat ini tombol download mengunduh audio asli; file hasil konversi belum dibuat.`);
  } catch (error) {
    showNotice(`Tidak dapat menghubungi backend: ${error.message}. Jalankan website melalui server Node.js.`, true);
  } finally {
    processBtn.disabled = !selectedFile;
    processBtn.textContent = "✦ Proses file";
  }
});
