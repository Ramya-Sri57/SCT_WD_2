// ===== VARIABLES =====
let startTime = 0;
let elapsedTime = 0;
let timer = null;
let isRunning = false;
let lapCount = 0;

// DOM elements
const display = document.getElementById("display");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn   = document.getElementById("lapBtn");
const lapsDiv  = document.getElementById("laps");

// ===== FORMAT TIME =====
function formatTime(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor((ms % 3600000) / 60000);
    let s = Math.floor((ms % 60000) / 1000);
    let msPart = ms % 1000;

    return `${String(h).padStart(2,'0')}:` +
           `${String(m).padStart(2,'0')}:` +
           `${String(s).padStart(2,'0')}:` +
           `${String(msPart).padStart(3,'0')}`;
}

// ===== UPDATE DISPLAY =====
function updateTime() {
    elapsedTime = Date.now() - startTime;
    display.innerText = formatTime(elapsedTime);
}

// ===== START =====
startBtn.onclick = () => {
    if (isRunning) return;

    isRunning = true;
    startTime = Date.now() - elapsedTime;

    timer = setInterval(updateTime, 10);

    display.classList.add("running");
    display.classList.remove("paused");

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    lapBtn.disabled = false;
};

// ===== PAUSE =====
pauseBtn.onclick = () => {
    isRunning = false;
    clearInterval(timer);

    display.classList.remove("running");
    display.classList.add("paused");

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    lapBtn.disabled = true;
};

// ===== RESET =====
resetBtn.onclick = () => {
    isRunning = false;
    clearInterval(timer);

    elapsedTime = 0;
    lapCount = 0;

    display.innerText = formatTime(0);
    lapsDiv.innerHTML = "";

    display.classList.remove("running","paused");

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    lapBtn.disabled = true;

    localStorage.removeItem("laps");
};

// ===== LAP =====
lapBtn.onclick = () => {
    if (!isRunning) return;

    lapCount++;
    const lapTime = formatTime(elapsedTime);

    const div = document.createElement("div");
    div.innerText = `Lap ${lapCount} - ${lapTime}`;

    lapsDiv.prepend(div);

    saveLap(div.innerText);
};

// ===== SAVE LAPS =====
function saveLap(text) {
    let laps = JSON.parse(localStorage.getItem("laps") || "[]");
    laps.unshift(text);
    localStorage.setItem("laps", JSON.stringify(laps));
}

// ===== LOAD LAPS =====
function loadLaps() {
    let laps = JSON.parse(localStorage.getItem("laps") || "[]");

    laps.forEach(l => {
        const div = document.createElement("div");
        div.innerText = l;
        lapsDiv.appendChild(div);
        lapCount++;
    });
}

// ===== KEYBOARD SHORTCUT =====
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        isRunning ? pauseBtn.click() : startBtn.click();
    }
});

// Initialize
loadLaps();
display.innerText = formatTime(0);
