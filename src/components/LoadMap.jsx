import React, { useState } from 'react';
import { VStack, Button, Text, Box } from '@chakra-ui/react';
import FileUpload from './FileUpload';
import LiveMap from './LiveMap';

const LoadMap = () => {
    const [imageFile, setImageFile] = useState(null);
    const [jsonFile, setJsonFile] = useState(null);
    const [showLiveMap, setShowLiveMap] = useState(false);

    const handleImageDrop = (files) => {
        setImageFile(files[0]);
    };

    const handleJsonDrop = (files) => {
        setJsonFile(files[0]);
    };

    const handleProcess = () => {
        if (!imageFile || !jsonFile) {
            alert('Please upload both image and JSON files.');
            return;
        }
        setShowLiveMap(true);
    };

    return (
        <VStack spacing={4}>
            <FileUpload
                onDrop={handleImageDrop}
                accept={{ 'image/*': [] }}
                text="Upload Image Map here"
            />
            {imageFile && (
                <Box>
                    <Text>Selected Image: {imageFile.name}</Text>
                </Box>
            )}
            <FileUpload
                onDrop={handleJsonDrop}
                accept={{ 'application/json': [] }}
                text="Upload Sprite/Tileset here"
            />
            {jsonFile && (
                <Box>
                    <Text>Selected JSON: {jsonFile.name}</Text>
                </Box>
            )}
            <Button colorScheme="teal" onClick={handleProcess}>Process</Button>
            {showLiveMap && <LiveMap imageFile={imageFile} jsonFile={jsonFile} />}
        </VStack>
    );
};

export default LoadMap;
