import React, { useContext } from 'react';
import { VStack, Input, Tooltip, IconButton } from '@chakra-ui/react';
import { SpriteContext } from '../contexts/SpriteContext';
import SaveLoadControls from './SaveLoadControls';
import SpriteActions from './SpriteActions';
import ShortcutKeyInfo from './ShortcutKeyInfo';
import ImageUpload from './ImageUpload';
import { LuImagePlus } from "react-icons/lu";

const Controllers = () => {
    const {
        mapWidth,
        sprites,
        backgroundImage,
        handleAddSprite,
        spriteInputRef,
        handleSpriteUpload,
        selectedSprite
    } = useContext(SpriteContext);

    return (
        (sprites && backgroundImage) && <VStack align="start" spacing={4} className="controllers">
            {mapWidth && (
                <>
                    <SaveLoadControls isSaveDisabled={sprites.length === 0 || selectedSprite !== null} />
                    <Tooltip label="Add Sprite" aria-label="Add Sprite tooltip">
                        <IconButton
                            icon={<LuImagePlus />}
                            colorScheme="teal"
                            onClick={handleAddSprite}
                        />
                    </Tooltip>
                    <Input
                        type="file"
                        ref={spriteInputRef}
                        accept={{ 'image/*': [] }}
                        onChange={handleSpriteUpload}
                        display="none"
                    />
                </>
            )}
            {selectedSprite !== null && (
                <>
                    <SpriteActions />
                    <ShortcutKeyInfo />
                </>
            )}
        </VStack>
    );
};

export default Controllers;
