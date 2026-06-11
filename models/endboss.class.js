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
    alertStartX = 4275;
    walkStartX = 4375;


    /**
     * creates the endboss
     */
    constructor(x) {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING)
        this.loadImages(this.IMAGES_ALERT)
        this.loadImages(this.IMAGES_ATTACK)
        this.loadImages(this.IMAGES_HURT)
        this.loadImages(this.IMAGES_DEAD)

        this.x = x;
        this.speed = 0;
        this.animate();
    }

    /**
     * starts the endboss animation interval
     */
    animate() {
        setStoppableInterval(() => {
            this.playEndbossAnimation();
        }, 1000 / 6);
    }

    /**
     * plays the matching endboss animation
     */
    playEndbossAnimation() {
        if (this.isAttacking) {
            return this.playAnimation(this.IMAGES_ATTACK);
        }
        if (this.isHurt) return this.playHurtAnimation();
        if (this.endbossLife <= 0) return this.playDeadAnimation();
        if (this.shouldStartWalking()) return this.startWalking();
        if (this.shouldPlayAlertAnimation()) return this.playAlertAnimation();
        this.walk();
    }

    /**
     * checks whether the alert animation should start
     */
    shouldPlayAlertAnimation() {
        return this.world.character.x >= this.alertStartX && !this.isAlerted;
    }

    /**
     * checks whether the boss should start walking
     */
    shouldStartWalking() {
        return this.world.character.x > this.walkStartX;
    }

    /**
     * plays the alert animation
     */
    playAlertAnimation() {
        this.speed = 0;
        this.playAnimation(this.IMAGES_ALERT);
    }

    /**
     * starts the boss movement
     */
    startWalking() {
        this.isAlerted = true;
        this.speed = 20;
        this.walk();
    }

    /**
     * plays the hurt animation
     */
    playHurtAnimation() {
        this.playAnimation(this.IMAGES_HURT);
        setTimeout(() => {
            this.isHurt = false;
        }, 500);
    }

    /**
     * plays the dead animation
     */
    playDeadAnimation() {
        this.playAnimation(this.IMAGES_DEAD);
        this.world.youWin();
    }

    /**
     * moves and animates the boss
     */
    walk() {
        if (!this.isAlerted) return;

        this.moveLeft();
        this.playAnimation(this.IMAGES_WALKING);
    }
}
