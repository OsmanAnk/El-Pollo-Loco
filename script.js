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
 * Startet eine neue Spielsitzung
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

/**
 * Erstellt ein pausierbares Intervall und speichert dessen ID.
 * Die übergebene Funktion wird nur ausgeführt, wenn das Spiel nicht pausiert ist.
 *
 * @param {Function} fn - Funktion, die im Intervall ausgeführt werden soll.
 * @param {number} time - Zeitabstand des Intervalls in Millisekunden.
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
 * Stoppt alle gespeicherten Spiel-Intervalle.
 * Leert danach die Liste der Intervall-IDs.
 */
function stopGame() {
    intervalIDs.forEach(clearInterval);
    intervalIDs = [];
}

/**
 * Verhindert, dass ein Event an übergeordnete Elemente weitergegeben wird.
 *
 * @param {Event} event - Event, dessen Weitergabe gestoppt werden soll.
 */
function eventBubbling(event) {
    event.stopPropagation();
}

/**
 * Schaltet den Spielsound ein oder aus.
 * Aktualisiert das Sound-Icon, den Stumm-Status der Welt und speichert die Einstellung.
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
 * Schaltet den Spielsound ein und aktualisiert Icon, Weltstatus und Speicher.
 *
 * @param {HTMLImageElement} sound - Sound-Icon, das aktualisiert werden soll.
 */
function unmuteSound(sound) {
    gameSound.muted = false;
    startSound.muted = false;
    sound.src = "assets/icons/lautstarke.png";
    isMuted = false;
    applyWorldMuteState();
    saveMutedState();
}

/**
 * Schaltet den Spielsound aus und aktualisiert Icon, Weltstatus und Speicher.
 *
 * @param {HTMLImageElement} sound - Sound-Icon, das aktualisiert werden soll.
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
 * Schaltet den Vollbildmodus für ein Element ein oder aus.
 * Wenn keine Element-ID übergeben wird, wird der Spielcontainer verwendet.
 *
 * @param {string} [elementId] - ID des Elements für den Vollbildmodus.
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
 * Wechselt zwischen Vollbildmodus und normaler Ansicht.
 *
 * @param {HTMLElement} fullscreen - Element, das im Vollbildmodus angezeigt werden soll.
 */
function toggleFullscreenMode(fullscreen) {
    if (!document.fullscreenElement) {
        enterFullscreen(fullscreen);
    } else {
        exitFullscreen();
    }
}

/**
 * Aktiviert den Vollbildmodus für ein Element.
 * Nutzt je nach Browser die passende Vollbild-API.
 *
 * @param {HTMLElement} element - Element, das im Vollbildmodus angezeigt werden soll.
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
 * Beendet den aktuellen Vollbildmodus.
 * Nutzt je nach Browser die passende Vollbild-API.
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

/**
 * Zeigt den Bildschirm mit den Tastatursteuerungen an.
 * Pausiert dafür das laufende Spiel.
 */
function showControls() {
    const keybindsRef = document.getElementById("keyboard-controls-screen");
    pauseGame();
    keybindsRef.classList.remove("d_none");
}

/**
 * Schließt geöffnete Modale für Steuerung oder Impressum.
 * Setzt das Spiel danach fort.
 */
function closeModal() {
    const keybindsRef = document.getElementById("keyboard-controls-screen");
    const imprintRef = document.getElementById("imprint-screen");
    keybindsRef.classList.add("d_none");
    imprintRef.classList.add("d_none");
    resumeGame();
}

/**
 * Zeigt den Impressum-Bildschirm an.
 */
function showImprint() {
    const imprintRef = document.getElementById("imprint-screen");
    imprintRef.classList.remove("d_none");
}

/**
 * Kehrt aus dem Spiel zum Startmenü zurück.
 * Stoppt Spielintervalle und Spielsound, blendet Spielsteuerung aus
 * und startet wieder die Startmusik.
 */
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

/**
 * Pausiert das Spiel.
 * Setzt den Pausenstatus und pausiert alle Sounds.
 */
function pauseGame() {
    isGamePaused = true;
    pauseAllSounds();
}

/**
 * Setzt das Spiel fort.
 * Hebt den Pausenstatus auf und startet den Hintergrundsound.
 */
