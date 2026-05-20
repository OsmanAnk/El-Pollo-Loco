let intervalIDs = [];

function startGame() {
    const startScreen = document.getElementById("start-screen");
    startScreen.style.display = "none";
    initLevel1();
    init();
}

function restartGame() {
    const gameOverScreen = document.getElementById("game-over-screen");
    gameOverScreen.classList.add("d_none");
    initLevel1();
    init();
}

function setStoppableInterval(fn, time) {
    let intervalID = setInterval(fn, time);
    intervalIDs.push(intervalID);
}

function stopGame() {
    intervalIDs.forEach(clearInterval);
}

function eventBubbling(event) {
    event.stopPropagation();
}

function toggleSound() {
    const sound = document.getElementById("sound-btn");
    if (sound.src.includes("lautstarke.png")) {
        sound.src = "assets/icons/klang.png";
    }
    else {
        sound.src = "assets/icons/lautstarke.png";
    }
}

function toggleFullscreen() {
    const canvas = document.getElementById("canvas");
    if (!document.fullscreenElement) {
        canvas.innerWidth = window.innerWidth;
        canvas.innerHeight = window.innerHeight;
    } else {
        document.exitFullscreen();
        resizeCanvas(canvas);
    }
}

function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    World.draw();
}

function showControls() {
    const keybindsRef = document.getElementById("keyboard-controls-screen");
    keybindsRef.classList.remove("d_none");
}

function closeModal() {
    const keybindsRef = document.getElementById("keyboard-controls-screen");
    const imprintRef = document.getElementById("imprint-screen");
    keybindsRef.classList.add("d_none");
    imprintRef.classList.add("d_none");
}

function showImprint() {
    const imprintRef = document.getElementById("imprint-screen");
    imprintRef.classList.remove("d_none");
}