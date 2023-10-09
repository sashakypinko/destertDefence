class Building extends Sprite {
    constructor(params) {
        super({
            ...params,
            imageSrc: 'img/buildings.png',
            frames: { max: 23, hold: 2, offset: Building.params[params.type]?.offset || 0 },
            offset: { x: 0, y: -8 },
        });
        this.radius = params.radius;
        this.price = params.price;
        this.target = undefined;
        this.elapsedSpawnTime = 0;
        this.maxLevel = 3;
        this.level = 1;
        this.damage = params.damage;
        this.projectiles = [];
        this.isSelected = false;
        this.type = params.type;
    }

    update() {
        super.draw();

        if(this.target || !this.target && this.frames.current !== 0) {
            super.update();
        }

        if (this.target && this.frames.current === 6 && this.frames.elapsed % this.frames.hold === 0) {
            this.shoot();
        }

        if(this.isSelected) {
            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(85,255,85,0.24)'
            ctx.fill();
        }

        this.elapsedSpawnTime++;
    }

    shoot() {
        const projectileParams = Building.params[this.type]?.projectileParams;

        if(projectileParams) {
            this.projectiles.push(
                new Projectile({
                    position: {
                        x: this.center.x - 10,
                        y: this.center.y - 40
                    },
                    enemy: this.target,
                    speed: projectileParams.speed,
                    projectileSrc: projectileParams.projectileSrc,
                    explosionSrc: projectileParams.explosionSrc,
                })
            );
        }
    }

    upgrade() {
        this.level++;
        this.frames.offset++;
        this.price *= 2;
        this.damage *= 1.3;
    }
}

Building.TYPE_1 = 'TYPE_1';
Building.TYPE_2 = 'TYPE_2';
Building.TYPE_3 = 'TYPE_3';
Building.TYPE_4 = 'TYPE_4';

Building.params = {
    [Building.TYPE_1]: {
        icon: 'img/1_buildingPreview.png',
        offset: 0,
        price: 50,
        damage: 15,
        radius: 250,
        projectileParams: {
            projectileSrc: 'img/1_projectile.png',
            explosionSrc: 'img/1_explosion.png',
            speed: 8,
        }
    },
    [Building.TYPE_2]: {
        icon: 'img/2_buildingPreview.png',
        offset: 3,
        price: 90,
        damage: 25,
        radius: 300,
        projectileParams: {
            projectileSrc: 'img/2_projectile.png',
            explosionSrc: 'img/2_explosion.png',
            speed: 15,
        }
    },
    [Building.TYPE_3]: {
        icon: 'img/3_buildingPreview.png',
        offset: 6,
        price: 140,
        damage: 40,
        radius: 380,
        projectileParams: {
            projectileSrc: 'img/3_projectile.png',
            explosionSrc: 'img/3_explosion.png',
            speed: 12,
        }
    },
    [Building.TYPE_4]: {
        icon: 'img/4_buildingPreview.png',
        offset: 9,
        price: 250,
        damage: 80,
        radius: 450,
        projectileParams: {
            projectileSrc: 'img/4_projectile.png',
            explosionSrc: 'img/4_explosion.png',
            speed: 6,
        }
    }
}
