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
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        }, 1000 / 25);
    }

    checkThrowObjects() {
        let now = new Date().getTime();
        if (this.keyboard.D && this.character.bottle >= 20 && now - this.lastBottleThrow > this.bottleThrowCooldown) {
            this.character.bottle -= 20;
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
        this.checkCollisionsEnemy();
        this.checkCollisionsCoins();
        this.checkCollisionsBottles();
    }

    checkCollisionsEnemy() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && !this.character.isHurt()) {
                this.character.hit();
                this.healthbar.setPercentage(this.character.energy);
            }
        });
    }

    checkCollisionsCoins() {
        this.level.coins.forEach((coins) => {
            if (this.character.isColliding(coins)) {
                this.character.collect(coins);
                this.coinbar.setPercentage(this.character.coin);
                coins.x += 720 + Math.random() * 720;
                if (coins.x > 4000) {
                    coins.x = 10000;
                }
                coins.y = 10 + Math.random() * 350;
            }
        });
    }

    checkCollisionsBottles() {
        this.level.bottles.forEach((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.character.collect(bottle);
                this.bottlebar.setPercentage(this.character.bottle);
                bottle.x += 720 + Math.random() * 720;
                if (bottle.x > 4000) {
                    bottle.x = 10000;
                }

                bottle.y = 350;
            }
        });
    }

    checkCollisionsThrowableObjects() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy))
            if(bottle.isColliding(enemy)) {
                enemy.chickenHit();
            }
        })
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
}

