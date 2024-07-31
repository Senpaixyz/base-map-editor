import React, { useState, useEffect, useContext } from 'react';
import { Box, Heading, SimpleGrid, Image as ChakraImage, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getMaps } from '../utils/indexedDB';
import { SpriteContext } from '../contexts/SpriteContext';
import ImageUpload from './ImageUpload';

const Home = () => {
  const [maps, setMaps] = useState([]);
  const navigate = useNavigate();
  const { setMapWidth, setMapHeight, setBackgroundImage, setSprites } = useContext(SpriteContext);

  useEffect(() => {
    const fetchMaps = async () => {
      const mapsData = await getMaps();
      setMaps(mapsData);
    };
    fetchMaps();
  }, []);

  const handleContinue = async (mapId) => {
    navigate(`/create?mapId=${mapId}`);
  };

  return (
    <Box p={4}>
      <Heading as="h1" size="lg" mb={4} textAlign="center">Map Title</Heading>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4}>
        {maps.map(map => (
          <Box
            key={map.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            transition="transform 0.2s, box-shadow 0.2s"
            _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
          >
            <ChakraImage src={map.backgroundImage} alt={map.name} />
            <Box p={4}>
              <Text fontWeight="bold" mb={2}>{map.name}</Text>
              <Button colorScheme="teal" onClick={() => handleContinue(map.id)}>Continue</Button>
            </Box>
          </Box>
        ))}
        <Box
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="md"
          transition="transform 0.2s, box-shadow 0.2s"
          _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
        >
          <ImageUpload />
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default Home;
