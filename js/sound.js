let isMuted = localStorage.getItem("isMuted") === "true";
let activeBackgroundSound = "start";

let startSound = new Audio("audio/start_sound.mp3");
startSound.loop = true;
startSound.volume = 0.03;

let gameSound = new Audio("audio/ingame_sound.mp3");
gameSound.loop = true;
gameSound.volume = 0.01;

let loseSound = new Audio("audio/lose_sound.mp3");
loseSound.volume = 0.05;

let winSound = new Audio("audio/win_sound.mp3");
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
 * prepares the background sound for gameplay
 */
function startGameplaySound() {
    activeBackgroundSound = "game";
    stopStartSound();
    playGameSound();
}

/**
 * resets the sound state for the start menu
 */
function resetSoundForStartMenu() {
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
 * toggles the game sound
 */
function toggleSound() {
    if (gameSound.muted) {
        unmuteSound();
    } else {
        muteSound();
    }
}

/**
 * turns the game sound on
 */
function unmuteSound() {
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
 */
function muteSound() {
    isMuted = true;
    applyGlobalMuteState();
    updateSoundIcon();
    applyWorldMuteState();
    saveMutedState();
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
    if (world && world.character) {
        world.character.stopSnore();
    }
}

/**
 * pauses all sounds from the game world
 */
function pauseWorldSounds() {
    if (!world) {
        return;
    }
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
    if (!sound) {
        return;
    }
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
