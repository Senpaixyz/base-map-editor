import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useMapData } from '../hooks/useMapData';
import { useMouseEvents } from '../hooks/useMouseEvents';
import { useZoom } from '../hooks/useZoom';
import SpriteInfo from '../components/modal/SpriteInfo'; // Import the SpriteInfo component

const MapContext = createContext();

export const useMap = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
    const { canvasRef, sceneRef, cameraRef, rendererRef, raycasterRef, mouseRef, pinRef, INITIAL_ZOOM, loadMapData } = useMapData();
    const spriteZoom = 1.85; // Define the zoom level for sprite click

    const [sprites, setSprites] = useState([]);
    const selectedSpriteRef = useRef(null);

    const updateSpritePin = (spriteId, pinTexture) => {
        setSprites((prevSprites) =>
            prevSprites.map((sprite) =>
                sprite.id === spriteId ? { ...sprite, pinTexture } : sprite
            )
        );
    };

    const updateSpriteBlink = (spriteId, isBlinking) => {
        setSprites((prevSprites) =>
            prevSprites.map((sprite) =>
                sprite.id === spriteId ? { ...sprite, isBlinking } : { ...sprite, isBlinking: false }
            )
        );
    };

    const { handleMouseMove, handleMouseDown, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd, showModal, setShowModal, spriteInfo } = useMouseEvents(
        canvasRef, sceneRef, cameraRef, raycasterRef, mouseRef, pinRef, spriteZoom, updateSpritePin, updateSpriteBlink, selectedSpriteRef
    );

    const { handleWheel } = useZoom(cameraRef, INITIAL_ZOOM, 6);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('wheel', handleWheel);

        // Touch events for mobile
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchmove', handleTouchMove);
        canvas.addEventListener('touchend', handleTouchEnd);
        canvas.addEventListener('touchcancel', handleTouchEnd);

        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('wheel', handleWheel);

            // Remove touch events
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchend', handleTouchEnd);
            canvas.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, [handleMouseMove, handleMouseDown, handleMouseUp, handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

    return (
        <MapContext.Provider value={{ canvasRef, loadMapData, sprites }}>
            {children}
            <SpriteInfo show={showModal} onClose={() => setShowModal(false)} spriteInfo={spriteInfo} canvasRef={canvasRef} />
        </MapContext.Provider>
    );
};
