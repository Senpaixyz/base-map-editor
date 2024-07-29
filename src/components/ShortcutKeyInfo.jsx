import React from 'react';
import { Box, Text, Tooltip, IconButton } from '@chakra-ui/react';
import { FaInfoCircle } from 'react-icons/fa';

const ShortcutKeyInfo = () => (
    <Tooltip
        label={
            <Box>
                <Text fontSize="sm">
                    <p>Shortcut Keys:</p>
                    <ul>
                        <li>Resize (+): + or Mouse Wheel forward</li>
                        <li>Resize (-): - or Mouse Wheel backward</li>
                        <li>Bring Front: Arrow Up</li>
                        <li>Bring Back: Arrow Down</li>
                        <li>Flip Horizontal: H</li>
                        <li>Flip Vertical: V</li>
                        <li>Delete: Backspace</li>
                        <li>Duplicate: D</li>
                        <li>Cancel: Right Click</li>
                    </ul>
                </Text>
            </Box>
        }
        aria-label="Shortcut keys tooltip"
        hasArrow
        placement="right"
    >
        <IconButton
            icon={<FaInfoCircle />}
            colorScheme="blue"
            aria-label="Info"
        />
    </Tooltip>
);

export default ShortcutKeyInfo;
