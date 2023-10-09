class Enemy extends Sprite {
    constructor(params) {
        super({
            ...params,
            imageSrc: 'img/enemyWalk.png',
            frames: { max: 6, offset: params.frames.offset},
            offset: { x: 20, y: 0 },
        });
        this.size = 100;
        this.waypointIndex = 0;
        this.maxHealth = params.health;
        this.health = params.health;
        this.speed = params.speed;
        this.reward = params.reward;
        this.velocity = { x: 0, y: 0 };
    }

    draw() {
        super.draw();

        ctx.fillStyle = this.color;

        ctx.fillStyle = '#ec2222';
        ctx.fillRect(this.position.x, this.position.y - 20, this.size, 10);

        ctx.fillStyle = '#38ff00';
        ctx.fillRect(this.position.x, this.position.y - 20, this.size * this.health / this.maxHealth, 10);
    }

    update() {
        this.draw();
        super.update();

        const waypoint = waypoints[this.waypointIndex];
        const xDistance = waypoint.x - this.center.x;
        const yDistance = waypoint.y - this.center.y;
        const angle = Math.atan2(yDistance, xDistance);

        this.velocity.x = Math.cos(angle);
        this.velocity.y = Math.sin(angle);

        this.position.x += this.velocity.x * this.speed;
        this.position.y += this.velocity.y * this.speed;

        this.center = {
            x: this.position.x + this.size / 2,
            y: this.position.y + this.size / 2,
        };

        if (
            Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) < Math.abs(this.velocity.x * this.speed)
            && Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) < Math.abs(this.velocity.y * this.speed)
            && this.waypointIndex < waypoints.length - 1
        ) {
            this.waypointIndex++;
        }
    }
}
