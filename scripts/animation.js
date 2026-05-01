class animation {
    constructor(imageSrc, frameWidth, frameHeight, columns, rows, frameCount, animationSpeed, loop = true) {
        this.image = new Image();
        this.image.src = imageSrc;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.columns = columns;
        this.rows = rows;
        this.frameCount = frameCount;
        this.animationSpeed = animationSpeed;
        this.loop = loop;

        this.currentFrame = 0;
        this.gameFrame = 0;
        this.isDone = false;  //Is the animation repetitive?
    }
    update() {
        if (this.isDone && !this.loop) return;

        this.gameFrame++;

        if (this.gameFrame % this.animationSpeed === 0) {
            this.currentFrame++;
            if (this.currentFrame >= this.frameCount) {
                if (this.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = this.frameCount - 1;
                    this.isDone = true;
                }
            }
        }
    }
    // Replace the draw method in animation.js with this:
    draw(ctx) {
        let currentColumn = this.currentFrame % this.columns;
        let currentRow = Math.floor(this.currentFrame / this.columns);

        let sourceX = currentColumn * this.frameWidth;
        let sourceY = currentRow * this.frameHeight;
        
        // Just draw the frame perfectly centered. No math, no scaling here!
        ctx.drawImage(this.image, sourceX, sourceY, this.frameWidth, this.frameHeight, -this.frameWidth / 2, -this.frameHeight / 2, this.frameWidth, this.frameHeight);
    }
    reset() {
        this.currentFrame = 0;
        this.gameFrame = 0;
        this.isDone = false;
    }
}