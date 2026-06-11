class ThrowableObject extends MovableObject {
    IMAGE_THROW = [
        "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
        "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
        "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
        "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    ]

    IMAGE_SPLASH = [
        "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
        "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
        "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
        "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
        "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
        "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
    ]

    isSplashed = false;
    groundY = 420;

    /**
     * creates a throwable bottle
     */
    constructor(x, y, character) {
        super();
        this.loadImage("assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png");
        this.loadImages(this.IMAGE_THROW);
        this.loadImages(this.IMAGE_SPLASH);
        this.x = x;
        this.y = y;
        this.character = character;
        this.height = 60;
        this.width = 60;
        this.throw();
    }

    /**
     * starts the throw movement
     */
    throw() {
        this.setThrowDirection();
        this.speedY = 30;
        this.applyGravity();
        this.startThrowMovement();
        this.startThrowAnimation();
    }

    /**
     * sets the horizontal throw direction
     */
    setThrowDirection() {
        if (this.character.otherDirection) {
            this.speedX = -10;
        } else {
            this.speedX = 10;
        }
    }

    /**
     * starts horizontal bottle movement
     */
    startThrowMovement() {
        setStoppableInterval(() => {
            if (this.isSplashed) return;
            this.x += this.speedX;
        }, 25);
    }

    /**
     * starts the bottle throw animation
     */
    startThrowAnimation() {
        setStoppableInterval(() => {
            if (this.isSplashed) return;
            if (this.speedY < 0) {
                this.playAnimation(this.IMAGE_THROW);
            }
            this.splashOnGround();
        }, 100);
    }

    /**
     * splashes the bottle on ground contact
     */
    splashOnGround() {
        if (this.y + this.height >= this.groundY) {
            this.y = this.groundY - this.height;
            this.splash();
        }
    }

    /**
     * starts the splash state
     */
    splash() {
        if (this.isSplashed) return;

        this.world.bottleSplashSoundPlay();
        this.isSplashed = true;
        this.stopBottleMovement();
        this.startSplashAnimation();
        this.removeAfterSplash();
    }

    /**
     * stops bottle movement
     */
    stopBottleMovement() {
        this.speedX = 0;
        this.speedY = 0;
        this.acceleration = 0;
        this.currentImage = 0;
    }

    /**
     * starts splash animation frames
     */
    startSplashAnimation() {
        setStoppableInterval(() => {
            this.playAnimation(this.IMAGE_SPLASH);
        }, 75);
    }

    /**
     * removes the bottle after splashing
     */
    removeAfterSplash() {
        setTimeout(() => {
            this.removeFromWorld();
        }, 500);
    }
}
