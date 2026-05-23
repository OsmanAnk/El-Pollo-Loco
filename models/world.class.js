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
    bottleThrowCooldown = 300; // ms Abstand zwischen zwei Flaschenwürfen

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard
        this.setWorld();
        this.draw();
        this.run();
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
        if (this.keyboard.SPACE && this.character.bottle >= 1 && now - this.lastBottleThrow > this.bottleThrowCooldown) {
            console.log("throw");
            this.character.bottle -= 1; //vorher 20
            let bottle;
            if (this.character.otherDirection) {
                bottle = new ThrowableObject(this.character.x - 100, this.character.y + 100, this.character);
            } else {
                bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100, this.character);
            }
            this.throwableObjects.push(bottle);
            this.bottlebar.setPercentage(this.character.bottle);
            this.lastBottleThrow = now;
        }
    }

    checkCollisions() {
        this.checkCollisionsAboveEnemies();
        this.checkCollisionsEnemy();
        this.checkCollisionsCoins();
        this.checkCollisionsBottles();
    }

    checkCollisionsEnemy() {
        this.level.enemies.forEach((enemy) => {

            let isAboveEnemy = this.character.y + this.character.height - 30 < enemy.y; //charakter ist über dem Gegner, mit einem kleinen Puffer von 30 Pixeln

            if (this.character.isColliding(enemy) && !this.character.isHurt() && !isAboveEnemy) { //charakter kollidiert mit dem Gegner, ist aber nicht im Stomp-Modus
                this.character.hit();
                this.healthbar.setPercentage(this.character.energy);
            }
        });
    }

    checkCollisionsCoins() {
        this.level.coins.forEach((coins) => {
            if (this.character.isColliding(coins)) {
                this.character.collect(coins);
                let totalCoins = this.level.coins.length || 1;
                let coinPercent = Math.round((this.character.coin / totalCoins) * 100);
                this.coinbar.setPercentage(coinPercent);
                if (coins.x > 4000) {
                    coins.x = 10000;
                }
                coins.y = 10000;
            }
        });
    }

    checkCollisionsBottles() {
        this.level.bottles.forEach((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.character.collect(bottle);
                let totalBottles = this.level.bottles.length || 1;
                let bottlePercent = Math.round((this.character.bottle / totalBottles) * 100);
                this.bottlebar.setPercentage(bottlePercent);
                if (bottle.x > 4000) {
                    bottle.x = 10000;
                }
                bottle.y = 10000;
            }
        });
    }

    checkCollisionsAboveEnemies() {
        this.level.enemies.forEach((enemy) => {
            let isAboveEnemy = this.character.y + this.character.height - 30 < enemy.y; //charakter ist über dem Gegner, mit einem kleinen Puffer von 30 Pixeln
            if (this.character.isColliding(enemy) && this.character.speedY < 0 && isAboveEnemy) { //charakter springt auf den Gegner
                enemy.chickenLife = 0;  // Gegner wird besiegt
                this.character.bounce(); // Charakter springt zurück hoch
            }
        });
    }

    checkCollisionsThrowableObjects() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy)) {
                    enemy.chickenLife = 0;
                    enemy.isHurt = true;
                }
            });
        });
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);

        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.healthbar);
        this.addToMap(this.coinbar);
        this.addToMap(this.bottlebar);


        //draw() wird immer wieder aufgerufen
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
        mo.drawFrame(this.ctx);

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
        stopGame();

        let gameOverScreen = document.getElementById("game-over-screen");
        gameOverScreen.innerHTML =
            `<div class="game-over-wrapper">
                <img src="assets/img/You won, you lost/You lost.png" alt="game over screen"
                    class="game-over-image">
                <button class="restart-button" onclick="restartGame()">
                    Restart
                </button>
            </div>`;
        gameOverScreen.classList.remove("d_none");
    }
}