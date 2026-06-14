class World {

    character = new Character();
    healthbar = new Healthbar();
    coinbar = new Coinbar();
    bottlebar = new Bottlebar();
    throwableObjects = [];
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    collisionHandler;
    lastBottleThrow = 0;
    maxBottles = 5;
    maxCoins = 5;
    bottleThrowCooldown = 500;

    coinSound = new Audio("audio/coin_collect.mp3");
    bottleCollectSound = new Audio("audio/bottle_collect.mp3");
    bottleThrowSound = new Audio("audio/bottle_throw.mp3");
    bottleSplashSound = new Audio("audio/bottle_splash.mp3");
    endbossHurtSound = new Audio("audio/boss_hurt.mp3");
    chickenHurtSound = new Audio("audio/chicken_hurt.mp3");
    chickHurtSound = new Audio("audio/chick_hurt.mp3")

    /**
     * creates the game world
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard
        this.collisionHandler = new WorldCollisionHandler(this);
        this.setWorld();
        this.draw();
        this.run();
        this.setSoundVolumes();
    }

    /**
     * sets world sound volumes
     */
    setSoundVolumes() {
        this.coinSound.volume = 0.05;
        this.bottleCollectSound.volume = 0.05;
        this.bottleThrowSound.volume = 0.05;
        this.bottleSplashSound.volume = 0.05;
        this.chickenHurtSound.volume = 0.05;
        this.chickHurtSound.volume = 0.05;
        this.endbossHurtSound.volume = 0.05;
    }

    /**
     * links world references to objects
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => enemy.world = this);
    }

    /**
     * starts world checks
     */
    run() {
        setStoppableInterval(() => {
            this.collisionHandler.checkCollisions();
            this.collisionHandler.checkCollisionsThrowableObjects();
            this.checkThrowObjects();
        }, 1000 / 1000);
    }

    /**
     * checks whether a bottle should be thrown
     */
    checkThrowObjects() {
        let now = new Date().getTime();
        if (this.canThrowBottle(now)) this.throwBottle(now);
    }

    /**
     * checks whether throwing is allowed
     */
    canThrowBottle(now) {
        return this.keyboard.SPACE && this.character.bottle >= 1 && now - this.lastBottleThrow > this.bottleThrowCooldown;
    }

    /**
     * throws a bottle
     */
    throwBottle(now) {
        this.bottleThrowSoundPlay()
        this.character.bottle -= 1;
        let bottle = this.createThrowableBottle();
        bottle.world = this;
        this.throwableObjects.push(bottle);
        this.updateBottlebar();
        this.lastBottleThrow = now;
    }

    /**
     * creates a throwable bottle
     */
    createThrowableBottle() {
        if (this.character.otherDirection) {
            return new ThrowableObject(this.character.x - 100, this.character.y + 100, this.character);
        }
        return new ThrowableObject(this.character.x + 100, this.character.y + 100, this.character);
    }

    /**
     * updates the bottle statusbar
     */
    updateBottlebar() {
        let bottlePercent = Math.min((this.character.bottle / this.maxBottles) * 100, 100);
        this.bottlebar.setPercentage(bottlePercent);
    }

    /**
     * plays the bottle throw sound
     */
    bottleThrowSoundPlay() {
        this.bottleThrowSound.pause();
        this.bottleThrowSound.currentTime = 0;
        this.bottleThrowSound.play();
    }

    /**
     * updates the coin statusbar
     */
    updateCoinbar() {
        let coinPercent = Math.min((this.character.coin / this.maxCoins) * 100, 100);
        this.coinbar.setPercentage(coinPercent);
    }

    /**
     * plays the coin sound
     */
    coinSoundPlay() {
        this.coinSound.pause();
        this.coinSound.currentTime = 0;
        this.coinSound.play().catch(() => { });
    }

    /**
     * plays the bottle collect sound
     */
    bottleCollectSoundPlay() {
        this.bottleCollectSound.pause();
        this.bottleCollectSound.currentTime = 0;
        this.bottleCollectSound.play().catch(() => { });
    }

    /**
     * plays the bottle splash sound
     */
    bottleSplashSoundPlay() {
        this.bottleSplashSound.pause();
        this.bottleSplashSound.currentTime = 0;
        this.bottleSplashSound.play();
    }

    /**
     * plays the endboss hurt sound
     */
    endbossHurtSoundPlay() {
        this.endbossHurtSound.pause();
        this.endbossHurtSound.currentTime = 0;
        this.endbossHurtSound.play();
    }

    /**
     * plays the chicken hurt sound
     */
    chickenHurtSoundPlay() {
        this.chickenHurtSound.pause();
        this.chickenHurtSound.currentTime = 0;
        this.chickenHurtSound.play();
    }

    /**
     * plays the chick hurt sound
     */
    chickHurtSoundPlay() {
        this.chickHurtSound.pause();
        this.chickHurtSound.currentTime = 0;
        this.chickHurtSound.play();
    }

    /**
     * draws the current frame
     */
    draw() {
        this.clearCanvas();
        this.ctx.translate(this.camera_x, 0);
        this.drawMovableObjects();
        this.ctx.translate(-this.camera_x, 0);
        this.drawFixedObjects();
        this.requestNextFrame();
    }

    /**
     * clears the canvas
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * draws movable world objects
     */
    drawMovableObjects() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addToMap(this.character);
    }

    /**
     * draws fixed UI objects
     */
    drawFixedObjects() {
        this.addToMap(this.healthbar);
        this.addToMap(this.coinbar);
        this.addToMap(this.bottlebar);
    }

    /**
     * requests the next animation frame
     */
    requestNextFrame() {
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * adds multiple objects to the map
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o)
        });
    }

    /**
     * adds one object to the map
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * flips an image horizontally
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * restores a flipped image
     */
    flipImageBack(mo) {
        this.ctx.restore();
        mo.x = mo.x * -1;
    }

    /**
     * starts the game over sequence
     */
    gameover() {
        if (this.gameOverTriggered) return;
        this.gameOverTriggered = true;
        activeBackgroundSound = "none";
        stopGame();
        hideMobileControls();
        stopGameSound();
        youLose();
        this.showGameOverScreen();
    }

    /**
     * shows the game over screen
     */
    showGameOverScreen() {
        document.getElementById("end-screen").classList.remove("d_none");
        document.getElementById("game-over-content").classList.remove("d_none");
        document.getElementById("you-win-content").classList.add("d_none");
    }

    /**
     * starts the win sequence
     */
    youWin() {
        if (this.youWinTriggered) return;
        this.youWinTriggered = true;
        activeBackgroundSound = "none";
        stopGame();
        hideMobileControls();
        stopGameSound();
        youWin();
        this.showWinScreen();
    }

    /**
     * shows the win screen
     */
    showWinScreen() {
        document.getElementById("end-screen").classList.remove("d_none");
        document.getElementById("you-win-content").classList.remove("d_none");
        document.getElementById("game-over-content").classList.add("d_none");
    }
}