function resumeGame() {
    isGamePaused = false;
    resumeBackgroundSound()
}

/**
 * Spielt den Hintergrundsound weiter.
 * Startet je nach aktuellem Zustand entweder Spielmusik oder Startmusik.
 */
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

/**
 * Zeigt den Home-Button an.
 */
function showHomeButton() {
    const homeButton = document.getElementById("home-btn");
    homeButton.classList.remove("d_none");
}

/**
 * Blendet den Home-Button aus.
 */
function hideHomeButton() {
    const homeButton = document.getElementById("home-btn");
    homeButton.classList.add("d_none");
}

/**
 * Zeigt die mobile Spielsteuerung an.
 */
function showmobileControls() {
    const mobileControls = document.getElementById("mobile-controls");
    mobileControls.classList.remove("d_none");
}

/**
 * Blendet die mobile Spielsteuerung aus.
 */
function hideMobileControls() {
    const mobileControls = document.getElementById("mobile-controls");
    mobileControls.classList.add("d_none");
}

/**
 * Deaktiviert das Kontextmenü auf Geräten mit Touch-Steuerung.
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
 * Spielt die Startmusik ab.
 */
function playStartSound() {
    playAudio(startSound);
}

/**
 * Stoppt die Startmusik und setzt sie an den Anfang zurück.
 */
function stopStartSound() {
    startSound.pause();
    startSound.currentTime = 0;
}

/**
 * Spielt die Spielmusik ab.
 */
function playGameSound() {
    playAudio(gameSound);
}

/**
 * Stoppt die Spielmusik und setzt sie an den Anfang zurück.
 */
function stopGameSound() {
    gameSound.pause();
    gameSound.currentTime = 0;
}

/**
 * Spielt den Sound für eine Niederlage ab.
 */
function youLose() {
    playAudio(loseSound);
}

/**
 * Spielt den Sound für einen Sieg ab.
 */
function youWin() {
    playAudio(winSound);
}

/**
 * Pausiert alle globalen Sounds und alle Sounds der Spielwelt.
 * Stoppt zusätzlich das Schnarchen der Spielfigur.
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
 * Pausiert alle Sounds der Spielwelt.
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
 * Speichert den aktuellen Stumm-Status im lokalen Speicher.
 */
function saveMutedState() {
    localStorage.setItem("isMuted", isMuted);
}

/**
 * Lädt den gespeicherten Stumm-Status aus dem lokalen Speicher.
 * Aktualisiert alle globalen Sounds, die Spielwelt und das Sound-Icon.
 */
function loadMutedState() {
    const savedState = localStorage.getItem("isMuted");
    isMuted = savedState === "true";
    applyGlobalMuteState();
    applyWorldMuteState();
    updateSoundIcon();
}

/**
 * Wendet den aktuellen Stumm-Status auf die globalen Sounds an.
 */
function applyGlobalMuteState() {
    gameSound.muted = isMuted;
    startSound.muted = isMuted;
    loseSound.muted = isMuted;
    winSound.muted = isMuted;
}

/**
 * Aktualisiert das Sound-Icon passend zum Stumm-Status.
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
 * Wendet den aktuellen Stumm-Status auf alle Sounds der Spielwelt an.
 * Beendet die Funktion, wenn noch keine Spielwelt vorhanden ist.
 */
function applyWorldMuteState() {
    if (!world) return;
    applyWorldMainMuteState();
    applyCharacterMuteState();
}

/**
 * Wendet den aktuellen Stumm-Status auf die Welt-Sounds an.
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
 * Wendet den aktuellen Stumm-Status auf die Spielfigur-Sounds an.
 */
function applyCharacterMuteState() {
    if (world.character) {
        world.character.snoreSound.muted = isMuted;
        world.character.hurtSound.muted = isMuted;
        world.character.jumpSound.muted = isMuted;
    }
}

/**
 * Spielt eine Audiodatei ab.
 * Fängt Browser-Fehler beim automatischen Abspielen ab.
 *
 * @param {HTMLAudioElement} audio - Audioelement, das abgespielt werden soll.
 */
function playAudio(audio) {
    let promise = audio.play();
    if (promise !== undefined) {
        promise.then(_ => { }).catch(error => { });
    }
}
