import React, { useState, useContext, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import CanvasMap from './components/CanvasMap';
import Controllers from './components/Controllers';
import ImageUpload from './components/ImageUpload';
import LoadMap from './components/LoadMap';
import MapOptions from './components/MapOptions';
import PreviewMap from './components/PreviewMap';
import { Box, VStack } from '@chakra-ui/react';
import { SpriteProvider, SpriteContext } from './contexts/SpriteContext';
import { useShortcutKeys } from './utils/shortcutKeys';

const App = () => {
  const [view, setView] = useState('home');

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const renderView = () => {
    switch (view) {
      case 'create':
        return (
          <>
            <VStack spacing={4}>
              <ConditionalImageUpload />
              <Box className="canvas-container" border="1px solid gray" p={4} borderRadius="md" boxShadow="md">
                <CanvasMap />
                <Controllers />
              </Box>
            </VStack>
            <br />
            <MapOptions />
          </>
        );
      case 'load':
        return <LoadMap />;
      case 'preview':
        return <PreviewMap />;
      default:
        return null;
    }
  };

  return (
    <SpriteProvider>
      <Box p={4}>
        <Header onViewChange={handleViewChange} />
        {renderView()}
        <ShortcutKeysHandler />
      </Box>
    </SpriteProvider>
  );
};

const ConditionalImageUpload = () => {
  const { mapData } = useContext(SpriteContext);
  return !mapData && <ImageUpload />;
};

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
    handleDeleteSprite,
    handleDeselectSprite,
    handleDuplicateSprite
  });

  return null;
};

export default App;
