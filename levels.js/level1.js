let level1;

/**
 * initializes level one
 */
function initLevel1() {

    level1 = new Level(
        [
            new Chicken(1300),
            new Chicken(1400),
            new Chicken(1500),
            new Chicken(3000),
            new Chicken(3100),
            new Chicken(3200),
            new Chicken(4200),
            new Chicken(4300),
            new Chicken(4400),
            new Chick(500),
            new Chick(600),
            new Chick(700),
            new Chick(2200),
            new Chick(2300),
            new Chick(2400),
            new Chick(3800),
            new Chick(3900),
            new Chick(4000),
            new Endboss(4800),
            
            // new Endboss(1000)
        ],

        [
            new Cloud(0),
            new Cloud(1),
            new Cloud(2),
            new Cloud(3),
            new Cloud(4),
            new Cloud(5),
            new Cloud(6),
            new Cloud(7)
        ],

        [
            new BackgroundObject("assets/img/5_background/layers/air.png", -720),
            new BackgroundObject("assets/img/5_background/layers/3_third_layer/2.png", -720),
            new BackgroundObject("assets/img/5_background/layers/2_second_layer/2.png", -720),
            new BackgroundObject("assets/img/5_background/layers/1_first_layer/2.png", -720),

            new BackgroundObject("assets/img/5_background/layers/air.png", 0),
            new BackgroundObject("assets/img/5_background/layers/3_third_layer/1.png", 0),
            new BackgroundObject("assets/img/5_background/layers/2_second_layer/1.png", 0),
            new BackgroundObject("assets/img/5_background/layers/1_first_layer/1.png", 0),
            new BackgroundObject("assets/img/5_background/layers/air.png", 720),
            new BackgroundObject("assets/img/5_background/layers/3_third_layer/2.png", 720),
            new BackgroundObject("assets/img/5_background/layers/2_second_layer/2.png", 720),
            new BackgroundObject("assets/img/5_background/layers/1_first_layer/2.png", 720),

            new BackgroundObject("assets/img/5_background/layers/air.png", 720 * 2),
            new BackgroundObject("assets/img/5_background/layers/3_third_layer/1.png", 720 * 2),
            new BackgroundObject("assets/img/5_background/layers/2_second_layer/1.png", 720 * 2),
            new BackgroundObject("assets/img/5_background/layers/1_first_layer/1.png", 720 * 2),
            new BackgroundObject("assets/img/5_background/layers/air.png", 720 * 3),
            new BackgroundObject("assets/img/5_background/layers/3_third_layer/2.png", 720 * 3),
            new BackgroundObject("assets/img/5_background/layers/2_second_layer/2.png", 720 * 3),
            new BackgroundObject("assets/img/5_background/layers/1_first_layer/2.png", 720 * 3),

            new BackgroundObject("assets/img/5_background/layers/air.png", 720 * 4),
            new BackgroundObject("assets/img/5_background/layers/3_third_layer/1.png", 720 * 4),
            new BackgroundObject("assets/img/5_background/layers/2_second_layer/1.png", 720 * 4),
            new BackgroundObject("assets/img/5_background/layers/1_first_layer/1.png", 720 * 4),
            new BackgroundObject("assets/img/5_background/layers/air.png", 720 * 5),
            new BackgroundObject("assets/img/5_background/layers/3_third_layer/2.png", 720 * 5),
            new BackgroundObject("assets/img/5_background/layers/2_second_layer/2.png", 720 * 5),
            new BackgroundObject("assets/img/5_background/layers/1_first_layer/2.png", 720 * 5),

            new BackgroundObject("assets/img/5_background/layers/air.png", 720 * 6),
            new BackgroundObject("assets/img/5_background/layers/3_third_layer/1.png", 720 * 6),
            new BackgroundObject("assets/img/5_background/layers/2_second_layer/1.png", 720 * 6),
            new BackgroundObject("assets/img/5_background/layers/1_first_layer/1.png", 720 * 6),
            new BackgroundObject("assets/img/5_background/layers/air.png", 720 * 7),
            new BackgroundObject("assets/img/5_background/layers/3_third_layer/2.png", 720 * 7),
            new BackgroundObject("assets/img/5_background/layers/2_second_layer/2.png", 720 * 7),
            new BackgroundObject("assets/img/5_background/layers/1_first_layer/2.png", 720 * 7),
        ],

        [
            new Coin(300, 320),
            new Coin(400, 320),
            new Coin(500, 320),

            new Coin(1000, 80),
            new Coin(1100, 80),
            new Coin(1200, 80),

            new Coin(1700, 320),
            new Coin(1800, 320),
            new Coin(1900, 320),

            new Coin(2500, 80),
            new Coin(2600, 80),
            new Coin(2700, 80),

            new Coin(3300, 320),
            new Coin(3400, 320),
            new Coin(3500, 320),

            new Coin(4000, 80),
            new Coin(4100, 80),
            new Coin(4200, 80),

            new Coin(4500, 320),
            new Coin(4600, 320),
            new Coin(4700, 320),
        ],

        [
            // new Bottle(300),
            // new Bottle(300),
            // new Bottle(300),
            // new Bottle(300),
            // new Bottle(300),
            // new Bottle(300),
            // new Bottle(300),
            // new Bottle(300),

            new Bottle(700),
            new Bottle(775),
            new Bottle(850),

            new Bottle(1400),
            new Bottle(1475),

            new Bottle(2200),
            new Bottle(2275),

            new Bottle(2950),
            new Bottle(3025),

            new Bottle(3700),
            new Bottle(3775),

            new Bottle(4200),
            new Bottle(4275),
        ]
    );
}
