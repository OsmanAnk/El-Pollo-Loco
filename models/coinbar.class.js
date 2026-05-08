class Coinbar extends DrawableObject {

    IMAGES_COIN = [
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
    ];

    percentage = 0;

    constructor() {
        super();
        this.images = this.IMAGES_COIN;
        this.loadImage("assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png");
        this.loadImages(this.IMAGES_COIN);
        this.y = 90;
        this.x = 40;
        this.width = 200;
        this.height = 60;
        this.setPercentage(0);
    }
}