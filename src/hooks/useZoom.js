import { useCallback } from 'react';

export const useZoom = (cameraRef, INITIAL_ZOOM, MAX_ZOOM) => {
    const handleWheel = useCallback((event) => {
        const camera = cameraRef.current;
        if (camera) {
            const zoomFactor = 1.1;
            if (event.deltaY < 0 && camera.zoom < MAX_ZOOM) {
                camera.zoom = Math.min(camera.zoom * zoomFactor, MAX_ZOOM);
            } else if (event.deltaY > 0 && camera.zoom > INITIAL_ZOOM.current) {
                camera.zoom = Math.max(camera.zoom / zoomFactor, INITIAL_ZOOM.current);
            }
            camera.updateProjectionMatrix();
        }
    }, [cameraRef, INITIAL_ZOOM, MAX_ZOOM]);

    return { handleWheel };
};
