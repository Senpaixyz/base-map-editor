import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMap } from '../contexts/MapContext';

const PreviewMap = () => {
    const location = useLocation();
    const { canvasRef, loadMapData } = useMap();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const mapId = urlParams.get('mapId');
        loadMapData(mapId);
    }, [location.search, loadMapData]);

    return <canvas ref={canvasRef} style={{ border: '1px solid black' }} />;
};

export default PreviewMap;
