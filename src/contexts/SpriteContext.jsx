import React, { createContext, useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { loadData, clearAllData } from '../utils/indexedDB';

export const SpriteContext = createContext();

export const SpriteProvider = ({ children }) => {
  const [mapWidth, setMapWidth] = useState(null);
  const [mapHeight, setMapHeight] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [sprites, setSprites] = useState([]);
  const [highlightedCells, setHighlightedCells] = useState(new Set());
  const [draggingSprite, setDraggingSprite] = useState(null);
  const [selectedSprite, setSelectedSprite] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const spriteInputRef = useRef(null);
  const [mapData, setMapData] = useState(null);

  const cellSize = 15; // Default cell size

  useEffect(() => {
    const fetchData = async () => {
      const storedMapId = localStorage.getItem('mapId');
      if (storedMapId) {
        const { mapData, spritesData } = await loadData();
        const currentMap = mapData.find((map) => map.id === storedMapId);

        if (currentMap) {
          const associatedSprites = spritesData.filter((sprite) => sprite.mapId === storedMapId);

          const img = new Image();
          img.src = currentMap.backgroundImage;
          img.onload = () => {
            setMapWidth(currentMap.width);
            setMapHeight(currentMap.height);
            setBackgroundImage(img);

            const loadedSprites = associatedSprites.map((sprite) => {
              const spriteImg = new Image();
              spriteImg.src = sprite.img;
              return new Promise((resolve) => {
                spriteImg.onload = () => {
                  resolve({
                    ...sprite,
                    img: spriteImg,
                  });
                };
              });
            });

            Promise.all(loadedSprites).then(setSprites);
          };
        }
      }
    };

    fetchData();
  }, []);

  const getCellCoordinates = (mouseX, mouseY) => {
    const x = Math.floor(mouseX / cellSize) * cellSize;
    const y = Math.floor(mouseY / cellSize) * cellSize;
    return { x, y };
  };

  const updateHighlightedCells = (sprite) => {
    const newHighlightedCells = new Set();
    const startX = Math.floor(sprite.x / cellSize) * cellSize;
    const startY = Math.floor(sprite.y / cellSize) * cellSize;
    const endX = startX + sprite.width;
    const endY = startY + sprite.height;

    for (let x = startX; x < endX; x += cellSize) {
      for (let y = startY; y < endY; y += cellSize) {
        newHighlightedCells.add(`${x},${y}`);
      }
    }
    setHighlightedCells(new Set(newHighlightedCells));
  };

  const handleMouseMove = (e) => {
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const cell = getCellCoordinates(mouseX, mouseY);
    setHoveredCell(cell);

    if (draggingSprite !== null) {
      const updatedSprites = sprites.map((sprite, index) => {
        if (index === draggingSprite) {
          const updatedSprite = {
            ...sprite,
            x: mouseX - offset.x,
            y: mouseY - offset.y,
          };
          updateHighlightedCells(updatedSprite);
          return updatedSprite;
        }
        return sprite;
      });
      setSprites(updatedSprites);
    }
  };

  const handleMouseDown = (e) => {
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    sprites.forEach((sprite, index) => {
      if (
        mouseX >= sprite.x &&
        mouseX <= sprite.x + sprite.width &&
        mouseY >= sprite.y &&
        mouseY <= sprite.y + sprite.height
      ) {
        setDraggingSprite(index);
        setOffset({
          x: mouseX - sprite.x,
          y: mouseY - sprite.y,
        });
        updateHighlightedCells(sprite);
        setSelectedSprite(index); // Set the selected sprite
      }
    });
  };

  const handleMouseUp = () => {
    setDraggingSprite(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        await clearAllData();
        setMapWidth(img.width);
        setMapHeight(img.height);
        setSprites([]);
        setBackgroundImage(img);
      };
    }
  };

  const handleAddSprite = () => {
    spriteInputRef.current.click();
  };

  const handleSpriteUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/svg+xml')) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const spriteHeight = 7 * cellSize;
        const spriteWidth = spriteHeight * aspectRatio; // Maintain aspect ratio
        const sprite = {
          id: uuidv4(), // Generate unique ID
          name: file.name,
          img: img,
          src: img.src,
          x: (mapWidth - spriteWidth) / 2,
          y: (mapHeight - spriteHeight) / 2,
          width: spriteWidth,
          height: spriteHeight,
          originalWidth: spriteWidth,
          originalHeight: spriteHeight,
          flipH: false,
          flipV: false,
        };
        setSprites([...sprites, sprite]);
      };
    }
  };

  const handleResizeSprite = (direction) => {
    if (selectedSprite !== null) {
      const updatedSprites = sprites.map((sprite, index) => {
        if (index === selectedSprite) {
          const aspectRatio = sprite.originalWidth / sprite.originalHeight;
          const newHeight = direction === 'increase'
            ? Math.min(sprite.height + cellSize, sprite.originalHeight * 3)
            : Math.max(sprite.height - cellSize, sprite.originalHeight / 3);
          const newWidth = newHeight * aspectRatio; // Maintain aspect ratio

          return {
            ...sprite,
            width: newWidth,
            height: newHeight
          };
        }
        return sprite;
      });
      setSprites(updatedSprites);
      if (updatedSprites[selectedSprite]) {
        updateHighlightedCells(updatedSprites[selectedSprite]);
      }
    }
  };

  const handleChangeOrder = (direction) => {
    if (selectedSprite !== null) {
      const index = selectedSprite;
      const updatedSprites = [...sprites];
      if (direction === 'back' && index > 0) {
        const [movedSprite] = updatedSprites.splice(index, 1);
        updatedSprites.unshift(movedSprite);
        setSelectedSprite(0);
      } else if (direction === 'front' && index < updatedSprites.length - 1) {
        const [movedSprite] = updatedSprites.splice(index, 1);
        updatedSprites.push(movedSprite);
        setSelectedSprite(updatedSprites.length - 1);
      }
      setSprites(updatedSprites);
    }
  };

  const handleDeselectSprite = () => {
    setSelectedSprite(null);
    setHighlightedCells(new Set());
  };

  const handleFlipSprite = (direction) => {
    if (selectedSprite !== null) {
      const updatedSprites = sprites.map((sprite, index) => {
        if (index === selectedSprite) {
          return {
            ...sprite,
            flipH: direction === 'horizontal' ? !sprite.flipH : sprite.flipH,
            flipV: direction === 'vertical' ? !sprite.flipV : sprite.flipV,
          };
        }
        return sprite;
      });
      setSprites(updatedSprites);
    }
  };

  const handleDeleteSprite = () => {
    if (selectedSprite !== null) {
      setSprites(sprites.filter((_, index) => index !== selectedSprite));
      handleDeselectSprite();
    }
  };

  const handleDuplicateSprite = () => {
    if (selectedSprite !== null) {
      const spriteToDuplicate = sprites[selectedSprite];
      const duplicatedSprite = {
        ...spriteToDuplicate,
        id: uuidv4(),
        x: spriteToDuplicate.x + 20, // Slightly offset the duplicated sprite
        y: spriteToDuplicate.y + 20
      };
      const updatedSprites = [...sprites, duplicatedSprite];
      setSprites(updatedSprites);
      setSelectedSprite(updatedSprites.length - 1); // Select the duplicated sprite
    }
  };

  return (
    <SpriteContext.Provider
      value={{
        mapWidth,
        mapHeight,
        cellSize,
        hoveredCell,
        backgroundImage,
        setBackgroundImage,
        sprites,
        setSprites,
        highlightedCells,
        draggingSprite,
        selectedSprite,
        offset,
        spriteInputRef,
        handleMouseMove,
        handleMouseDown,
        handleMouseUp,
        handleImageUpload,
        handleAddSprite,
        handleSpriteUpload,
        handleResizeSprite,
        handleChangeOrder,
        handleDeselectSprite,
        handleFlipSprite,
        handleDeleteSprite,
        handleDuplicateSprite,
        mapData,
      }}
    >
      {children}
    </SpriteContext.Provider>
  );
};
