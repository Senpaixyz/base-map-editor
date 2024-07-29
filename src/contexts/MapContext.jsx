import React, { createContext, useContext, useEffect } from 'react';
import { useMapData } from '../hooks/useMapData';
import { useMouseEvents } from '../hooks/useMouseEvents';
import { useZoom } from '../hooks/useZoom';

const MapContext = createContext();

export const useMap = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
    const { canvasRef, sceneRef, cameraRef, rendererRef, raycasterRef, mouseRef, pinRef, INITIAL_ZOOM, loadMapData } = useMapData();
    const { handleMouseMove, handleMouseDown, handleMouseUp, handleClick } = useMouseEvents(canvasRef, sceneRef, cameraRef, raycasterRef, mouseRef, pinRef);
    const { handleWheel } = useZoom(cameraRef, INITIAL_ZOOM, 6);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('click', handleClick);
        canvas.addEventListener('wheel', handleWheel);

        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('click', handleClick);
            canvas.removeEventListener('wheel', handleWheel);
        };
    }, [handleMouseMove, handleMouseDown, handleMouseUp, handleClick, handleWheel]);

    return (
        <MapContext.Provider value={{ canvasRef, loadMapData }}>
            {children}
        </MapContext.Provider>
    );
};
