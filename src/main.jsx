import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';

const renderApp = (containerId) => {
    console.log('Rendering App');
    if (root) {

        const root = ReactDOM.createRoot(document.getElementById(containerId));
        root.render(
            <React.StrictMode>
                <ChakraProvider>
                    <Router>
                        <App />
                    </Router>
                </ChakraProvider>
            </React.StrictMode>
        );
        console.log('App Rendered');
    } else {
        console.error(`${containerId} element not found`);
    }
};

// Export the function globally for vanilla JS integration
if (typeof window !== 'undefined') {
    window.MapEditorCMS = {
        renderApp
    };
}

// Immediately call renderApp if you want to render it by default in development
if (process.env.NODE_ENV !== 'production') {
    renderApp('root');
}
