class BackgroundObject extends MovableObject {

    width = 720;
    height = 480;
    IMAGES_BACKGROUND = [

    ]
    constructor(imagePath, x) {
        super().loadImage(imagePath)
        this.x = x;
        this.y = 480 - this.height;

        // animate();
    }


    animate() {
        setInterval(() => {
            if (this.world.keyboard.RIGHT) {
                this.otherDirection = false;
                this.x += this.speed;
            }
            if (this.world.keyboard.LEFT) {
                this.otherDirection = true;
                this.x -= this.speed;
            }
            this.world.camera_x = -this.x
        }, 1000 / 60)
    }
}

