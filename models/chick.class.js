class Chick extends MovableObject {
    height = 60;
    width = 60;
    y = 360;
    IMAGES_WALKING = [
        "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png"
    ]
    IMAGES_DEAD = [
        "assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png"
    ]

    constructor() {
        super().loadImage("assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png")
        this.loadImages(this.IMAGES_WALKING)

        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
        } else {
            setInterval(() => {
                this.playAnimation(this.IMAGES_WALKING);
            }, 1000 / (60 / 6));
        }
    }

}