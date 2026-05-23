class Endboss extends MovableObject {
    height = 360;
    width = 360;
    y = 90;
    IMAGES_WALKING = [
        "assets/img/4_enemie_boss_chicken/1_walk/G1.png",
        "assets/img/4_enemie_boss_chicken/1_walk/G2.png",
        "assets/img/4_enemie_boss_chicken/1_walk/G3.png",
        "assets/img/4_enemie_boss_chicken/1_walk/G4.png",
    ]

    IMAGES_ALERT = [
        "assets/img/4_enemie_boss_chicken/2_alert/G5.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G6.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G7.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G8.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G9.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G10.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G11.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G12.png",
    ]

    IMAGES_ATTACK = [
        "assets/img/4_enemie_boss_chicken/3_attack/G13.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G14.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G15.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G16.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G17.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G18.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G19.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G20.png",
    ]

    IMAGES_HURT = [
        "assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
        "assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
        "assets/img/4_enemie_boss_chicken/4_hurt/G23.png",
    ]

    IMAGES_DEAD = [
        "assets/img/4_enemie_boss_chicken/5_dead/G24.png",
        "assets/img/4_enemie_boss_chicken/5_dead/G25.png",
        "assets/img/4_enemie_boss_chicken/5_dead/G26.png",
    ]
    isAlerted = false;


    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING)
        this.loadImages(this.IMAGES_ALERT)
        this.loadImages(this.IMAGES_ATTACK) //das fehlt noch
        this.loadImages(this.IMAGES_HURT)
        this.loadImages(this.IMAGES_DEAD)

        this.x = 400;
        this.speed = 0.5;
        this.animate();
    }

    animate() {
        setStoppableInterval(() => {
            if (this.world.character.x > 100 && this.world.character.x < 500 && this.isAlerted === false) {
                this.playAnimation(this.IMAGES_ALERT);
                if (this.currentImage >= this.IMAGES_ALERT.length) {
                    this.isAlerted = true;
                    this.currentImage = 0;
                }
            } else if (this.isHurt) {
                this.playAnimation(this.IMAGES_HURT);
                setTimeout(() => {
                    this.isHurt = false;
                }, 500);
            } else if (this.endbossLife <= 0) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.moveLeft();
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 1000 / 6);
    }
}