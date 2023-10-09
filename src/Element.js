class Element {
    constructor({position = {x: 0, y: 0}}) {
        this.position = position;
        this.color = '#000000';
        this.size = 64;
        this.center = {
            x: this.position.x + this.size / 2,
            y: this.position.y + this.size / 2,
        };
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
    }
}
