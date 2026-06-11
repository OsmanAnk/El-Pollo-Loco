class DrawableObject {
    x = 120;
    y = 280;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;

    /**
     * loads a single image
     */
    loadImage(path) {
        this.img = new Image(); //gleich wie:this.img = document.getElementById("Image") <img id="image">
        this.img.src = path;
    }

    /**
     * loads multiple images into the cache
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image()
            img.src = path
            this.imageCache[path] = img;
        })
    }

    /**
     * draws the object on the canvas
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * draws a debug frame when allowed
     */
    drawFrame(ctx) {
        if (this.canDrawFrame()) this.drawDebugFrame(ctx);
    }

    /**
     * checks whether a debug frame can be drawn
     */
    canDrawFrame() {
        return this instanceof Character || this instanceof Chicken || this instanceof Chick || this instanceof Coin || this instanceof Bottle || this instanceof Endboss;
    }

    /**
     * draws the red debug collision frame
     */
    drawDebugFrame(ctx) {
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = "red";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    /**
     * sets the matching statusbar percentage image
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.images[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * resolves the image index for the current percentage
     */
    resolveImageIndex() {
        return Math.min(5, Math.floor(this.percentage / 20));
    }
}
