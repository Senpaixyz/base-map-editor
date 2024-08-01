export const drawGrid = (ctx, mapWidth, mapHeight, cellSize, backgroundImage, sprites, highlightedCells, hoveredCell) => {
    ctx.clearRect(0, 0, mapWidth, mapHeight);

    if (backgroundImage) {
        ctx.drawImage(backgroundImage, 0, 0, mapWidth, mapHeight);
    }

    ctx.strokeStyle = '#000';

    for (let x = 0; x <= mapWidth; x += cellSize) {
        for (let y = 0; y <= mapHeight; y += cellSize) {
            ctx.beginPath();
            ctx.rect(x, y, cellSize, cellSize);
            ctx.stroke();

            const cellKey = `${x},${y}`;
            if (highlightedCells.has(cellKey)) {
                ctx.fillStyle = 'red';
                ctx.fill();
            } else if (hoveredCell && hoveredCell.x === x && hoveredCell.y === y) {
                ctx.fillStyle = 'blue';
                ctx.fill();
            }
        }
    }

    // console.log("SPRITES: ", sprites)

    sprites.forEach(sprite => {
        ctx.save();
        ctx.translate(sprite.x + sprite.width / 2, sprite.y + sprite.height / 2);
        ctx.rotate((sprite.rotation * Math.PI) / 180);
        ctx.scale(sprite.flipH ? -1 : 1, sprite.flipV ? -1 : 1);
        ctx.drawImage(
            sprite.img,
            -sprite.width / 2,
            -sprite.height / 2,
            sprite.width,
            sprite.height
        );
        ctx.restore();
    });
};
