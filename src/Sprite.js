class Sprite extends Element {
    constructor(params) {
        super(params);

        this.image = new Image();
        this.image.src = params.imageSrc;
        this.frames = {
            max: params.frames.max,
            height: params.frames.height || 64,
            offset: params.frames.offset || 0,
            current: 0,
            elapsed: 0,
            hold: params.frames.hold || 12,
        };
        this.offset = params.offset || {x: 0, y: 0}
    }

    draw() {
        const cropWidth = this.image.width / this.frames.max
        const crop = {
            position: {
                x: cropWidth * this.frames.current,
                y: this.frames.height * this.frames.offset,
            },
            width: cropWidth,
            height: this.frames.height,
        }
        if (this.image.src) {
            ctx.drawImage(
                this.image,
                crop.position.x,
                crop.position.y,
                crop.width,
                crop.height,
                this.position.x + this.offset.x,
                this.position.y + this.offset.y,
                crop.width,
                crop.height
            )
        }
    }

    updateImageSrc(imageSrc) {
        this.image = new Image();
        this.image.src = imageSrc;
    }

    update() {
        this.frames.elapsed++;
        if(this.frames.elapsed % this.frames.hold === 0) {
            this.frames.current++;
            if(this.frames.current >= this.frames.max) {
                this.frames.current = 0;
            }
        }
    }
}
