import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
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

    const loadMapData = useCallback(async (mapId) => {
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

                    spriteMesh.userData = { originalScale: spriteMesh.scale.clone(), name: sprite.name };
                    scene.add(spriteMesh);
                });
            });

            const animate = () => {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);

                if (pinRef.current) {
                    pinRef.current.position.y += Math.sin(Date.now() / 100) * 0.5;
                }
            };
            animate();
        }
    }, []);

    return { canvasRef, sceneRef, cameraRef, rendererRef, raycasterRef, mouseRef, pinRef, INITIAL_ZOOM, loadMapData };
};
