import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Text } from '@chakra-ui/react';

const FileUpload = ({ onDrop, accept, text }) => {
    const onDropCallback = useCallback((acceptedFiles) => {
        onDrop(acceptedFiles);
    }, [onDrop]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onDropCallback,
        accept,
    });

    return (
        <Box
            {...getRootProps()}
            p={6}
            border="2px dashed gray"
            borderRadius="md"
            textAlign="center"
            cursor="pointer"
            _hover={{ borderColor: 'teal.500' }}
        >
            <input {...getInputProps()} />
            {isDragActive ? (
                <Text>Drop the files here ...</Text>
            ) : (
                <Text>{text}</Text>
            )}
        </Box>
    );
};

export default FileUpload;
