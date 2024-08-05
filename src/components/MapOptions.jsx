import React, { useContext } from 'react';
import { Button, HStack, Checkbox } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SpriteContext } from '../contexts/SpriteContext';
import { deleteMapAndSpritesByMapId } from '../utils/indexedDB';
import { useOptions } from '../contexts/MapEditorInstanceContext';

const MapOptions = () => {
    const { backgroundImage, setSprites, setBackgroundImage } = useContext(SpriteContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { options } = useOptions();

    const handleDelete = async () => {
        const urlParams = new URLSearchParams(location.search);
        const mapId = urlParams.get('mapId');
        if (mapId) {
            await deleteMapAndSpritesByMapId(mapId);
            await options.current.deleteMap(backgroundImage, mapId);
            setSprites([]);
            setBackgroundImage(null);
            navigate('/');
        }
        else {
            window.alert('Failed to Delete Map');
        }
    };

    const handleViewPreview = () => {
        const urlParams = new URLSearchParams(location.search);
        const mapId = urlParams.get('mapId');
        const previewUrl = `/#/preview?mapId=${mapId}`;
        window.open(previewUrl, '_blank');
    };

    return (
        <HStack spacing={4} justifyContent="center">
            <Checkbox>Show Grid</Checkbox>
            <Button colorScheme="red" onClick={handleDelete}>
                Delete Map
            </Button>
            <Button colorScheme="teal" onClick={handleViewPreview}>
                View Live
            </Button>
        </HStack>
    );
};

export default MapOptions;
