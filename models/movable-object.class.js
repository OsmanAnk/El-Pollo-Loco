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


    /**
     * applies gravity to falling objects
     */
    applyGravity() {
        setStoppableInterval(() => {
            if (this instanceof ThrowableObject && this.isSplashed) {
                return;
            }
            if (this.shouldFall()) this.fall();
        }, 1000 / 30);
    }

    /**
     * checks whether the object should fall
     */
    shouldFall() {
        return this.isAboveGround() || this.speedY > 0;
    }

    /**
     * moves the object vertically with gravity
     */
    fall() {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        if (!(this instanceof ThrowableObject) && this.y > 150) {
            this.y = 150;
            this.speedY = 0;
        }
    }

    /**
     * checks whether the object is above ground
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) { //throwable fallen komplett runter
            return true;
        } else {
            return this.y < 150; //alle anderen hören bei 150 auf
        }
    }

    /**
     * checks collision with another object
     */
    isColliding(mo) {
        return this.isCollidingWithObject(mo);
    }

    /**
     * checks collision with the endboss hitbox
     */
    isCollidingWithEndboss(mo) {
        return (
            this.x + this.width > mo.x + 100 &&
            this.y + this.height > mo.y + 150 &&
            this.x < mo.x + mo.width - 100 &&
            this.y < mo.y + mo.height - 100
        );
    }

    /**
     * checks collision with an enemy hitbox
     */
    isCollidingWithEnemy(enemy) {
        if (enemy instanceof Endboss) {
            return this.isCollidingWithEndboss(enemy);
        }
        return (
            this.x + this.width - 20 > enemy.x &&
            this.y + this.height > enemy.y + 10 &&
            this.x + 20 < enemy.x + enemy.width &&
            this.y + 80 < enemy.y + enemy.height
        );
    }

    /**
     * checks collision with a regular object
     */
    isCollidingWithObject(mo) {
        return (
            this.x + this.width > mo.x + 50 && //rechte Seite des Charakters mit linker Seite des Objekts
            this.y + this.height > mo.y + 50 && //untere Seite des Charakters mit oberer Seite des Objekts
            this.x < mo.x + mo.width - 50 && //linke Seite des Charakters mit rechter Seite des Objekts
            this.y < mo.y + mo.height - 150 //obere Seite des Charakters mit unterer Seite des Objekts
        );
    }

    /**
     * checks whether the chicken is dead
     */
    chickenDead() {
        return this.chickenLife == 0;
    }

    /**
     * reduces object energy after a hit
     */
    hit() {
        this.energy -= 20;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * checks whether the object is dead
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * removes the object from the game world
     */
    removeFromWorld() {
        this.world.level.enemies = this.world.level.enemies.filter((enemy) => enemy !== this);
        this.world.throwableObjects = this.world.throwableObjects.filter((obj) => obj !== this);
    }

    /**
     * checks whether the object is recently hurt
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; //Differenz in ms
        timepassed = timepassed / 1000; //Differenz in s
        return timepassed < 0.5;
    }

    /**
     * moves the object right
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * moves the object left
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * collects a coin or bottle
     */
    collect(items) {
        if (items instanceof Coin) {
            this.coin += 1;
        } else if (items instanceof Bottle) {
            this.bottle += 1;
        }
    }

    /**
     * plays a looping image animation
     */
    playAnimation(images) {

        let i = this.currentImage % images.length;
        let path = images[i]

        this.img = this.imageCache[path];
        this.currentImage++;
    }
}
