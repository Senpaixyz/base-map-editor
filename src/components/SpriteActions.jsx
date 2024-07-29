import React, { useContext } from 'react';
import { Tooltip, IconButton } from '@chakra-ui/react';
import { FaPlus, FaMinus, FaArrowUp, FaArrowDown, FaArrowsAltH, FaArrowsAltV, FaTrash, FaClone, FaTimes } from 'react-icons/fa';
import { SpriteContext } from '../contexts/SpriteContext';

const SpriteActions = () => {
    const {
        handleResizeSprite,
        handleChangeOrder,
        handleFlipSprite,
        handleDeleteSprite,
        handleDuplicateSprite,
        handleDeselectSprite
    } = useContext(SpriteContext);

    return (
        <>
            <b>______</b>
            <Tooltip label="Resize (+)" aria-label="Resize (+) tooltip">
                <IconButton
                    icon={<FaPlus />}
                    colorScheme="teal"
                    onClick={() => handleResizeSprite('increase')}
                />
            </Tooltip>
            <Tooltip label="Resize (-)" aria-label="Resize (-) tooltip">
                <IconButton
                    icon={<FaMinus />}
                    colorScheme="teal"
                    onClick={() => handleResizeSprite('decrease')}
                />
            </Tooltip>
            <Tooltip label="Bring Front" aria-label="Bring Front tooltip">
                <IconButton
                    icon={<FaArrowUp />}
                    colorScheme="teal"
                    onClick={() => handleChangeOrder('front')}
                />
            </Tooltip>
            <Tooltip label="Bring Back" aria-label="Bring Back tooltip">
                <IconButton
                    icon={<FaArrowDown />}
                    colorScheme="teal"
                    onClick={() => handleChangeOrder('back')}
                />
            </Tooltip>
            <Tooltip label="Flip Horizontal" aria-label="Flip Horizontal tooltip">
                <IconButton
                    icon={<FaArrowsAltH />}
                    colorScheme="teal"
                    onClick={() => handleFlipSprite('horizontal')}
                />
            </Tooltip>
            <Tooltip label="Flip Vertical" aria-label="Flip Vertical tooltip">
                <IconButton
                    icon={<FaArrowsAltV />}
                    colorScheme="teal"
                    onClick={() => handleFlipSprite('vertical')}
                />
            </Tooltip>
            <Tooltip label="Duplicate Sprite" aria-label="Duplicate Sprite tooltip">
                <IconButton
                    icon={<FaClone />}
                    colorScheme="teal"
                    onClick={handleDuplicateSprite}
                />
            </Tooltip>
            <Tooltip label="Delete Sprite" aria-label="Delete Sprite tooltip">
                <IconButton
                    icon={<FaTrash />}
                    colorScheme="red"
                    onClick={handleDeleteSprite}
                />
            </Tooltip>
            <b>______</b>
            <Tooltip label="Cancel" aria-label="Cancel tooltip">
                <IconButton
                    icon={<FaTimes />}
                    colorScheme="red"
                    onClick={handleDeselectSprite}
                />
            </Tooltip>
        </>
    );
};

export default SpriteActions;
