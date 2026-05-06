class Cloud extends MovableObject {
    y = 20
    width = 480;
    height = 240;

    constructor() {
        super().loadImage("assets/img/5_background/layers/4_clouds/1.png")

        this.x = Math.random() * 500;
        this.animate();
    }

    animate() {
        this.moveLeft();
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}