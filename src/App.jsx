import React, { useContext } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CanvasMap from './components/CanvasMap';
import Controllers from './components/Controllers';
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
        <Routes>
          <Route path="/" element={<Home />} />
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
