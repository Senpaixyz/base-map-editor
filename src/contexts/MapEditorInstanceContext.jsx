import React, { createContext, useContext, useRef } from 'react';

export const OPTIONS = {
    load: async () => {
        return { maps: [], sprites: [] }
    },
    store: async (map, sprites) => {
    },
    selected: (sprite) => {
    },
    deleteSprite: async (sprite, id) => {
        return id;
    },
    deleteMap: async (map, id) => {
        return id;
    }
}

export const MapEditorInstanceContext = createContext();

export const MapEditorInstanceProvider = ({ children }) => {
    const instance = useRef(null);
    const options = useRef(OPTIONS);

    return (
        <MapEditorInstanceContext.Provider
            value={{ instance, options }}
        >
            {children}
        </MapEditorInstanceContext.Provider>
    )
}

export const useOptions = () => {
    return useContext(MapEditorInstanceContext)
};