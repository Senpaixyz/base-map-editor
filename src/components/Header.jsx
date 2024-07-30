import React, { useState, useEffect, useContext } from 'react';
import { Box, Heading, Button, HStack } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SpriteContext } from '../contexts/SpriteContext';
import { getMaps, loadData } from '../utils/indexedDB';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [hasMaps, setHasMaps] = useState(false);
    const { setMapWidth, setMapHeight, setBackgroundImage, setSprites } = useContext(SpriteContext);

    useEffect(() => {
        const checkMaps = async () => {
            const maps = await getMaps();
            setHasMaps(maps.length > 0);
        };
        checkMaps();
    }, []);

    const handleCreateNewMap = () => {
        navigate('/create');
    };

    const handleLoadMap = () => {
        navigate('/load');
    };

    const handleContinue = async () => {
        const { mapData, spritesData } = await loadData();
        if (mapData.length > 0) {
            const latestMap = mapData[mapData.length - 1];
            const associatedSprites = spritesData.filter(sprite => sprite.mapId === latestMap.id);

            setMapWidth(latestMap.width);
            setMapHeight(latestMap.height);

            const img = new Image();
            img.src = latestMap.backgroundImage;
            img.onload = () => {
                setBackgroundImage(img);

                const spritesWithImages = associatedSprites.map(sprite => {
                    const spriteImg = new Image();
                    spriteImg.src = sprite.img;
                    spriteImg.width = sprite.width;
                    spriteImg.height = sprite.height;
                    spriteImg.originalWidth = sprite.originalWidth;
                    spriteImg.originalHeight = sprite.originalHeight;
                    return { ...sprite, img: spriteImg };
                });

                Promise.all(
                    spritesWithImages.map(
                        sprite =>
                            new Promise(resolve => {
                                sprite.img.onload = () => resolve(sprite);
                            })
                    )
                ).then(loadedSprites => {
                    setSprites(loadedSprites);
                    navigate(`/create?mapId=${latestMap.id}`);
                });
            };
            img.onerror = (error) => {
                console.error("Error loading background image:", error);
            };
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    const isRoot = location.pathname === '/';
    const isSubRoute = location.pathname.startsWith('/create') || location.pathname.startsWith('/load');

    return (
        <Box mb={4} textAlign="center">
            <Heading as="h1" size="lg" mb={4}>Map Title 12345</Heading>
            <HStack spacing={4} justify="center">
                {isRoot && (
                    <>
                        <Button colorScheme="teal" onClick={handleCreateNewMap}>Create New Map</Button>
                        <Button colorScheme="teal" onClick={handleLoadMap}>Load Map</Button>
                        {hasMaps && <Button colorScheme="teal" onClick={handleContinue}>Continue</Button>}
                    </>
                )}
                {isSubRoute && (
                    <Button colorScheme="teal" onClick={handleBack}>Back</Button>
                )}
            </HStack>
        </Box>
    );
};

export default Header;
