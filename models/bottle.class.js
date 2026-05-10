class Bottle extends MovableObject {
    height = 75;
    width = 75;
    IMAGE = [
        "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
    ]

    constructor() {
        super();
        this.loadImage(this.IMAGE[0]);
        this.loadImages(this.IMAGE);
        this.x = 200 + Math.random() * 500;
        this.y = 350;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGE);
        }, 1000 / 2);
    }
}