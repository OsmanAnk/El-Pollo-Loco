class Bottlebar extends DrawableObject {

    IMAGES_BOTTLE = [
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
    ];

    percentage = 100;

    constructor() {
        super();
        this.images = this.IMAGES_BOTTLE;
        this.loadImage("assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png");
        this.loadImages(this.IMAGES_BOTTLE);
        this.y = 10;
        this.x = 40;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }
}