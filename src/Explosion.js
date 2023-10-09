class Explosion extends Sprite {
    constructor(params) {
        super({
            ...params,
            imageSrc: params.explosionSrc,
            frames: {
                max: 6,
                hold: 4,
            },
            offset: { x: -10, y: -80 },
        });
    }
}
