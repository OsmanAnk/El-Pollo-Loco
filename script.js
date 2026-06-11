let intervalIDs = [];
let isGamePaused = false;
let isMuted = localStorage.getItem("isMuted") === "true";
let activeBackgroundSound = "start";

startSound = new Audio("audio/start_sound.mp3");
startSound.loop = true;
startSound.volume = 0.03;

gameSound = new Audio("audio/ingame_sound.mp3");
gameSound.loop = true;
gameSound.volume = 0.01;

loseSound = new Audio("audio/lose_sound.mp3");
loseSound.volume = 0.05;

winSound = new Audio("audio/win_sound.mp3");
winSound.volume = 0.1;

document.addEventListener("click", unlockAudioAfterFirstClick, { once: true });

/**
 * allows the browser to play audio after the first user interaction
 */
function unlockAudioAfterFirstClick() {
    if (!isMuted) {
        resumeBackgroundSound();
    }
}

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
 * prepares music and controls for gameplay
 */
function prepareGameSession() {
    activeBackgroundSound = "game";
    stopStartSound();
    playGameSound();
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
    activeBackgroundSound = "game";
    const gameOverScreen = document.getElementById("end-screen");
    gameOverScreen.classList.add("d_none");
    showHomeButton();
    showmobileControls();
    initLevel1();
    init();
    applyWorldMuteState();
    playGameSound();
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
 * toggles the game sound
 */
function toggleSound() {
    const sound = document.getElementById("sound-btn");
    if (gameSound.muted) {
        unmuteSound(sound);
    } else {
        muteSound(sound);
    }
}

/**
 * turns the game sound on
 *
 * @param {HTMLImageElement} sound - Sound icon to update
 */
function unmuteSound(sound) {
    isMuted = false;
    applyGlobalMuteState();
    updateSoundIcon();
    applyWorldMuteState();
    saveMutedState();
    if (!isGamePaused) {
        resumeBackgroundSound();
    }
}

/**
 * turns the game sound off
 *
 * @param {HTMLImageElement} sound - Sound icon to update
 */
function muteSound(sound) {
    isMuted = true;
    applyGlobalMuteState();
    updateSoundIcon();
    applyWorldMuteState();
    saveMutedState();
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
    resetGameToStartMenuSound();
    hideHomeButton();
    hideMobileControls();
    gameOverScreen.classList.add("d_none");
    startScreen.style.display = "flex";
}

/**
 * resets the game state for the start menu
 */
function resetGameToStartMenuSound() {
    activeBackgroundSound = "start";
    stopGame();
    isGamePaused = false;
    stopGameSound();
    playStartSound();
    if (world && world.character) {
        world.character.stopSnore();
    }
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
    resumeBackgroundSound()
}

/**
 * resumes the background sound
 */
function resumeBackgroundSound() {
    if (isMuted) {
        return;
    }
    if (activeBackgroundSound === "game") {
        playGameSound();
    } else if (activeBackgroundSound === "start") {
        playStartSound();
    }
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

/**
 * plays the start music
 */
function playStartSound() {
    if (isMuted) {
        return;
    }
    startSound.play().catch(() => {});
}

/**
 * stops the start music and resets it to the beginning
 */
function stopStartSound() {
    startSound.pause();
    startSound.currentTime = 0;
}

/**
 * plays the game music
 */
function playGameSound() {
    if (isMuted) {
        return;
    }
    gameSound.play().catch(() => {});
}

/**
 * stops the game music and resets it to the beginning
 */
function stopGameSound() {
    gameSound.pause();
    gameSound.currentTime = 0;
}

/**
 * plays the defeat sound
 */
function youLose() {
    loseSound.play();
}

/**
 * plays the victory sound
 */
function youWin() {
    winSound.play();
}

/**
 * pauses all global and world sounds
 */
function pauseAllSounds() {
    gameSound.pause();
    startSound.pause();
    loseSound.pause();
    winSound.pause();
    pauseWorldSounds();
    world.character.stopSnore();
}

/**
 * pauses all sounds from the game world
 */
function pauseWorldSounds() {
    world.coinSound.pause();
    world.bottleCollectSound.pause();
    world.bottleThrowSound.pause();
    world.bottleSplashSound.pause();
    world.endbossHurtSound.pause();
    world.chickenHurtSound.pause();
    world.chickHurtSound.pause();
}

/**
 * stores the current mute state in local storage
 */
function saveMutedState() {
    localStorage.setItem("isMuted", isMuted);
}

/**
 * loads the stored mute state
 */
function loadMutedState() {
    const savedState = localStorage.getItem("isMuted");
    isMuted = savedState === "true";
    applyGlobalMuteState();
    applyWorldMuteState();
    updateSoundIcon();
}

/**
 * applies the current mute state to the global sounds
 */
function applyGlobalMuteState() {
    gameSound.muted = isMuted;
    startSound.muted = isMuted;
    loseSound.muted = isMuted;
    winSound.muted = isMuted;
}

/**
 * updates the sound icon to match the mute state
 */
function updateSoundIcon() {
    const sound = document.getElementById("sound-btn");
    if (isMuted) {
        sound.src = "assets/icons/klang.png";
    } else {
        sound.src = "assets/icons/lautstarke.png";
    }
}

/**
 * applies the current mute state to world sounds
 */
function applyWorldMuteState() {
    if (!world) return;
    applyWorldMainMuteState();
    applyCharacterMuteState();
}

/**
 * applies the current mute state to the world sounds
 */
function applyWorldMainMuteState() {
    world.coinSound.muted = isMuted;
    world.bottleCollectSound.muted = isMuted;
    world.bottleThrowSound.muted = isMuted;
    world.bottleSplashSound.muted = isMuted;
    world.endbossHurtSound.muted = isMuted;
    world.chickenHurtSound.muted = isMuted;
    world.chickHurtSound.muted = isMuted;
}

/**
 * applies the current mute state to the character sounds
 */
function applyCharacterMuteState() {
    if (world.character) {
        world.character.snoreSound.muted = isMuted;
        world.character.hurtSound.muted = isMuted;
        world.character.jumpSound.muted = isMuted;
    }
}
