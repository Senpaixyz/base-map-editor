import { useEffect } from 'react';

export const useShortcutKeys = ({
    handleResizeSprite,
    handleChangeOrder,
    handleRotateSprite,
    handleFlipSprite,
    handleDeselectSprite,
    handleDeleteSprite,  // Add the delete handler here
    handleDuplicateSprite,  // Add the duplicate handler here
}) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.shiftKey && e.key === '=') {
                handleResizeSprite('increase');
            } else {
                switch (e.key) {
                    case '-':
                        handleResizeSprite('decrease');
                        break;
                    case 'ArrowUp':
                        handleChangeOrder('front');
                        break;
                    case 'ArrowDown':
                        handleChangeOrder('back');
                        break;
                    case 'r':
                    case 'R':
                        handleRotateSprite();
                        break;
                    case 'h':
                    case 'H':
                        handleFlipSprite('horizontal');
                        break;
                    case 'v':
                    case 'V':
                        handleFlipSprite('vertical');
                        break;
                    case 'Backspace':  // Add the backspace key for deleting the sprite
                        handleDeleteSprite();
                        break;
                    case 'd':
                    case 'D':  // Add the d key for duplicating the sprite
                        handleDuplicateSprite();
                        break;
                    default:
                        break;
                }
            }
        };

        const handleWheel = (e) => {
            if (e.deltaY < 0) {
                handleResizeSprite('increase');
            } else {
                handleResizeSprite('decrease');
            }
        };

        const handleContextMenu = (e) => {
            e.preventDefault();
            handleDeselectSprite();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('wheel', handleWheel);
        window.addEventListener('contextmenu', handleContextMenu);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [
        handleResizeSprite,
        handleChangeOrder,
        handleRotateSprite,
        handleFlipSprite,
        handleDeselectSprite,
        handleDeleteSprite,  // Add the delete handler here
        handleDuplicateSprite,  // Add the duplicate handler here
    ]);
};
