import React, { useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Text } from '@chakra-ui/react';
import { SpriteContext } from '../contexts/SpriteContext';

const ImageUpload = () => {
    const { handleImageUpload, backgroundImage } = useContext(SpriteContext);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            handleImageUpload({ target: { files: [file] } });
        }
    }, [handleImageUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

    return !backgroundImage && (
        <Box
            {...getRootProps()}
            border="2px dashed"
            borderColor={isDragActive ? 'teal.500' : 'gray.200'}
            padding="4"
            borderRadius="md"
            textAlign="center"
            cursor="pointer"
        >
            <input {...getInputProps()} />
            {isDragActive ? (
                <Text>Drop the files here ...</Text>
            ) : (
                <Text>Drag 'n' drop some files here, or click to select files</Text>
            )}
        </Box>
    );
};

export default ImageUpload;
