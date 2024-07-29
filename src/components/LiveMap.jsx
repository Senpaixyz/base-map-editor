import React, { useRef, useEffect, useState } from 'react';

const LiveMap = ({ imageFile, jsonFile }) => {
    const canvasRef = useRef(null);
    const [sprites, setSprites] = useState([]);
    const [hoveredSprite, setHoveredSprite] = useState(null);

    const loadImage = (src) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
        });
    };

    const handleLoad = () => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const spriteData = JSON.parse(event.target.result);
            const loadedSprites = await Promise.all(
                spriteData.map(async (sprite) => {
                    const img = await loadImage(sprite.src);
                    return { ...sprite, img };
                })
            );
            setSprites(loadedSprites);
        };
        reader.readAsText(jsonFile);
    };

    useEffect(() => {
        if (jsonFile) {
            handleLoad();
        }
    }, [jsonFile]);

    useEffect(() => {
        if (imageFile) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = URL.createObjectURL(imageFile);

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);

                sprites.forEach((sprite, index) => {
                    ctx.save();
                    ctx.translate(sprite.x + sprite.width / 2, sprite.y + sprite.height / 2);
                    ctx.scale(sprite.flipH ? -1 : 1, sprite.flipV ? -1 : 1);

                    if (hoveredSprite === index) {
                        ctx.globalAlpha = 0.7;
                        ctx.scale(1.1, 1.1);
                    }

                    ctx.drawImage(
                        sprite.img,
                        -sprite.width / 2,
                        -sprite.height / 2,
                        sprite.width,
                        sprite.height
                    );
                    ctx.restore();
                });
            };
        }
    }, [imageFile, sprites, hoveredSprite]);

    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const hoveredIndex = sprites.findIndex(sprite =>
            x >= sprite.x && x <= sprite.x + sprite.width &&
            y >= sprite.y && y <= sprite.y + sprite.height
        );

        setHoveredSprite(hoveredIndex);
    };

    return (
        <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
        />
    );
};

export default LiveMap;
