class DeadEnemy extends Sprite {
    constructor(params) {
        super({
            ...params,
            imageSrc: 'img/deadEnemy.png',
            frames: { max: 12, hold: 5, offset: params.frames.offset },
            offset: { x: 0, y: -35 },
        });
    }


    update() {
        super.draw();
        super.update();

        this.position.x++;
    }
}
