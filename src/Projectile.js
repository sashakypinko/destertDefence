class Projectile extends Sprite {
    constructor(params) {
        super({ ...params, imageSrc: params.projectileSrc, frames: { max: 1 } });
        this.velocity = {
            x: 0,
            y: 0
        };
        this.enemy = params.enemy;
        this.size = 20;
        this.speed = params.speed;
        this.explosionSrc = params.explosionSrc;
    }

    draw() {
        super.draw();

        this.center = {
            x: this.position.x + this.size / 2,
            y: this.position.y + this.size / 2,
        };
    }

    update() {
        this.draw();

        const angle = Math.atan2(
            this.enemy.center.y - this.position.y,
            this.enemy.center.x - this.position.x
        )

        this.velocity.x = Math.cos(angle) * this.speed;
        this.velocity.y = Math.sin(angle) * this.speed;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
