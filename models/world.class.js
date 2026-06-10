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
    bottleThrowCooldown = 500;

    coinSound = new Audio("audio/coin_collect.mp3");
    bottleCollectSound = new Audio("audio/bottle_collect.mp3");
    bottleThrowSound = new Audio("audio/bottle_throw.mp3");
    bottleSplashSound = new Audio("audio/bottle_splash.mp3");
    endbossHurtSound = new Audio("audio/boss_hurt.mp3");
    chickenHurtSound = new Audio("audio/chicken_hurt.mp3");
    chickHurtSound = new Audio("audio/chick_hurt.mp3")

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard
        this.setWorld();
        this.draw();
        this.run();
        this.setSoundVolumes();
    }

    setSoundVolumes() {
        this.coinSound.volume = 0.05;
        this.bottleCollectSound.volume = 0.05;
        this.bottleThrowSound.volume = 0.05;
        this.bottleSplashSound.volume = 0.05;
        this.chickenHurtSound.volume = 0.05;
        this.chickHurtSound.volume = 0.05;
        this.endbossHurtSound.volume = 0.05;
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => enemy.world = this);
    }

    run() {
        setStoppableInterval(() => {
            this.checkCollisions();
            this.checkCollisionsThrowableObjects();
            this.checkThrowObjects();
        }, 1000 / 1000);
    }

    checkThrowObjects() {
        let now = new Date().getTime();
        if (this.canThrowBottle(now)) this.throwBottle(now);
    }

    canThrowBottle(now) {
        return this.keyboard.SPACE && this.character.bottle >= 1 && now - this.lastBottleThrow > this.bottleThrowCooldown;
    }

    throwBottle(now) {
        this.bottleThrowSoundPlay()
        this.character.bottle -= 1;
        let bottle = this.createThrowableBottle();
        bottle.world = this;
        this.throwableObjects.push(bottle);
        this.updateBottlebar();
        this.lastBottleThrow = now;
    }

    createThrowableBottle() {
        if (this.character.otherDirection) {
            return new ThrowableObject(this.character.x - 100, this.character.y + 100, this.character);
        }
        return new ThrowableObject(this.character.x + 100, this.character.y + 100, this.character);
    }

    updateBottlebar() {
        let bottlePercent = Math.min((this.character.bottle / this.maxBottles) * 100, 100);
        this.bottlebar.setPercentage(bottlePercent);
    }

    bottleThrowSoundPlay() {
        this.bottleThrowSound.pause();
        this.bottleThrowSound.currentTime = 0;
        this.bottleThrowSound.play();
    }

    checkCollisions() {
        this.checkCollisionsAboveEnemies();
        this.checkCollisionsEnemy();
        this.checkCollisionsCoins();
        this.checkCollisionsBottles();
    }

    checkCollisionsEnemy() {
        this.level.enemies.forEach((enemy) => {
            if (this.isCharacterHitByEnemy(enemy)) this.handleCharacterEnemyHit(enemy);
        });
    }

    isCharacterHitByEnemy(enemy) {
        let isAboveEnemy = this.character.y + this.character.height - 30 < enemy.y;
        return this.character.isColliding(enemy) && !this.character.isHurt() && !isAboveEnemy;
    }

    handleCharacterEnemyHit(enemy) {
        this.character.hit();
        this.healthbar.setPercentage(this.character.energy);
        enemy.isAttacking = true;
        setTimeout(() => {
            enemy.isAttacking = false;
        }, 1000);
    }

    checkCollisionsCoins() {
        this.level.coins.forEach((coins) => {
            if (this.character.isColliding(coins)) this.collectCoin(coins);
        });
    }

    collectCoin(coins) {
        this.coinSoundPlay();
        this.character.collect(coins);
        this.updateCoinbar();
        this.hideCollectedObject(coins);
    }

    updateCoinbar() {
        let totalCoins = this.level.coins.length || 1;
        let coinPercent = Math.round((this.character.coin / totalCoins) * 100);
        this.coinbar.setPercentage(coinPercent);
    }

    coinSoundPlay() {
        this.coinSound.pause();
        this.coinSound.currentTime = 0;
        this.coinSound.play();
    }

    checkCollisionsBottles() {
        this.level.bottles.forEach((bottle) => {
            if (this.character.isColliding(bottle)) this.collectBottle(bottle);
        });
    }

    collectBottle(bottle) {
        this.bottleCollectSoundPlay();
        this.character.collect(bottle);
        this.updateBottlebar();
        this.hideCollectedObject(bottle);
    }

    hideCollectedObject(object) {
        if (object.x > 4000) object.x = 10000;
        object.y = 10000;
    }

    bottleCollectSoundPlay() {
        this.bottleCollectSound.pause();
        this.bottleCollectSound.currentTime = 0;
        this.bottleCollectSound.play();
    }

    checkCollisionsAboveEnemies() {
        this.level.enemies.forEach((enemy) => {
            if (this.isJumpingOnEnemy(enemy)) this.handleJumpOnEnemy(enemy);
        });
    }

    isJumpingOnEnemy(enemy) {
        let isAboveEnemy = this.character.y + this.character.height - 30 < enemy.y;
        return this.character.isColliding(enemy) && this.character.speedY < 0 && isAboveEnemy;
    }

    handleJumpOnEnemy(enemy) {
        this.hitEnemy(enemy);
        this.character.bounce();
    }

    checkCollisionsThrowableObjects() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (this.isBottleHitEnemy(bottle, enemy)) this.handleBottleHitEnemy(bottle, enemy);
            });
        });
    }

    isBottleHitEnemy(bottle, enemy) {
        return bottle.isColliding(enemy) && !bottle.isSplashed;
    }

    handleBottleHitEnemy(bottle, enemy) {
        bottle.splash();
        this.hitEnemy(enemy);
    }

    hitEnemy(enemy) {
        if (enemy instanceof Endboss) {
            this.hitEndboss(enemy);
        } else if (enemy instanceof Chicken) {
            this.hitChicken(enemy);
        } else if (enemy instanceof Chick) {
            this.hitChick(enemy);
        }
    }

    hitEndboss(enemy) {
        enemy.endbossLife -= 20;
        enemy.isHurt = true;
        this.endbossHurtSoundPlay();
    }

    hitChicken(enemy) {
        enemy.chickenLife = 0;
        this.chickenHurtSoundPlay();
    }

    hitChick(enemy) {
        enemy.chickenLife = 0;
        this.chickHurtSoundPlay();
    }

    bottleSplashSoundPlay() {
        this.bottleSplashSound.pause();
        this.bottleSplashSound.currentTime = 0;
        this.bottleSplashSound.play();
    }

    endbossHurtSoundPlay() {
        this.endbossHurtSound.pause();
        this.endbossHurtSound.currentTime = 0;
        this.endbossHurtSound.play();
    }

    chickenHurtSoundPlay() {
        this.chickenHurtSound.pause();
        this.chickenHurtSound.currentTime = 0;
        this.chickenHurtSound.play();
    }

    chickHurtSoundPlay() {
        this.chickHurtSound.pause();
        this.chickHurtSound.currentTime = 0;
        this.chickHurtSound.play();
    }

    draw() {
        this.clearCanvas();
        this.ctx.translate(this.camera_x, 0);
        this.drawMovableObjects();
        this.ctx.translate(-this.camera_x, 0);
        this.drawFixedObjects();
        this.requestNextFrame();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawMovableObjects() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addToMap(this.character);
    }

    drawFixedObjects() {
        this.addToMap(this.healthbar);
        this.addToMap(this.coinbar);
        this.addToMap(this.bottlebar);
    }

    requestNextFrame() {
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o)
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        this.ctx.restore();
        mo.x = mo.x * -1;
    }

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

    showGameOverScreen() {
        document.getElementById("end-screen").classList.remove("d_none");
        document.getElementById("game-over-content").classList.remove("d_none");
        document.getElementById("you-win-content").classList.add("d_none");
    }

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

    showWinScreen() {
        document.getElementById("end-screen").classList.remove("d_none");
        document.getElementById("you-win-content").classList.remove("d_none");
        document.getElementById("game-over-content").classList.add("d_none");
    }
}
