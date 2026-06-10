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
 * erlaubt dem Browser nach der ersten Nutzerinteraktion das Abspielen von Audio
 */
function unlockAudioAfterFirstClick() {
    if (!isMuted) {
        resumeBackgroundSound();
    }
}

/**
 * startet eine neue Spielsitzung
 * stoppt die Startmusik, spielt die Spielmusik ab, blendet den Startbildschirm aus,
 * zeigt die Spielsteuerung an, initialisiert die Leveldaten und wendet den aktuellen Stumm-Status an
 */
function startGame() {
    activeBackgroundSound = "game";
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
 * startet das Spiel nach einem Game-Over neu
 * blendet den Endbildschirm aus, zeigt die Spielsteuerung an,
 * initialisiert Level und Spielwelt neu und startet die Spielmusik
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
 * erstellt ein pausierbares Intervall und speichert dessen ID
 * die übergebene Funktion wird nur ausgeführt, wenn das Spiel nicht pausiert ist
 *
 * @param {Function} fn - funktion, die im Intervall ausgeführt werden soll
 * @param {number} time - zeitabstand des Intervalls in Millisekunden
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
 * stoppt alle gespeicherten Spiel-Intervalle
 * leert danach die Liste der Intervall-IDs
 */
function stopGame() {
    intervalIDs.forEach(clearInterval);
    intervalIDs = [];
}

/**
 * verhindert, dass ein Event an übergeordnete Elemente weitergegeben wird
 *
 * @param {Event} event - event, dessen Weitergabe gestoppt werden soll
 */
function eventBubbling(event) {
    event.stopPropagation();
}

/**
 * schaltet den Spielsound ein oder aus
 * aktualisiert das Sound-Icon, den Stumm-Status der Welt und speichert die Einstellung
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
 * schaltet den Spielsound ein und aktualisiert Icon, Weltstatus und Speicher
 *
 * @param {HTMLImageElement} sound - sound-Icon, das aktualisiert werden soll
 */
function unmuteSound(sound) {
    gameSound.muted = false;
    startSound.muted = false;
    sound.src = "assets/icons/lautstarke.png";
    isMuted = false;
    applyWorldMuteState();
    saveMutedState();
    if (!isGamePaused) {
        resumeBackgroundSound();
    }
}

/**
 * schaltet den Spielsound aus und aktualisiert Icon, Weltstatus und Speicher
 *
 * @param {HTMLImageElement} sound - sound-Icon, das aktualisiert werden soll
 */
function muteSound(sound) {
    gameSound.muted = true;
    startSound.muted = true;
    sound.src = "assets/icons/klang.png";
    isMuted = true;
    applyWorldMuteState();
    saveMutedState();
}

/**
 * schaltet den Vollbildmodus für ein Element ein oder aus
 * wenn keine Element-ID übergeben wird, wird der Spielcontainer verwendet
 *
 * @param {string} [elementId] - id des Elements für den Vollbildmodus
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
 * wechselt zwischen Vollbildmodus und normaler Ansicht
 *
 * @param {HTMLElement} fullscreen - element, das im Vollbildmodus angezeigt werden soll
 */
function toggleFullscreenMode(fullscreen) {
    if (!document.fullscreenElement) {
        enterFullscreen(fullscreen);
    } else {
        exitFullscreen();
    }
}

/**
 * aktiviert den Vollbildmodus für ein Element
 * nutzt je nach Browser die passende Vollbild-API
 *
 * @param {HTMLElement} element - element, das im Vollbildmodus angezeigt werden soll
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
 * beendet den aktuellen Vollbildmodus
 * nutzt je nach Browser die passende Vollbild-API
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

/**
 * zeigt den Bildschirm mit den Tastatursteuerungen an
 * pausiert dafür das laufende Spiel
 */
function showControls() {
    const keybindsRef = document.getElementById("keyboard-controls-screen");
    pauseGame();
    keybindsRef.classList.remove("d_none");
}

/**
 * schließt geöffnete Modale für Steuerung oder Impressum
 * setzt das Spiel danach fort
 */
function closeModal() {
    const keybindsRef = document.getElementById("keyboard-controls-screen");
    const imprintRef = document.getElementById("imprint-screen");
    keybindsRef.classList.add("d_none");
    imprintRef.classList.add("d_none");
    resumeGame();
}

/**
 * zeigt den Impressum-Bildschirm an
 */
function showImprint() {
    const imprintRef = document.getElementById("imprint-screen");
    imprintRef.classList.remove("d_none");
}

/**
 * kehrt aus dem Spiel zum Startmenü zurück
 * stoppt Spielintervalle und Spielsound, blendet Spielsteuerung aus
 * und startet wieder die Startmusik
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
 * setzt Spiel- und Soundzustand für das Startmenü zurück
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
 * pausiert das Spiel
 * setzt den Pausenstatus und pausiert alle Sounds
 */
function pauseGame() {
    isGamePaused = true;
    pauseAllSounds();
}

/**
 * setzt das Spiel fort
 * hebt den Pausenstatus auf und startet den Hintergrundsound
 */
function resumeGame() {
    isGamePaused = false;
    resumeBackgroundSound()
}

/**
 * spielt den Hintergrundsound weiter
 * startet je nach aktuellem Zustand entweder Spielmusik oder Startmusik
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
 * zeigt den Home-Button an
 */
function showHomeButton() {
    const homeButton = document.getElementById("home-btn");
    homeButton.classList.remove("d_none");
}

/**
 * blendet den Home-Button aus
 */
function hideHomeButton() {
    const homeButton = document.getElementById("home-btn");
    homeButton.classList.add("d_none");
}

/**
 * zeigt die mobile Spielsteuerung an
 */
function showmobileControls() {
    const mobileControls = document.getElementById("mobile-controls");
    mobileControls.classList.remove("d_none");
}

/**
 * blendet die mobile Spielsteuerung aus
 */
function hideMobileControls() {
    const mobileControls = document.getElementById("mobile-controls");
    mobileControls.classList.add("d_none");
}

/**
 * deaktiviert das Kontextmenü auf Geräten mit Touch-Steuerung
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
 * spielt die Startmusik ab
 */
function playStartSound() {
    if (isMuted) {
        return;
    }
    startSound.play().catch(() => {});
}

/**
 * stoppt die Startmusik und setzt sie an den Anfang zurück
 */
function stopStartSound() {
    startSound.pause();
    startSound.currentTime = 0;
}

/**
 * spielt die Spielmusik ab
 */
function playGameSound() {
    if (isMuted) {
        return;
    }
    gameSound.play().catch(() => {});
}

/**
 * stoppt die Spielmusik und setzt sie an den Anfang zurück
 */
function stopGameSound() {
    gameSound.pause();
    gameSound.currentTime = 0;
}

/**
 * spielt den Sound für eine Niederlage ab
 */
function youLose() {
    loseSound.play();
}

/**
 * spielt den Sound für einen Sieg ab
 */
function youWin() {
    winSound.play();
}

/**
 * pausiert alle globalen Sounds und alle Sounds der Spielwelt
 * stoppt zusätzlich das Schnarchen der Spielfigur
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
 * pausiert alle Sounds der Spielwelt
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
 * speichert den aktuellen Stumm-Status im lokalen Speicher
 */
function saveMutedState() {
    localStorage.setItem("isMuted", isMuted);
}

/**
 * lädt den gespeicherten Stumm-Status aus dem lokalen Speicher
 * aktualisiert alle globalen Sounds, die Spielwelt und das Sound-Icon
 */
function loadMutedState() {
    const savedState = localStorage.getItem("isMuted");
    isMuted = savedState === "true";
    applyGlobalMuteState();
    applyWorldMuteState();
    updateSoundIcon();
}

/**
 * wendet den aktuellen Stumm-Status auf die globalen Sounds an
 */
function applyGlobalMuteState() {
    gameSound.muted = isMuted;
    startSound.muted = isMuted;
    loseSound.muted = isMuted;
    winSound.muted = isMuted;
}

/**
 * aktualisiert das Sound-Icon passend zum Stumm-Status
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
 * wendet den aktuellen Stumm-Status auf alle Sounds der Spielwelt an
 * beendet die Funktion, wenn noch keine Spielwelt vorhanden ist
 */
function applyWorldMuteState() {
    if (!world) return;
    applyWorldMainMuteState();
    applyCharacterMuteState();
}

/**
 * wendet den aktuellen Stumm-Status auf die Welt-Sounds an
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
 * wendet den aktuellen Stumm-Status auf die Spielfigur-Sounds an
 */
function applyCharacterMuteState() {
    if (world.character) {
        world.character.snoreSound.muted = isMuted;
        world.character.hurtSound.muted = isMuted;
        world.character.jumpSound.muted = isMuted;
    }
}
