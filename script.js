let intervalIDs = [];
let isGamePaused = false;
let isMuted = localStorage.getItem("isMuted") === "true";

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

/**
 * Startet eine neue Spielsitzung vom Startbildschirm aus.
 * Stoppt die Startmusik, spielt die Spielmusik ab, blendet den Startbildschirm aus,
 * zeigt die Spielsteuerung an, initialisiert die Leveldaten und wendet den aktuellen Stumm-Status an.
 */
function startGame() {
    stopStartSound();
    playGameSound();
    const startScreen = document.getElementById("start-screen");
    startScreen.style.display = "none";
    showHomeButton();
    showmobileControls();
    initLevel1();
    init();
    applyWorldMuteState();
    if (document.fullscreenElement && document.fullscreenElement.id !== "game-container") {
        enterFullscreen(document.getElementById("game-container"));
    }
}

/**
 * Startet das Spiel nach einem Game-Over neu.
 * Blendet den Endbildschirm aus, zeigt die Spielsteuerung an,
 * initialisiert Level und Spielwelt neu und startet die Spielmusik.
 */
function restartGame() {
    const gameOverScreen = document.getElementById("end-screen");
    gameOverScreen.classList.add("d_none");
    showHomeButton();
    showmobileControls();
    initLevel1();
    init();
    applyWorldMuteState();
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
        isMuted = false;
        applyWorldMuteState();
        saveMutedState();
    } else {
        gameSound.muted = true;
        startSound.muted = true;
        sound.src = "assets/icons/klang.png";
        isMuted = true;
        applyWorldMuteState()
        saveMutedState();
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
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
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
    pauseAllSounds();
}

function resumeGame() {
    isGamePaused = false;
    resumeBackgroundSound()
}

function resumeBackgroundSound() {
    if (isMuted) {
        return;
    }
    if (world) {
        playGameSound();
    } else {
        playStartSound();
    }
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

function disableMobileContextMenu() {
    if (!window.matchMedia("(pointer: coarse)").matches) {
        return;
    }
    document.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });
}

function playStartSound() {
    playAudio(startSound);
}

function stopStartSound() {
    startSound.pause();
    startSound.currentTime = 0;
}

function playGameSound() {
    playAudio(gameSound);
}

function stopGameSound() {
    gameSound.pause();
    gameSound.currentTime = 0;
}

function youLose() {
    playAudio(loseSound);
}

function youWin() {
    playAudio(winSound);
}

function pauseAllSounds() {
    gameSound.pause();
    startSound.pause();
    loseSound.pause();
    winSound.pause();

    world.coinSound.pause();
    world.bottleCollectSound.pause();
    world.bottleThrowSound.pause();
    world.bottleSplashSound.pause();
    world.endbossHurtSound.pause();
    world.chickenHurtSound.pause();
    world.chickHurtSound.pause();

    world.character.stopSnore();
}

function saveMutedState() {
    localStorage.setItem("isMuted", isMuted);
}

function loadMutedState() {
    const savedState = localStorage.getItem("isMuted");
    isMuted = savedState === "true";

    gameSound.muted = isMuted;
    startSound.muted = isMuted;
    loseSound.muted = isMuted;
    winSound.muted = isMuted;

    applyWorldMuteState();

    const sound = document.getElementById("sound-btn");

    if (isMuted) {
        sound.src = "assets/icons/klang.png";
    } else {
        sound.src = "assets/icons/lautstarke.png";
    }
}

function applyWorldMuteState() {
    if (!world) return;
    world.coinSound.muted = isMuted;
    world.bottleCollectSound.muted = isMuted;
    world.bottleThrowSound.muted = isMuted;
    world.bottleSplashSound.muted = isMuted;
    world.endbossHurtSound.muted = isMuted;
    world.chickenHurtSound.muted = isMuted;
    world.chickHurtSound.muted = isMuted;

    if (world.character) {
        world.character.snoreSound.muted = isMuted;
        world.character.hurtSound.muted = isMuted;
    }
}

function playAudio(audio) {
    let promise = audio.play();
    if (promise !== undefined) {
        promise.then(_ => { }).catch(error => { });
    }
}
