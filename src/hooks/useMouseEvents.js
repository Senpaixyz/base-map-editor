import { useCallback, useState, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export const useMouseEvents = (canvasRef, sceneRef, cameraRef, raycasterRef, mouseRef, pinRef, spriteZoom, updateSpritePin, selectedSpriteRef) => {
    const [hoveredSprite, setHoveredSprite] = useState(null);
    const isDragging = useRef(false);
    const isLongPress = useRef(false);
    const longPressTimeout = useRef(null);
    const lastMousePosition = useRef({ x: 0, y: 0 });
    const initialPinchDistance = useRef(0);
    const dragThreshold = 5; // pixels
    const longPressThreshold = 300; // milliseconds

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

                // Remove previous pin if any
                if (selectedSpriteRef.current) {
                    sceneRef.current.remove(selectedSpriteRef.current);
                }

                // Replace pin texture with selected pin texture
                const selectedPinTextureLoader = new THREE.TextureLoader();
                selectedPinTextureLoader.load('pin.png', (pinTexture) => {
                    pinTexture.flipY = true;
                    pinTexture.colorSpace = THREE.SRGBColorSpace;

                    const pinGeometry = new THREE.PlaneGeometry(20, 20);
                    const pinMaterial = new THREE.MeshBasicMaterial({ map: pinTexture, transparent: true });
                    const pinMesh = new THREE.Mesh(pinGeometry, pinMaterial);

                    pinMesh.position.set(intersected.position.x, intersected.position.y + intersected.geometry.parameters.height / 2 + 10, 1);
                    selectedSpriteRef.current = pinMesh;
                    sceneRef.current.add(pinMesh);

                    // Add jumping animation
                    gsap.to(pinMesh.position, {
                        y: pinMesh.position.y + 10,
                        duration: 0.5,
                        ease: "power1.inOut",
                        yoyo: true,
                        repeat: -1
                    });

                    // Update sprite pin texture
                    updateSpritePin(intersected.userData.id, 'pin.png');
                });

                // Zoom in on the clicked sprite with animation
                gsap.to(cameraRef.current.position, {
                    x: intersected.position.x,
                    y: intersected.position.y,
                    duration: 1.5,
                    ease: "power2.inOut",
                    onUpdate: () => cameraRef.current.updateProjectionMatrix()
                });
                gsap.to(cameraRef.current, {
                    zoom: spriteZoom,
                    duration: 1.5,
                    ease: "power2.inOut",
                    onUpdate: () => cameraRef.current.updateProjectionMatrix()
                });
            }
        }
    }, [spriteZoom, updateSpritePin, selectedSpriteRef]);

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
        isLongPress.current = false;
        lastMousePosition.current = { x: event.clientX, y: event.clientY };

        longPressTimeout.current = setTimeout(() => {
            isLongPress.current = true;
        }, longPressThreshold);
    }, []);

    const handleMouseUp = useCallback((event) => {
        clearTimeout(longPressTimeout.current);

        if (!isDragging.current) {
            return;
        }
        isDragging.current = false;

        const deltaX = event.clientX - lastMousePosition.current.x;
        const deltaY = event.clientY - lastMousePosition.current.y;

        if (Math.sqrt(deltaX * deltaX + deltaY * deltaY) < dragThreshold && !isLongPress.current) {
            handleClick(event);
        }
    }, [handleClick]);

    const handleTouchStart = useCallback((event) => {
        if (event.touches.length === 1) {
            handleMouseDown(event.touches[0]);
        } else if (event.touches.length === 2) {
            isDragging.current = false;
            isLongPress.current = false;
            initialPinchDistance.current = getPinchDistance(event.touches);
        }
        event.preventDefault();
    }, [handleMouseDown]);

    const handleTouchMove = useCallback((event) => {
        if (event.touches.length === 1) {
            handleMouseMove(event.touches[0]);
        } else if (event.touches.length === 2) {
            const currentPinchDistance = getPinchDistance(event.touches);
            const scale = currentPinchDistance / initialPinchDistance.current;
            cameraRef.current.zoom = THREE.MathUtils.clamp(cameraRef.current.zoom * scale, 1, 6);
            cameraRef.current.updateProjectionMatrix();
            initialPinchDistance.current = currentPinchDistance;
        }
        event.preventDefault();
    }, [handleMouseMove]);

    const handleTouchEnd = useCallback((event) => {
        if (event.touches.length === 0) {
            handleMouseUp(event.changedTouches[0]);
        }
        event.preventDefault();
    }, [handleMouseUp]);

    const getPinchDistance = (touches) => {
        const dx = touches[0].pageX - touches[1].pageX;
        const dy = touches[0].pageY - touches[1].pageY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    return { handleMouseMove, handleMouseDown, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd };
};
