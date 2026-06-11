class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    prevY = 0;
    acceleration = 2.5;
    energy = 100;
    chickenLife = 1;
    endbossLife = 100;
    lastHit = 0;


    applyGravity() {
        setStoppableInterval(() => {
            if (this instanceof ThrowableObject && this.isSplashed) {
                return;
            }
            if (this.shouldFall()) this.fall();
        }, 1000 / 30);
    }

    shouldFall() {
        return this.isAboveGround() || this.speedY > 0;
    }

    fall() {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) { //throwable fallen komplett runter
            return true;
        } else {
            return this.y < 150; //alle anderen hören bei 150 auf
        }
    }

    isColliding(mo) {
        if (mo instanceof Endboss) {
            return this.isCollidingWithEndboss(mo);
        }
        return this.isCollidingWithObject(mo);
    }

    isCollidingWithEndboss(mo) {
        return (
            this.x + this.width > mo.x + 100 &&
            this.y + this.height > mo.y + 150 &&
            this.x < mo.x + mo.width - 100 &&
            this.y < mo.y + mo.height - 100
        );
    }

    isCollidingWithCoin(coin) {
        return (
            this.x + this.width > coin.x &&
            this.y + this.height > coin.y &&
            this.x < coin.x + coin.width &&
            this.y + 100 < coin.y + coin.height
        );
    }

    isCollidingWithObject(mo) {
        return (
            this.x + this.width > mo.x && //rechte Seite des Charakters mit linker Seite des Gegners
            this.y + this.height > mo.y && //untere Seite des Charakters mit oberer Seite des Gegners
            this.x < mo.x + mo.width && //linke Seite des Charakters mit rechter Seite des Gegners
            this.y < mo.y + mo.height //obere Seite des Charakters mit unterer Seite des Gegners
        );
    }

    chickenDead() {
        return this.chickenLife == 0;
    }

    hit() {
        this.energy -= 20;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isDead() {
        return this.energy == 0;
    }

    removeFromWorld() {
        this.world.level.enemies = this.world.level.enemies.filter((enemy) => enemy !== this);
        this.world.throwableObjects = this.world.throwableObjects.filter((obj) => obj !== this);
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; //Differenz in ms
        timepassed = timepassed / 1000; //Differenz in s
        return timepassed < 0.5;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    collect(items) {
        if (items instanceof Coin) {
            this.coin += 1;
        } else if (items instanceof Bottle) {
            this.bottle += 1;
        }
    }

    playAnimation(images) {

        let i = this.currentImage % images.length;
        let path = images[i]

        this.img = this.imageCache[path];
        this.currentImage++;
    }
}
