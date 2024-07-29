import React, { useContext, useEffect, useRef } from 'react';
import { SpriteContext } from '../contexts/SpriteContext';
import { drawGrid } from '../utils/drawGrid';

const CanvasMap = () => {
    const canvasRef = useRef(null);
    const {
        mapWidth,
        mapHeight,
        cellSize,
        backgroundImage,
        sprites,
        highlightedCells,
        hoveredCell,
        handleMouseMove,
        handleMouseDown,
        handleMouseUp,
    } = useContext(SpriteContext);

    useEffect(() => {
        if (mapWidth && mapHeight && backgroundImage) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            drawGrid(ctx, mapWidth, mapHeight, cellSize, backgroundImage, sprites, highlightedCells, hoveredCell);

            canvas.addEventListener('mousemove', handleMouseMove);
            canvas.addEventListener('mousedown', handleMouseDown);
            canvas.addEventListener('mouseup', handleMouseUp);
            canvas.addEventListener('mouseleave', handleMouseUp);

            return () => {
                canvas.removeEventListener('mousemove', handleMouseMove);
                canvas.removeEventListener('mousedown', handleMouseDown);
                canvas.removeEventListener('mouseup', handleMouseUp);
                canvas.removeEventListener('mouseleave', handleMouseUp);
            };
        }
    }, [mapWidth, mapHeight, backgroundImage, sprites, highlightedCells, hoveredCell, handleMouseMove, handleMouseDown, handleMouseUp]);

    return mapWidth && mapHeight && backgroundImage ? <canvas id="canvas" ref={canvasRef} width={mapWidth} height={mapHeight}></canvas> : null;
};

export default CanvasMap;
