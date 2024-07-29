import React, { useContext } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CanvasMap from './components/CanvasMap';
import Controllers from './components/Controllers';
import ImageUpload from './components/ImageUpload';
import LoadMap from './components/LoadMap'; // Import LoadMap component
import MapOptions from './components/MapOptions'; // Import MapOptions component
import PreviewMap from './components/PreviewMap'; // Import PreviewMap component
import { Box, VStack } from '@chakra-ui/react';

import { SpriteProvider, SpriteContext } from './contexts/SpriteContext';
import { useShortcutKeys } from './utils/shortcutKeys';
import { MapProvider } from './contexts/MapContext';

const App = () => {
  return (
    <SpriteProvider>
      <Box p={4}>
        <Header />
        <Routes>
          <Route path="/create" element={<CreateMap />} />
          <Route path="/load" element={<LoadMap />} />
          <Route path="/preview" element={<MapProvider><PreviewMap /></MapProvider>} />
        </Routes>
      </Box>
    </SpriteProvider>
  );
};

const CreateMap = () => (
  <>
    <VStack spacing={4}>
      <ImageUpload />
      <Box className="canvas-container" border="1px solid gray" p={4} borderRadius="md" boxShadow="md">
        <CanvasMap />
        <Controllers />
      </Box>
    </VStack>
    <br />
    <MapOptions /> {/* Add the MapOptions component */}
  </>

);

const ShortcutKeysHandler = () => {
  const {
    handleResizeSprite,
    handleChangeOrder,
    handleRotateSprite,
    handleFlipSprite,
    handleDeleteSprite,
    handleDeselectSprite,
    handleDuplicateSprite,
  } = useContext(SpriteContext);

  useShortcutKeys({
    handleResizeSprite,
    handleChangeOrder,
    handleRotateSprite,
    handleFlipSprite,
    handleDeleteSprite,  // Add the delete handler here
    handleDeselectSprite,
    handleDuplicateSprite
  });

  return null;
};

export default App;
