let intervalIDs = [];
let isGamePaused = false;

function startGame() {
    const startScreen = document.getElementById("start-screen");
    startScreen.style.display = "none";
    showHomeButton();
    initLevel1();
    init();
    if (document.fullscreenElement && document.fullscreenElement.id !== "game-container") {
        enterFullscreen(document.getElementById("game-container"));
    }
}

function restartGame() {
    const gameOverScreen = document.getElementById("end-screen");
    gameOverScreen.classList.add("d_none");
    showHomeButton();
    initLevel1();
    init();
}

function setStoppableInterval(fn, time) {
    let intervalID = setInterval(() => {
        if (!isGamePaused) {
            fn();
        }
    }, time);
    intervalIDs.push(intervalID);
}

function stopGame() {
    intervalIDs.forEach(clearInterval);
    intervalIDs = [];
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

function toggleFullscreen(elementId = "game-container") {
    const fullscreen = document.getElementById(elementId);
    if (!fullscreen) {
        return;
    }

    if (!document.fullscreenElement) {
        enterFullscreen(fullscreen);
    }
    else {
        exitFullscreen();
    }
}

function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
    console.log('enter fullscreen');
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
    console.log('exit fullscreen');
}

function showControls() {
    const keybindsRef = document.getElementById("keyboard-controls-screen");
    pauseGame();
    keybindsRef.classList.remove("d_none");
}

function closeModal() {
    const keybindsRef = document.getElementById("keyboard-controls-screen");
    const imprintRef = document.getElementById("imprint-screen");
    keybindsRef.classList.add("d_none");
    imprintRef.classList.add("d_none");
    resumeGame();
}

function showImprint() {
    const imprintRef = document.getElementById("imprint-screen");
    imprintRef.classList.remove("d_none");
}

function goToStartMenu() {
    const startScreen = document.getElementById("start-screen");
    const gameOverScreen = document.getElementById("end-screen");
    stopGame();
    resumeGame();
    hideHomeButton();
    gameOverScreen.classList.add("d_none");
    startScreen.style.display = "flex";
}

function pauseGame() {
    isGamePaused = true;
}

function resumeGame() {
    isGamePaused = false;
}

function showHomeButton() {
    const homeButton = document.getElementById("home-btn");
    homeButton.classList.remove("d_none");
}

function hideHomeButton() {
    const homeButton = document.getElementById("home-btn");
    homeButton.classList.add("d_none");
}
