// src/components/modal/SpriteInfo.js
import React, { useRef, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../../assets/css/Modal.css';

const SpriteInfo = ({ show, onClose, spriteInfo, canvasRef }) => {
    const modalRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0, top: 0, left: 0 });

    useEffect(() => {
        if (canvasRef.current) {
            const { clientWidth, clientHeight, offsetTop, offsetLeft } = canvasRef.current;

            setDimensions({
                width: clientWidth * 0.4, // 50% of canvas width
                height: clientHeight * 0.93, // 93% of canvas height
                top: offsetTop + clientHeight * 0.05, // Center the modal vertically within the canvas
                left: offsetLeft * 2.5, // pos left
            });
        }
    }, [canvasRef, spriteInfo]);

    return (
        <CSSTransition
            in={show}
            timeout={300}
            classNames="modal-transition"
            unmountOnExit
            nodeRef={modalRef}
        >
            <div
                ref={modalRef}
                className="modal"
                style={{ width: dimensions.width, height: dimensions.height, top: dimensions.top, left: dimensions.left }}
            >
                <div className="modal-content">
                    <button className="close-button" onClick={onClose}>X</button>
                    {spriteInfo && <>
                        <div className="sprite-info">
                            <h2>Sprite Info</h2>
                            <p><strong>Name: {spriteInfo.name}</strong></p>
                            {/* Add more sprite information as needed */}
                        </div>
                    </>}

                </div>
            </div>
        </CSSTransition>
    );
};

export default SpriteInfo;
