import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';

const renderApp = (containerId) => {
    console.log('Rendering App');
    const root = document.getElementById(containerId);
    if (root) {
        ReactDOM.render(
            <React.StrictMode>
                <ChakraProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </ChakraProvider>
            </React.StrictMode>,
            root
        );
        console.log('App Rendered');
    } else {
        console.error('Root element not found');
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
