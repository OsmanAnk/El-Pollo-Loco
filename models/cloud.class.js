class Cloud extends MovableObject {
    y = 20
    width = 480;
    height = 240;

    /**
     * creates a cloud
     */
    constructor(x) {
        super().loadImage("assets/img/5_background/layers/4_clouds/1.png")
        this.x = x * 720 + Math.random() * 200;
        // this.x = Math.random() * 500;
        this.animate();
    }

    /**
     * starts cloud movement
     */
    animate() {
        this.moveLeft();
    }

    /**
     * moves the cloud left
     */
    moveLeft() {
        setStoppableInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}
