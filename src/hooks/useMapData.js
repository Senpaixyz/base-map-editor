import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { loadData } from '../utils/indexedDB';

export const useMapData = () => {
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const raycasterRef = useRef(new THREE.Raycaster());
    const mouseRef = useRef(new THREE.Vector2());
    const pinRef = useRef(null);
    const INITIAL_ZOOM = useRef(1);

    const loadMapData = useCallback(async (mapId, showPins = true) => {
        const { mapData, spritesData } = await loadData();
        const currentMap = mapData.find(map => map.id === mapId);
        const associatedSprites = spritesData.filter(sprite => sprite.mapId === mapId);

        if (currentMap) {
            const scene = new THREE.Scene();
            sceneRef.current = scene;

            const camera = new THREE.OrthographicCamera(
                currentMap.width / -2, currentMap.width / 2,
                currentMap.height / 2, currentMap.height / -2,
                1, 1000
            );
            camera.position.z = 100;
            cameraRef.current = camera;

            INITIAL_ZOOM.current = camera.zoom;

            const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
            renderer.setSize(currentMap.width, currentMap.height);
            rendererRef.current = renderer;

            scene.background = null;

            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(currentMap.backgroundImage, (texture) => {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = texture.image.width;
                tempCanvas.height = texture.image.height;

                const tempContext = tempCanvas.getContext('2d');
                tempContext.fillStyle = 'white';
                tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                tempContext.drawImage(texture.image, 0, 0);

                const whiteFilledTexture = new THREE.CanvasTexture(tempCanvas);
                whiteFilledTexture.colorSpace = THREE.SRGBColorSpace;

                const backgroundGeometry = new THREE.PlaneGeometry(currentMap.width, currentMap.height);
                const backgroundMaterial = new THREE.MeshBasicMaterial({ map: whiteFilledTexture });
                const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
                backgroundMesh.position.set(0, 0, 0);
                scene.add(backgroundMesh);
            });

            associatedSprites.forEach(sprite => {
                textureLoader.load(sprite.img, (spriteTexture) => {
                    spriteTexture.flipY = true;
                    spriteTexture.colorSpace = THREE.SRGBColorSpace;

                    const spriteGeometry = new THREE.PlaneGeometry(sprite.width, sprite.height);
                    const spriteMaterial = new THREE.MeshBasicMaterial({ map: spriteTexture, transparent: true });
                    const spriteMesh = new THREE.Mesh(spriteGeometry, spriteMaterial);
                    spriteMesh.position.set(sprite.x - currentMap.width / 2 + sprite.width / 2, -(sprite.y - currentMap.height / 2 + sprite.height / 2), 1);

                    if (sprite.flipH) spriteMesh.scale.x *= -1;
                    if (sprite.flipV) spriteMesh.scale.y *= -1;

                    spriteMesh.userData = { id: sprite.id, originalScale: spriteMesh.scale.clone(), name: sprite.name, isBlinking: sprite.isBlinking };
                    scene.add(spriteMesh);

                    // Add the pin for each sprite if showPins is true
                    if (showPins) {
                        const pinTextureLoader = new THREE.TextureLoader();
                        const pinTexturePath = sprite.pinTexture ? sprite.pinTexture : 'pin-default.png';
                        pinTextureLoader.load(pinTexturePath, (pinTexture) => {
                            pinTexture.flipY = true;
                            pinTexture.colorSpace = THREE.SRGBColorSpace;

                            const pinGeometry = new THREE.PlaneGeometry(20, 20);
                            const pinMaterial = new THREE.MeshBasicMaterial({ map: pinTexture, transparent: true });
                            const pinMesh = new THREE.Mesh(pinGeometry, pinMaterial);

                            pinMesh.position.set(spriteMesh.position.x, spriteMesh.position.y + sprite.height / 2 + 10, 1);
                            scene.add(pinMesh);

                            // Add jumping animation
                            gsap.to(pinMesh.position, {
                                y: pinMesh.position.y + 10,
                                duration: 0.5,
                                ease: "power1.inOut",
                                yoyo: true,
                                repeat: -1
                            });
                        });
                    }

                    // Add blinking animation if isBlinking is true
                    if (sprite.isBlinking) {
                        const blinkTween = gsap.to(spriteMesh.material.color, {
                            r: 1,
                            g: 1,
                            b: 1,
                            duration: 0.5,
                            ease: "power1.inOut",
                            yoyo: true,
                            repeat: -1,
                            onRepeat: () => {
                                spriteMesh.material.color.set(
                                    spriteMesh.material.color.getHex() === 0x000000 ? 0xffffff : 0x000000
                                );
                            }
                        });
                        spriteMesh.blinkTween = blinkTween;
                    }
                });
            });

            const animate = () => {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            };
            animate();
        }
    }, []);

    return { canvasRef, sceneRef, cameraRef, rendererRef, raycasterRef, mouseRef, pinRef, INITIAL_ZOOM, loadMapData };
};
