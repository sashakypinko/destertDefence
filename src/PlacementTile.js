class PlacementTile extends Sprite {
    constructor(params) {
        super({
            ...params,
            imageSrc: '',
            frames: { max: 1, hold: 1 },
            offset: { x: 0, y: -8 },
        });
        this.building = undefined;
    }

    update({x, y}, selectedBuildingType) {
        this.draw();
        if (
            x > this.position.x
            && x < this.position.x + this.size
            && y > this.position.y
            && y < this.position.y + this.size
        ) {
            this.updateImageSrc(Building.params[selectedBuildingType]?.icon || '');
        } else {
            this.updateImageSrc('');
        }
    }
}
