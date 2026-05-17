class Chicken extends MovableObject {
    height = 60;
    width = 60;
    y = 360;
    IMAGES_WALKING = [
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
    ]
    IMAGES_DEAD = [
        "assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png"
    ]

    constructor(x) {
        super().loadImage("assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png")
        this.loadImages(this.IMAGES_WALKING)
        this.loadImages(this.IMAGES_DEAD)

        this.x = x;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.chickenDead()) {
                this.moveLeft();
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.playAnimation(this.IMAGES_DEAD);
                setTimeout(() => {
                    this.removeFromWorld();
                }, 500);

            }
        }, 1000 / 60);
    }

}