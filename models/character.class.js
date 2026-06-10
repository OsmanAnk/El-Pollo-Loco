class Character extends MovableObject {
    height = 280;
    y = 80;
    speed = 10;
    IMAGES_WALKING = [
        "assets/img/2_character_pepe/2_walk/W-21.png",
        "assets/img/2_character_pepe/2_walk/W-22.png",
        "assets/img/2_character_pepe/2_walk/W-23.png",
        "assets/img/2_character_pepe/2_walk/W-24.png",
        "assets/img/2_character_pepe/2_walk/W-25.png",
        "assets/img/2_character_pepe/2_walk/W-26.png",
    ];

    IMAGES_JUMPING = [
        "assets/img/2_character_pepe/3_jump/J-31.png",
        "assets/img/2_character_pepe/3_jump/J-32.png",
        "assets/img/2_character_pepe/3_jump/J-33.png",
        "assets/img/2_character_pepe/3_jump/J-34.png",
        "assets/img/2_character_pepe/3_jump/J-35.png",
        "assets/img/2_character_pepe/3_jump/J-36.png",
        "assets/img/2_character_pepe/3_jump/J-37.png",
        "assets/img/2_character_pepe/3_jump/J-38.png",
        "assets/img/2_character_pepe/3_jump/J-39.png",

    ]

    IMAGES_DEAD = [
        "assets/img/2_character_pepe/5_dead/D-51.png",
        "assets/img/2_character_pepe/5_dead/D-52.png",
        "assets/img/2_character_pepe/5_dead/D-53.png",
        "assets/img/2_character_pepe/5_dead/D-54.png",
        "assets/img/2_character_pepe/5_dead/D-55.png",
        "assets/img/2_character_pepe/5_dead/D-56.png",
    ]

    IMAGES_HURT = [
        "assets/img/2_character_pepe/4_hurt/H-41.png",
        "assets/img/2_character_pepe/4_hurt/H-42.png",
        "assets/img/2_character_pepe/4_hurt/H-43.png",
    ]

    IMAGES_IDLE = [
        "assets/img/2_character_pepe/1_idle/idle/I-1.png",
        "assets/img/2_character_pepe/1_idle/idle/I-2.png",
        "assets/img/2_character_pepe/1_idle/idle/I-3.png",
        "assets/img/2_character_pepe/1_idle/idle/I-4.png",
        "assets/img/2_character_pepe/1_idle/idle/I-5.png",
        "assets/img/2_character_pepe/1_idle/idle/I-6.png",
        "assets/img/2_character_pepe/1_idle/idle/I-7.png",
        "assets/img/2_character_pepe/1_idle/idle/I-8.png",
        "assets/img/2_character_pepe/1_idle/idle/I-9.png",
        "assets/img/2_character_pepe/1_idle/idle/I-10.png",
    ]

    IMAGES_LONG_IDLE = [
        "assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-20.png",
    ]
    world;
    coin = 0;
    bottle = 0;
    idleStartTime = new Date().getTime();
    deathAnimationPlayed = false;
    deathAnimationIndex = 0;

    hurtSound = new Audio("audio/character_hurt.mp3");
    snoreSound = new Audio("audio/snore_sound.mp3");
    jumpSound = new Audio("audio/character_jump.mp3");


    constructor() {
        super().loadImage("assets/img/2_character_pepe/2_walk/W-21.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT)
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.applyGravity()

        this.hurtSound.volume = 0.05;
        this.snoreSound.volume = 0.05;
        this.snoreSound.loop = true;
        this.jumpSound.volume = 0.05;

        this.animate();
    }

    animate() {
        setStoppableInterval(() => this.moveCharacter(), 1000 / 60)
        setStoppableInterval(() => this.playCharacterAnimation(), 1000 / 20);
        setStoppableInterval(() => this.idleCharacter(), 1000 / 5);
        setStoppableInterval(() => this.longIdleCharacter(), 1000 / 5);
    }

    shouldFall() {
        return !this.isDead() && super.shouldFall();
    }

    moveCharacter() {
        if (this.isDead()) {
            this.stopSnore();
            return;
        }
        if (this.canMoveRight())
            this.moveRight();
        if (this.canMoveLeft())
            this.moveLeft();
        if (this.canJump())
            this.jump();
        this.world.camera_x = -this.x + 100;
    }

    canMoveRight() {
        return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
    }

    moveRight() {
        super.moveRight();
        this.otherDirection = false;
        this.idleStartTime = new Date().getTime();
        this.stopSnore();
    }

    canMoveLeft() {
        return this.world.keyboard.LEFT && this.x > 0;
    }

    moveLeft() {
        super.moveLeft();
        this.otherDirection = true;
        this.idleStartTime = new Date().getTime();
        this.stopSnore();
    }

    canJump() {
        return this.world.keyboard.UP && !this.isAboveGround();
    }

    jump() {
        this.speedY = 30;
        this.jumpSound.currentTime = 0;
        this.jumpSound.play();
        this.idleStartTime = new Date().getTime();
        this.stopSnore();
    }

    playCharacterAnimation() {
        if (this.isDead()) {
            this.playDeathAnimation();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING)
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING)
        }
    }

    playDeathAnimation() {
        if (this.deathAnimationIndex < this.IMAGES_DEAD.length) {
            let path = this.IMAGES_DEAD[this.deathAnimationIndex];
            this.img = this.imageCache[path];
            this.deathAnimationIndex++;
        } else {
            this.showLastDeathFrame();
        }
    }

    showLastDeathFrame() {
        let lastDeathImage = this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1];
        this.img = this.imageCache[lastDeathImage];
        if (!this.deathAnimationPlayed) {
            this.triggerGameOver();
        }
    }

    triggerGameOver() {
        this.deathAnimationPlayed = true;
        setTimeout(() => {
            this.world.gameover();
        }, 500);
    }

    idleCharacter() {
        if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.isAboveGround()
            && !this.isHurt() && !this.isDead() && new Date().getTime() - this.idleStartTime <= 15000) {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }

    longIdleCharacter() {
        if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.isAboveGround()
            && !this.isHurt() && !this.isDead() && new Date().getTime() - this.idleStartTime > 15000) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
            this.snore();
        }
    }

    bounce() {
        this.speedY = 20;
    }

    hit() {
        super.hit();
        this.hurtSound.play();
        this.stopSnore();
    }

    snore() {
        this.snoreSound.play();
    }

    stopSnore() {
        this.snoreSound.pause();
        this.snoreSound.currentTime = 0;
    }
}
