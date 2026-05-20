class Coin extends MovableObject {
    height = 100;
    width = 100;
    IMAGE = [
        "assets/img/8_coin/coin_1.png",
        "assets/img/8_coin/coin_2.png",
    ]

    constructor(x,y) {
        super();
        this.loadImage(this.IMAGE[0]);
        this.loadImages(this.IMAGE);
        this.x = x;
        this.y = y;
        // this.x = 200 + Math.random() * 500;
        // this.y = 0 + Math.random() * 320;
        this.animate();
    }

    animate() {
        setStoppableInterval(() => {
            this.playAnimation(this.IMAGE);
        }, 1000 / 2);
    }
}