import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import { MapEditorInstanceProvider, OPTIONS } from './contexts/MapEditorInstanceContext';

/**
 * MapEditorCMS - A library to render a custom React component into a target DOM element.
 * 
 * @param {string} target - The ID of the target DOM element where the component will be rendered.
 * @param {Object} options - The options object for configuring the component.
 */
class MapEditorCMS {
    constructor(target, options = OPTIONS) {
        self = this;
        self.target = target;
        self.options = options;
        // private method not accessible via instance. REQUIRED
        function _render() {
            const element = document.getElementById(target);
            console.log(`Rendering : #${target}`)
            if (element) {
                const root = ReactDOM.createRoot(element);
                root.render(
                    <React.StrictMode>
                        <ChakraProvider>
                            <MapEditorInstanceProvider>
                                <Router>
                                    <App self={self} />
                                </Router>
                            </MapEditorInstanceProvider>
                        </ChakraProvider>
                    </React.StrictMode>
                );
            }
            else {
                console.error(`#${target} element not found`);
            }
        }
        _render(); // private;
    }
    load(fn = () => { }) {
        self.options.load = fn;
    }
    store(fn = (m, s) => { }) {
        self.options.store = fn;
    }
    selected() {
        return self.options.selected();
    }
}

if (process.env.NODE_ENV !== 'production') {
    const map = new MapEditorCMS('root', {
        load: () => { return { maps: [], sprites: [] } },
        store: (map, sprites) => { console.log(`Map: [${map}], Sprites: [${sprites}]`, [map, sprites]) },
        selected: (sprite) => { console.log(`Selected`, sprite) },
        deleteSprite: (sprite, id) => { console.log(`deleting ${id}`) },
        deleteMap: (map, id) => { console.log(`deleting ${id}`) },
    });
}

export default MapEditorCMS;
