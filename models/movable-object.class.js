class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    prevY = 0;
    acceleration = 2.5;
    energy = 100;
    chickenLife = 1;
    lastHit = 0;


    applyGravity() {
        setStoppableInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY; //von der aktuellen Position y wird speedY abgezogen ->hier: 280 - 0
                this.speedY -= this.acceleration; //von speedY wird die Beschleunigung abgezogen ->hier: 0 - 1; somit wird oben in y 280 - (-1) addiert
            }
        }, 1000 / 30);
    }


    isAboveGround() {
        if (this instanceof ThrowableObject) { //throwable fallen komplett runter
            return true;
        } {
            return this.y < 150; //alle anderen hören bei 150 auf
        }
    }

    isColliding(mo) {
        return (
            this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x + mo.width &&
            this.y < mo.y + mo.height
        );
    }

    chickenHit() {
        this.chickenLife = 0;
    }

    chickenDead() {
        return this.chickenLife == 0;
    }

    hit() {
        this.energy -= 5;
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
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; //Differenz in ms
        timepassed = timepassed / 1000; //Differenz in s
        return timepassed < 0.25;
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
            // console.log("coins collected: ", this.coin);
        } else if (items instanceof Bottle) {
            this.bottle += 1;
            // console.log("bottles collected: ", this.bottle);
        }
    }

    playAnimation(images) {

        let i = this.currentImage % images.length;
        let path = images[i]

        this.img = this.imageCache[path];
        this.currentImage++;
    }
}
