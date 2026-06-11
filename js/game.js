let canvas;
let world;
let keyboard = new Keyboard();

/**
 * initializes the canvas and world
 */
function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
}

/**
 * handles key press input
 */
window.addEventListener("keydown", (event) => {
    if (event.code == "ArrowRight") {
        keyboard.RIGHT = true;
    }
    if (event.code == "ArrowLeft") {
        keyboard.LEFT = true;
    }
    if (event.code == "ArrowUp") {
        keyboard.UP = true;
    }
    if (event.code == "ArrowDown") {
        keyboard.DOWN = true;
    }
    if (event.code == "Space") {
        keyboard.SPACE = true;
    }
    if (event.code == "KeyD") {
        keyboard.D = true;
    }
})

/**
 * handles key release input
 */
window.addEventListener("keyup", (event) => {
    if (event.code == "ArrowRight") {
        keyboard.RIGHT = false;
    }
    if (event.code == "ArrowLeft") {
        keyboard.LEFT = false;
    }
    if (event.code == "ArrowUp") {
        keyboard.UP = false;
    }
    if (event.code == "ArrowDown") {
        keyboard.DOWN = false;
    }
    if (event.code == "Space") {
        keyboard.SPACE = false;
    }
    if (event.code == "KeyD") {
        keyboard.D = false;
    }
})
