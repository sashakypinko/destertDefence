const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 896;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image;
image.src = 'img/gameMap.png';

image.onload = () => {
    ctx.drawImage(image, 0, 0);
};

const game = new Game(canvas, ctx);
game.run();
