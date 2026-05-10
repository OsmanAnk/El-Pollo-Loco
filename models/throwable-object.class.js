class ThrowableObject extends MovableObject {
    IMAGE_THROW = [
        "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
        "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
        "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
        "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    ]

    constructor(x, y, character) {
        super();
        this.loadImage("assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png");
        this.loadImages(this.IMAGE_THROW);
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
        setInterval(() => {
            this.x += this.speedX;
        }, 25);
    }
}