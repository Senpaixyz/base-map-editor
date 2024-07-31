import React, { useEffect, useState } from 'react';
import { Box, Heading, Button, HStack } from '@chakra-ui/react';
import { getMaps } from '../utils/indexedDB';

const Header = ({ onViewChange }) => {
  const [hasMaps, setHasMaps] = useState(false);

  useEffect(() => {
    const checkMaps = async () => {
      const maps = await getMaps();
      setHasMaps(maps.length > 0);
    };
    checkMaps();
  }, []);

  const handleCreateNewMap = () => {
    onViewChange('create');
  };

  const handleLoadMap = () => {
    onViewChange('load');
  };

  const handleContinue = () => {
    const mapId = localStorage.getItem('mapId');
    if (mapId) {
      localStorage.setItem('previewMapId', mapId);
      onViewChange('create');
    }
  };

  return (
    <Box mb={4} textAlign="center">
      <Heading as="h1" size="lg" mb={4}>Map Title</Heading>
      <HStack spacing={4} justify="center">
        <Button colorScheme="teal" onClick={handleCreateNewMap}>Create New Map</Button>
        <Button colorScheme="teal" onClick={handleLoadMap}>Load Map</Button>
        {hasMaps && <Button colorScheme="teal" onClick={handleContinue}>Continue</Button>}
      </HStack>
    </Box>
  );
};

export default Header;
