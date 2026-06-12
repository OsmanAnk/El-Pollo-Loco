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
            this.checkCollisions();
            this.checkCollisionsThrowableObjects();
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
     * checks all collisions
     */
    checkCollisions() {
        this.checkCollisionsAboveEnemies();
        this.checkCollisionsEnemy();
        this.checkCollisionsCoins();
        this.checkCollisionsBottles();
    }

    /**
     * checks enemy collisions
     */
    checkCollisionsEnemy() {
        this.level.enemies.forEach((enemy) => {
            if (this.isCharacterHitByEnemy(enemy)) this.handleCharacterEnemyHit(enemy);
        });
    }

    /**
     * checks whether an enemy hits the character
     */
    isCharacterHitByEnemy(enemy) {
        let isAboveEnemy = this.character.y + this.character.height - 30 < enemy.y;
        return this.character.isColliding(enemy) && !this.character.isHurt() && !isAboveEnemy;
    }

    /**
     * handles an enemy hit on the character
     */
    handleCharacterEnemyHit(enemy) {
        this.character.hit();
        this.healthbar.setPercentage(this.character.energy);
        enemy.isAttacking = true;
        setTimeout(() => {
            enemy.isAttacking = false;
        }, 1000);
    }

    /**
     * checks coin collisions
     */
    checkCollisionsCoins() {
        this.level.coins.forEach((coins) => {
            if (this.character.isCollidingWithCoin(coins)) this.collectCoin(coins);
        });
    }

    /**
     * collects a coin
     */
    collectCoin(coins) {
        this.coinSoundPlay();
        this.character.collect(coins);
        this.updateCoinbar();
        this.hideCollectedObject(coins);
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
     * checks bottle collisions
     */
    checkCollisionsBottles() {
        this.level.bottles.forEach((bottle) => {
            if (this.character.isColliding(bottle)) this.collectBottle(bottle);
        });
    }

    /**
     * collects a bottle
     */
    collectBottle(bottle) {
        this.bottleCollectSoundPlay();
        this.character.collect(bottle);
        this.updateBottlebar();
        this.hideCollectedObject(bottle);
    }

    /**
     * moves a collected object away
     */
    hideCollectedObject(object) {
        if (object.x > 4000) object.x = 10000;
        object.y = 10000;
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
     * checks jump collisions with enemies
     */
    checkCollisionsAboveEnemies() {
        this.level.enemies.forEach((enemy) => {
            if (this.isJumpingOnEnemy(enemy)) this.handleJumpOnEnemy(enemy);
        });
    }

    /**
     * checks whether the character jumps on an enemy
     */
    isJumpingOnEnemy(enemy) {
        let isAboveEnemy = this.character.y + this.character.height - 30 < enemy.y;
        return this.character.isColliding(enemy) && this.character.speedY < 0 && isAboveEnemy;
    }

    /**
     * handles jumping on an enemy
     */
    handleJumpOnEnemy(enemy) {
        this.hitEnemy(enemy);
        this.character.bounce();
    }

    /**
     * checks throwable object collisions
     */
    checkCollisionsThrowableObjects() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (this.isBottleHitEnemy(bottle, enemy)) this.handleBottleHitEnemy(bottle, enemy);
            });
        });
    }

    /**
     * checks whether a bottle hits an enemy
     */
    isBottleHitEnemy(bottle, enemy) {
        return bottle.isColliding(enemy) && !bottle.isSplashed;
    }

    /**
     * handles a bottle hit on an enemy
     */
    handleBottleHitEnemy(bottle, enemy) {
        bottle.splash();
        this.hitEnemy(enemy);
    }

    /**
     * applies damage to an enemy
     */
    hitEnemy(enemy) {
        if (enemy instanceof Endboss) {
            this.hitEndboss(enemy);
        } else if (enemy instanceof Chicken) {
            this.hitChicken(enemy);
        } else if (enemy instanceof Chick) {
            this.hitChick(enemy);
        }
    }

    /**
     * damages the endboss
     */
    hitEndboss(enemy) {
        enemy.endbossLife -= 12.5;
        enemy.isHurt = true;
        this.endbossHurtSoundPlay();
    }

    /**
     * kills a chicken
     */
    hitChicken(enemy) {
        enemy.chickenLife = 0;
        this.chickenHurtSoundPlay();
    }

    /**
     * kills a chick
     */
    hitChick(enemy) {
        enemy.chickenLife = 0;
        this.chickHurtSoundPlay();
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
