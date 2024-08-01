import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';

/**
 * MapEditorCMS - A library to render a custom React component into a target DOM element.
 * 
 * @param {string} target - The ID of the target DOM element where the component will be rendered.
 * @param {Object} options - The options object for configuring the component.
 */
class MapEditorCMS {
    constructor(target, options = {}) {
        this.options = options;
        // private method not accessible via instance. REQUIRED
        function _render() {
            const element = document.getElementById(target);
            console.log(`Rendering : #${target}`)
            if (element) {
                const root = ReactDOM.createRoot(element);
                root.render(
                    <React.StrictMode>
                        <ChakraProvider>
                            <Router>
                                <App />
                            </Router>
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
    // load(data) {
    //     return new Promise((resolve, reject) => {
    //         // store to indexedDB
    //         resolve(data);
    //     })
    // }
    // store(callback) {
    //     const data = {};// data from indexedDB ;
    //     callback(data);
    // }
}

const map = new MapEditorCMS('root');

export default MapEditorCMS;

// const renderApp = (containerId) => {
//     console.log('Rendering App');
//     if (root) {

//         const root = ReactDOM.createRoot(document.getElementById(containerId));
//         root.render(
//             <React.StrictMode>
//                 <ChakraProvider>
//                     <Router>
//                         <App />
//                     </Router>
//                 </ChakraProvider>
//             </React.StrictMode>
//         );
//         console.log('App Rendered');
//     } else {
//         console.error(`${containerId} element not found`);
//     }
// };

// // Export the function globally for vanilla JS integration
// if (typeof window !== 'undefined') {
//     window.MapEditorCMS = {
//         renderApp
//     };
// }

// // Immediately call renderApp if you want to render it by default in development
// if (process.env.NODE_ENV !== 'production') {
//     renderApp('root');
// }
