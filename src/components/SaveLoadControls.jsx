import React, { useContext } from 'react';
import { Tooltip, IconButton } from '@chakra-ui/react';
import { FaFileExport, FaSave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { SpriteContext } from '../contexts/SpriteContext';
import { saveData, loadData } from '../utils/indexedDB';
import { v4 as uuidv4 } from 'uuid';
import { getBase64Image, convertImageToBase64 } from '../utils/imageUtils';
import JSZip from 'jszip';

const SaveLoadControls = ({ isSaveDisabled }) => {
    const { sprites, backgroundImage } = useContext(SpriteContext);
    const navigate = useNavigate();

    const handleExport = async () => {
        const { mapData, spritesData } = await loadData();

        const mapJson = JSON.stringify(mapData, null, 2);
        const spritesJson = JSON.stringify(spritesData, null, 2);

        const zip = new JSZip();
        zip.file('map.json', mapJson);
        zip.file('sprites.json', spritesJson);

        const content = await zip.generateAsync({ type: 'blob' });

        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'map_and_sprites.zip';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSave = async () => {
        let mapId = localStorage.getItem('mapId');
        const backgroundImageName = backgroundImage?.src.split('/').pop() || uuidv4();

        if (!mapId) {
            mapId = uuidv4();
            localStorage.setItem('mapId', mapId);
            navigate(`${location.pathname}`);
        }

        const mapData = {
            id: mapId,
            name: `Map_${backgroundImageName}`,
            backgroundImage: backgroundImage ? getBase64Image(backgroundImage) : null,
            x: backgroundImage.x,
            y: backgroundImage.y,
            width: backgroundImage.width,
            height: backgroundImage.height,
        };

        const spriteData = await Promise.all(sprites.map((sprite) => {
            return {
                id: sprite.id || uuidv4(),
                name: sprite.name,
                src: sprite.src,
                img: (sprite.img.src.startsWith('data:image')) ? sprite.img.src : getBase64Image(sprite.img),  // Convert image to base64
                x: sprite.x,
                y: sprite.y,
                width: sprite.width,
                height: sprite.height,
                flipH: sprite.flipH,
                flipV: sprite.flipV,
                mapId: mapId,
                originalWidth: sprite.originalWidth, // Add originalWidth
                originalHeight: sprite.originalHeight, // Add originalHeight
            }
        }));

        await saveData(mapData, spriteData);
        window.alert('Data saved successfully!');
    };

    return (
        <>
            <Tooltip label="Export" aria-label="Export tooltip">
                <IconButton
                    icon={<FaFileExport />}
                    colorScheme="teal"
                    onClick={handleExport}
                    isDisabled={isSaveDisabled}
                />
            </Tooltip>
            <Tooltip label="Save" aria-label="Save tooltip">
                <IconButton
                    icon={<FaSave />}
                    colorScheme="teal"
                    onClick={handleSave}
                    isDisabled={isSaveDisabled}
                />
            </Tooltip>
        </>
    );
};

export default SaveLoadControls;
