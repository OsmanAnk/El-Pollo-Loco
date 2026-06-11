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

    /**
     * creates a small chicken enemy
     */
    constructor(x) {
        super().loadImage("assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png")
        this.loadImages(this.IMAGES_WALKING)
        this.loadImages(this.IMAGES_DEAD)

        this.x = x
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    /**
     * starts the chick animation interval
     */
    animate() {
        setStoppableInterval(() => {
            this.playChickAnimation();
        }, 1000 / 60);
    }

    /**
     * plays walking or death animation
     */
    playChickAnimation() {
        if (!this.chickenDead()) {
            this.walk();
        } else {
            this.playDeathAnimation();
        }
    }

    /**
     * moves and animates the chick
     */
    walk() {
        this.moveLeft();
        this.playAnimation(this.IMAGES_WALKING);
    }

    /**
     * plays the death animation
     */
    playDeathAnimation() {
        this.playAnimation(this.IMAGES_DEAD);
        setTimeout(() => {
            this.removeFromWorld();
        }, 500);
    }
}
