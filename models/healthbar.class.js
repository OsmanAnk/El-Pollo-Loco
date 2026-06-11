class Healthbar extends DrawableObject {

    IMAGES_HEALTH = [
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
    ];

    percentage = 100;

    /**
     * creates the health statusbar
     */
    constructor() {
        super();
        this.images = this.IMAGES_HEALTH;
        this.loadImage("assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png");
        this.loadImages(this.IMAGES_HEALTH);
        this.y = 50;
        this.x = 40;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100)
    }
}
