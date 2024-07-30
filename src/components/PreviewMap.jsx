import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useMap } from '../contexts/MapContext';

const PreviewMap = ({ showPins = true }) => {
    const location = useLocation();
    const { canvasRef, loadMapData } = useMap();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const mapId = urlParams.get('mapId');
        loadMapData(mapId, showPins);
    }, [location.search, loadMapData, showPins]);

    return <canvas ref={canvasRef} style={{ border: '1px solid black' }} />;
};

export default PreviewMap;
