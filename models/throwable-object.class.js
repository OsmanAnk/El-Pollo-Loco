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

    throw() {
        if (this.character.otherDirection) {
            this.speedX = -10;
        } else {
            this.speedX = 10;
        }
        this.speedY = 30;
        this.applyGravity();
        setStoppableInterval(() => {
            this.x += this.speedX;
        }, 25);
        setStoppableInterval(() => {
            if (this.speedY < 0) {
                this.playAnimation(this.IMAGE_THROW);
            }
            if (this.y > 318) {
                this.playAnimation(this.IMAGE_SPLASH);
                this.speedX = 0;
                this.speedY = 0;
            }
        }, 100);
    }
}