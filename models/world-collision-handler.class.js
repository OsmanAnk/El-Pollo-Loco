class WorldCollisionHandler {

    /**
     * creates a collision handler for the world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * checks all collisions
     */
    checkCollisions() {
        this.checkCollisionsAboveEnemies();
        this.checkCollisionsEnemy();
        this.checkCollisionsCoins();
        this.checkCollisionsBottles();
    }

    /**
     * checks enemy collisions
     */
    checkCollisionsEnemy() {
        this.world.level.enemies.forEach((enemy) => {
            if (this.isCharacterHitByEnemy(enemy)) this.handleCharacterEnemyHit(enemy);
        });
    }

    /**
     * checks whether an enemy hits the character
     */
    isCharacterHitByEnemy(enemy) {
        let character = this.world.character;
        let isAboveEnemy = character.y + character.height - 30 < enemy.y;
        return character.isColliding(enemy) && !character.isHurt() && !isAboveEnemy;
    }

    /**
     * handles an enemy hit on the character
     */
    handleCharacterEnemyHit(enemy) {
        this.world.character.hit();
        this.world.healthbar.setPercentage(this.world.character.energy);
        enemy.isAttacking = true;
        setTimeout(() => {
            enemy.isAttacking = false;
        }, 1000);
    }

    /**
     * checks coin collisions
     */
    checkCollisionsCoins() {
        this.world.level.coins.forEach((coins) => {
            if (this.world.character.isCollidingWithCoin(coins)) this.collectCoin(coins);
        });
    }

    /**
     * collects a coin
     */
    collectCoin(coins) {
        this.world.coinSoundPlay();
        this.world.character.collect(coins);
        this.world.updateCoinbar();
        this.hideCollectedObject(coins);
    }

    /**
     * checks bottle collisions
     */
    checkCollisionsBottles() {
        this.world.level.bottles.forEach((bottle) => {
            if (this.world.character.isColliding(bottle) && !this.maxBottlesReached())
                this.collectBottle(bottle);
        });
    }

    /**
     * collects a bottle
     */
    collectBottle(bottle) {
        this.world.bottleCollectSoundPlay();
        this.world.character.collect(bottle);
        this.world.updateBottlebar();
        this.hideCollectedObject(bottle);
    }

    maxBottlesReached() {
        return this.world.character.bottle >= this.world.maxBottles;
    }

    /**
     * moves a collected object away
     */
    hideCollectedObject(object) {
        if (object.x > 4000) object.x = 10000;
        object.y = 10000;
    }

    /**
     * checks jump collisions with enemies
     */
    checkCollisionsAboveEnemies() {
        this.world.level.enemies.forEach((enemy) => {
            if (this.isJumpingOnEnemy(enemy)) this.handleJumpOnEnemy(enemy);
        });
    }

    /**
     * checks whether the character jumps on an enemy
     */
    isJumpingOnEnemy(enemy) {
        if (enemy.chickenDead()) return false;
        let character = this.world.character;
        let isAboveEnemy = character.y + character.height - 30 < enemy.y;
        return character.isColliding(enemy) && character.speedY < 0 && isAboveEnemy;
    }

    /**
     * handles jumping on an enemy
     */
    handleJumpOnEnemy(enemy) {
        this.hitEnemy(enemy);
        this.world.character.bounce();
    }

    /**
     * checks throwable object collisions
     */
    checkCollisionsThrowableObjects() {
        this.world.throwableObjects.forEach((bottle) => {
            this.world.level.enemies.forEach((enemy) => {
                if (this.isBottleHitEnemy(bottle, enemy)) this.handleBottleHitEnemy(bottle, enemy);
            });
        });
    }

    /**
     * checks whether a bottle hits an enemy
     */
    isBottleHitEnemy(bottle, enemy) {
        return bottle.isColliding(enemy) && !bottle.isSplashed;
    }

    /**
     * handles a bottle hit on an enemy
     */
    handleBottleHitEnemy(bottle, enemy) {
        bottle.splash();
        this.hitEnemy(enemy);
    }

    /**
     * applies damage to an enemy
     */
    hitEnemy(enemy) {
        if (enemy instanceof Endboss) {
            this.hitEndboss(enemy);
        } else if (enemy instanceof Chicken) {
            this.hitChicken(enemy);
        } else if (enemy instanceof Chick) {
            this.hitChick(enemy);
        }
    }

    /**
     * damages the endboss
     */
    hitEndboss(enemy) {
        enemy.endbossLife -= 10;
        enemy.isHurt = true;
        this.world.endbossHurtSoundPlay();
    }

    /**
     * kills a chicken
     */
    hitChicken(enemy) {
        enemy.chickenLife = 0;
        this.world.chickenHurtSoundPlay();
    }

    /**
     * kills a chick
     */
    hitChick(enemy) {
        enemy.chickenLife = 0;
        this.world.chickHurtSoundPlay();
    }
}
