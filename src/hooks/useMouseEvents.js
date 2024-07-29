import { useCallback, useState, useRef } from 'react';
import * as THREE from 'three';

export const useMouseEvents = (canvasRef, sceneRef, cameraRef, raycasterRef, mouseRef, pinRef) => {
    const [hoveredSprite, setHoveredSprite] = useState(null);
    const isDragging = useRef(false);
    const lastMousePosition = useRef({ x: 0, y: 0 });

    const handleMouseMove = useCallback((event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        if (isDragging.current) {
            const deltaX = event.clientX - lastMousePosition.current.x;
            const deltaY = event.clientY - lastMousePosition.current.y;
            cameraRef.current.position.x -= deltaX / cameraRef.current.zoom;
            cameraRef.current.position.y += deltaY / cameraRef.current.zoom;
            lastMousePosition.current = { x: event.clientX, y: event.clientY };
            return;
        }

        const raycaster = raycasterRef.current;
        raycaster.setFromCamera(mouseRef.current, cameraRef.current);

        const intersects = raycaster.intersectObjects(sceneRef.current.children, true);
        if (intersects.length > 0) {
            const intersected = intersects[0].object;
            if (hoveredSprite !== intersected) {
                if (hoveredSprite) {
                    if (hoveredSprite.userData && hoveredSprite.userData.originalScale) {
                        hoveredSprite.scale.copy(hoveredSprite.userData.originalScale);
                        hoveredSprite.material.opacity = 1;
                    }
                }
                if (intersected.userData && intersected.userData.originalScale) {
                    intersected.scale.set(intersected.userData.originalScale.x * 1.1, intersected.userData.originalScale.y * 1.1, 1);
                    intersected.material.opacity = 0.7;
                }
                setHoveredSprite(intersected);
                canvas.style.cursor = 'pointer';
            }
        } else {
            if (hoveredSprite) {
                if (hoveredSprite.userData && hoveredSprite.userData.originalScale) {
                    hoveredSprite.scale.copy(hoveredSprite.userData.originalScale);
                    hoveredSprite.material.opacity = 1;
                }
                setHoveredSprite(null);
            }
            canvas.style.cursor = 'default';
        }
    }, [hoveredSprite]);

    const handleMouseDown = useCallback((event) => {
        isDragging.current = true;
        lastMousePosition.current = { x: event.clientX, y: event.clientY };
    }, []);

    const handleMouseUp = useCallback(() => {
        isDragging.current = false;
    }, []);

    const handleClick = useCallback((event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = raycasterRef.current;
        raycaster.setFromCamera(mouseRef.current, cameraRef.current);

        const intersects = raycaster.intersectObjects(sceneRef.current.children, true);
        if (intersects.length > 0) {
            const intersected = intersects[0].object;
            if (intersected.userData && intersected.userData.name) {
                alert(`Sprite Name: ${intersected.userData.name}`);

                if (pinRef.current) {
                    sceneRef.current.remove(pinRef.current);
                }

                const textureLoader = new THREE.TextureLoader();
                textureLoader.load('pin.png', (pinTexture) => {
                    pinTexture.flipY = true;
                    pinTexture.colorSpace = THREE.SRGBColorSpace;

                    const pinGeometry = new THREE.PlaneGeometry(20, 20);
                    const pinMaterial = new THREE.MeshBasicMaterial({ map: pinTexture, transparent: true });
                    const pinMesh = new THREE.Mesh(pinGeometry, pinMaterial);

                    pinMesh.position.set(intersected.position.x, intersected.position.y + intersected.geometry.parameters.height / 2 + 10, 1);
                    pinRef.current = pinMesh;
                    sceneRef.current.add(pinMesh);
                });
            }
        }
    }, []);

    return { handleMouseMove, handleMouseDown, handleMouseUp, handleClick };
};
