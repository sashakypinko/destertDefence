class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.animationId = null;
        this.mouse = {
            x: undefined,
            y: undefined
        }

        this.placementTiles = [];
        this.enemies = [];
        this.deadEnemies = [];
        this.buildings = [];
        this.explosions = [];
        this.activeTile = undefined;
        this.hearts = 10;
        this.coins = 200;
        this.buildingShop = undefined;
        this.level = 0;
    }

    init() {
        const placementTilesData2D = [];

        for (let i = 0; i < placementTilesData.length; i += 20) {
            placementTilesData2D.push(placementTilesData.slice(i, i + 20));
        }

        placementTilesData2D.forEach((row, y) => {
            row.forEach((symbol, x) => {
                if (symbol === 14) {
                    this.placementTiles.push(new PlacementTile({position: {x: x * 64, y: y * 64}}));
                }
            })
        });

        this.updateCoins(this.coins);
        this.updateHearts(this.hearts);
    }

    run() {
        this.init();
        this.runEventListeners();
        this.drawBuildingShop();
        this.animate();
    }

    runEventListeners() {
        this.canvas.addEventListener('click', () => {
            if (this.activeTile) {
                if (this.activeTile.building) {
                    this.buildings.forEach(building => building.isSelected = false);
                    this.activeTile.building.isSelected = true;
                    this.buildingShop.selectedBuildingType = undefined;
                    this.buildings.sort((a, b) => {
                        if (a.isSelected && !b.isSelected) return 1;
                        if (!a.isSelected && b.isSelected) return -1;
                        return 0;
                    });
                    this.showBuildingTools(this.activeTile.building);
                } else if (this.buildingShop.selectedBuildingType) {
                    const buildingParams = Building.params[this.buildingShop.selectedBuildingType];

                    if(buildingParams && this.coins >= buildingParams.price) {
                        const building = new Building({
                            position: {
                                x: this.activeTile.position.x,
                                y: this.activeTile.position.y,
                            },
                            radius: buildingParams.radius,
                            damage: buildingParams.damage,
                            price: buildingParams.price,
                            type: this.buildingShop.selectedBuildingType
                        })
                        this.buildings.push(building);
                        this.buildings.sort((a, b) => a.position.y - b.position.y)
                        this.activeTile.building = building;
                        this.updateCoins(this.coins - buildingParams.price);
                    }
                }
            }
        });

        addEventListener("contextmenu", (e) => {
            e.preventDefault();

            this.activeTile = undefined;
            this.buildingShop.selectedBuildingType = undefined;
        });

        addEventListener('mousemove', e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            this.activeTile = null;
            for (const tile of this.placementTiles) {
                if (
                    this.mouse.x > tile.position.x
                    && this.mouse.x < tile.position.x + tile.size
                    && this.mouse.y > tile.position.y
                    && this.mouse.y < tile.position.y + tile.size
                ) {
                    this.activeTile = tile;
                    break;
                }
            }
        });
    }

    animate() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        this.ctx.drawImage(image, 0, 0);

        this.drawEnemies();
        this.drawExplosions();
        this.drawTiles();
        this.drawBuildings();
        this.drawDeadEnemies();
    }

    drawEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i]
            enemy.update();

            if (enemy.position.x > this.canvas.width || enemy.position.y < 0) {
                this.updateHearts(this.hearts - 1);
                this.enemies.splice(i, 1);

                if (this.hearts === 0) {
                    cancelAnimationFrame(this.animationId);
                    document.querySelector('#gameOver').style.display = 'flex';
                }
            }
        }

        if (this.enemies.length === 0) {
            this.spawnEnemies(5 + this.level * 3);
            this.updateLevel();
        }
    }

    drawTiles() {
        for (const tile of this.placementTiles) {
            tile.update(this.mouse, this.buildingShop.selectedBuildingType);
        }
    }

    drawBuildings() {
        for (const building of this.buildings) {
            building.update();
            building.target = undefined;

            const validEnemies = this.enemies.filter(enemy => {
                const xDifference = enemy.center.x - building.center.x;
                const yDifference = enemy.center.y - building.center.y;
                const distance = Math.hypot(xDifference, yDifference);

                return distance < enemy.size / 2 + building.radius;
            });

            building.target = validEnemies[0];

            this.drawProjectiles(building);
        }
    }

    drawProjectiles(building) {
        for (let i = building.projectiles.length - 1; i >= 0; i--) {
            const projectile = building.projectiles[i];
            projectile.update();

            const xDifference = projectile.enemy.center.x - projectile.center.x;
            const yDifference = projectile.enemy.center.y - projectile.center.y;
            const distance = Math.hypot(xDifference, yDifference);

            if (distance < projectile.enemy.size / 2 + projectile.size / 2) {
                projectile.enemy.health -= building.damage;

                if (projectile.enemy.health <= 0) {
                    const enemyIndex = this.enemies.findIndex(enemy => projectile.enemy === enemy);
                    if (enemyIndex > -1) {
                        this.deadEnemies.push(new DeadEnemy({
                           position: {
                               x: projectile.enemy.position.x,
                               y: projectile.enemy.position.y,
                           },
                            frames: { offset: this.enemies[enemyIndex].frames.offset }
                        }));
                        this.enemies.splice(enemyIndex, 1);
                        this.updateCoins(this.coins + projectile.enemy.reward);
                    }
                }

                this.explosions.push(new Explosion({
                    position: {x: projectile.position.x, y: projectile.position.y},
                    explosionSrc: projectile.explosionSrc,
                }))
                building.projectiles.splice(i, 1);
            }
        }
    }

    drawExplosions() {
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];
            explosion.draw();
            explosion.update();

            if (explosion.frames.current >= explosion.frames.max - 1) {
                this.explosions.splice(i, 1);
            }
        }
    }

    drawDeadEnemies() {
        for (let i = this.deadEnemies.length - 1; i >= 0; i--) {
            const deadEnemy = this.deadEnemies[i];
            deadEnemy.update();

            if (deadEnemy.frames.current >= deadEnemy.frames.max - 1) {
                this.deadEnemies.splice(i, 1);
            }
        }
    }

    spawnEnemies(count) {
        for (let i = 1; i < count + 1; i++) {
            const xOffset = i * 150 - this.level;
            this.enemies.push(
                new Enemy(
                    {
                        position: {
                            x: waypoints[0].x - xOffset,
                            y: waypoints[0].y
                        },
                        frames: {
                          offset: 0
                        },
                        speed: 4,
                        health: 100,
                        reward: 20,
                    }
                )
            );
        }
        for (let i = 1; i < count + 1; i++) {
            const xOffset = i * 150;
            this.enemies.push(
                new Enemy(
                    {
                        position: {
                            x: waypoints[0].x - xOffset,
                            y: waypoints[0].y
                        },
                        frames: {
                            offset: 1
                        },
                        speed: 3,
                        health: 200,
                        reward: 40,
                    }
                )
            );
        }
        for (let i = 1; i < count + 1; i++) {
            const xOffset = i * 150;
            this.enemies.push(
                new Enemy(
                    {
                        position: {
                            x: waypoints[0].x - xOffset,
                            y: waypoints[0].y
                        },
                        frames: {
                            offset: 2
                        },
                        speed: 2,
                        health: 350,
                        reward: 70,
                    }
                )
            );
        }
    }

    showBuildingTools(building) {
        const toolsContainer = document.querySelector('#buildingTools');
        const cancelToolsBtn = document.querySelector('#cancelTools');
        const upgradeBuildingBtn = document.querySelector('#upgradeBuilding');
        const sellBuildingBtn = document.querySelector('#sellBuilding');

        toolsContainer.style.display = 'flex';

        const handleCancelTools = () => {
            toolsContainer.style.display = 'none';
            building.isSelected = false;
            cancelToolsBtn.removeEventListener('click', handleCancelTools);
        };
        const handleUpgradeBuilding = () => {
           if (this.coins >= building.price * 2 && building.level < building.maxLevel) {
                toolsContainer.style.display = 'none';
                building.isSelected = false;
                building.upgrade();
                this.updateCoins(this.coins - building.price);
            }
            upgradeBuildingBtn.removeEventListener('click', handleUpgradeBuilding);
        };
        const handleSellBuilding = () => {
            toolsContainer.style.display = 'none';
            building.isSelected = false;
            this.buildings = this.buildings.filter(item => item !== building);
            this.placementTiles.forEach(tile => {
                if (tile.building === building) {
                    tile.building = undefined;
                }
            })
            this.updateCoins(this.coins + building.price / 2);
            sellBuildingBtn.removeEventListener('click', handleSellBuilding);
        };

        cancelToolsBtn.addEventListener('click', handleCancelTools);
        upgradeBuildingBtn.addEventListener('click', handleUpgradeBuilding);
        sellBuildingBtn.addEventListener('click', handleSellBuilding);

    }

    updateHearts(newValue) {
        this.hearts = newValue;
        document.querySelector('#hearts').innerText = this.hearts;
    }

    updateCoins(newValue) {
        this.coins = newValue;
        document.querySelector('#coins').innerText = this.coins;
    }

    updateLevel() {
        this.level++;
        document.querySelector('#level').innerText = this.level;
    }

    drawBuildingShop() {
        this.buildingShop = new BuildingShop;
        this.buildingShop.draw();
        this.buildingShop.runEventListeners();
    }
}
