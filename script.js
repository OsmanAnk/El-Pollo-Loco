let intervalIDs = [];
let isGamePaused = false;

startSound = new Audio("audio/start_sound.mp3");
startSound.loop = true;
startSound.volume = 0.05;

gameSound = new Audio("audio/ingame_sound.mp3");
gameSound.loop = true;
gameSound.volume = 0.01;

loseSound = new Audio("audio/lose_sound.mp3");
loseSound.volume = 0.05;

winSound = new Audio("audio/win_sound.mp3");
winSound.volume = 0.1;

function startGame() {
    stopStartSound();
    playGameSound();
    const startScreen = document.getElementById("start-screen");
    startScreen.style.display = "none";
    showHomeButton();
    showmobileControls();
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
    showmobileControls();
    initLevel1();
    init();
    playGameSound();
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
    if (gameSound.muted) {
        gameSound.muted = false;
        startSound.muted = false;
        sound.src = "assets/icons/lautstarke.png";
    } else {
        gameSound.muted = true;
        startSound.muted = true;
        sound.src = "assets/icons/klang.png";
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
    hideMobileControls();
    gameOverScreen.classList.add("d_none");
    startScreen.style.display = "flex";
    playStartSound();
    stopGameSound();
    world.character.stopSnore();
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

function showmobileControls() {
    const mobileControls = document.getElementById("mobile-controls");
    mobileControls.classList.remove("d_none");
}

function hideMobileControls() {
    const mobileControls = document.getElementById("mobile-controls");
    mobileControls.classList.add("d_none");
}

function playStartSound() {
    // startSound.play();
}

function stopStartSound() {
    startSound.pause();
    startSound.currentTime = 0;
}

function playGameSound() {
    gameSound.play();
}

function stopGameSound() {
    gameSound.pause();
    gameSound.currentTime = 0;
}

function youLose() {
    loseSound.play()
}

function youWin() {
    winSound.play();
}