class BuildingShop {
    constructor() {
        this.selectedBuildingType = undefined;
    }

    draw() {
        const buildingShopContainer = document.querySelector('#buildingShop');

        Object.entries(Building.params).forEach(([type, {icon}]) => {
            buildingShopContainer.appendChild(this.createItem(icon, type));
        })
    }

    runEventListeners() {
        for (const btn of document.getElementsByClassName('shop-item')) {
            const handlePlaceBuilding = (e) => {
                this.selectedBuildingType = e.currentTarget.dataset.type;
            };

            btn.addEventListener('click', handlePlaceBuilding.bind(this));
        }
    }

    createItem (src, type) {
        const image = document.createElement('img');
        const shopItem = document.createElement('div');
        image.src = src;
        shopItem.className = 'shop-item';
        shopItem.dataset.type = type;

        image.width = 96;
        image.height = 96;

        shopItem.appendChild(image);

        return shopItem;
    }
}
