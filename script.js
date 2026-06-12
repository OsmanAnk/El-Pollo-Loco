let intervalIDs = [];
let isGamePaused = false;

/**
 * starts a new game session
 */
function startGame() {
    prepareGameSession();
    hideStartScreen();
    initializeGameWorld();
    enterGameFullscreenIfNeeded();
}

/**
 * prepares controls for gameplay
 */
function prepareGameSession() {
    startGameplaySound();
    showHomeButton();
    showmobileControls();
}

/**
 * hides the start screen
 */
function hideStartScreen() {
    const startScreen = document.getElementById("start-screen");
    startScreen.style.display = "none";
}

/**
 * initializes level and world data
 */
function initializeGameWorld() {
    initLevel1();
    init();
    applyWorldMuteState();
}

/**
 * enters game fullscreen when another element is fullscreen
 */
function enterGameFullscreenIfNeeded() {
    if (document.fullscreenElement && document.fullscreenElement.id !== "game-container") {
        enterFullscreen(document.getElementById("game-container"));
    }
}

/**
 * restarts the game after a game over
 */
function restartGame() {
    const gameOverScreen = document.getElementById("end-screen");
    gameOverScreen.classList.add("d_none");
    startGameplaySound();
    showHomeButton();
    showmobileControls();
    initLevel1();
    init();
    applyWorldMuteState();
}

/**
 * creates a pausable interval
 *
 * @param {Function} fn - Function to run inside the interval
 * @param {number} time - Interval delay in milliseconds
 */
function setStoppableInterval(fn, time) {
    let intervalID = setInterval(() => {
        if (!isGamePaused) {
            fn();
        }
    }, time);
    intervalIDs.push(intervalID);
}

/**
 * stops all stored game intervals
 */
function stopGame() {
    intervalIDs.forEach(clearInterval);
    intervalIDs = [];
}

/**
 * prevents an event from bubbling to parent elements
 *
 * @param {Event} event - Event whose propagation should be stopped
 */
function eventBubbling(event) {
    event.stopPropagation();
}

/**
 * toggles fullscreen mode
 *
 * @param {string} [elementId] - Element ID for fullscreen mode
 */
function toggleFullscreen(elementId) {
    if (elementId === undefined) {
        elementId = "game-container";
    }
    const fullscreen = document.getElementById(elementId);
    if (!fullscreen) {
        return;
    }
    toggleFullscreenMode(fullscreen);
}

/**
 * switches between fullscreen mode and the normal view
 *
 * @param {HTMLElement} fullscreen - Element to show in fullscreen mode
 */
function toggleFullscreenMode(fullscreen) {
    if (!document.fullscreenElement) {
        enterFullscreen(fullscreen);
    } else {
        exitFullscreen();
    }
}

/**
 * enables fullscreen mode for an element
 *
 * @param {HTMLElement} element - Element to show in fullscreen mode
 */
function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

/**
 * exits fullscreen mode
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

/**
 * shows the keyboard controls screen
 */
function showControls() {
    const keybindsRef = document.getElementById("keyboard-controls-screen");
    pauseGame();
    keybindsRef.classList.remove("d_none");
}

/**
 * closes open control or imprint modals
 */
function closeModal() {
    const keybindsRef = document.getElementById("keyboard-controls-screen");
    const imprintRef = document.getElementById("imprint-screen");
    keybindsRef.classList.add("d_none");
    imprintRef.classList.add("d_none");
    resumeGame();
}

/**
 * shows the imprint screen
 */
function showImprint() {
    const imprintRef = document.getElementById("imprint-screen");
    imprintRef.classList.remove("d_none");
}

/**
 * returns to the start menu
 */
function goToStartMenu() {
    const startScreen = document.getElementById("start-screen");
    const gameOverScreen = document.getElementById("end-screen");
    resetSoundForStartMenu();
    hideHomeButton();
    hideMobileControls();
    gameOverScreen.classList.add("d_none");
    startScreen.style.display = "flex";
}

/**
 * pauses the game
 */
function pauseGame() {
    isGamePaused = true;
    pauseAllSounds();
}

/**
 * resumes the game
 */
function resumeGame() {
    isGamePaused = false;
    resumeBackgroundSound();
}

/**
 * shows the home button
 */
function showHomeButton() {
    const homeButton = document.getElementById("home-btn");
    homeButton.classList.remove("d_none");
}

/**
 * hides the home button
 */
function hideHomeButton() {
    const homeButton = document.getElementById("home-btn");
    homeButton.classList.add("d_none");
}

/**
 * shows the mobile game controls
 */
function showmobileControls() {
    const mobileControls = document.getElementById("mobile-controls");
    mobileControls.classList.remove("d_none");
}

/**
 * hides the mobile game controls
 */
function hideMobileControls() {
    const mobileControls = document.getElementById("mobile-controls");
    mobileControls.classList.add("d_none");
}

/**
 * disables the context menu on touch devices
 */
function disableMobileContextMenu() {
    if (!window.matchMedia("(pointer: coarse)").matches) {
        return;
    }
    document.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });
}

