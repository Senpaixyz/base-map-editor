import { openDB } from 'idb';

const DB_NAME = 'mapEditor';
const DB_VERSION = 1;
const SPRITES_STORE = 'sprites';
const MAP_STORE = 'map';

const initDB = async () => {
    const db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(SPRITES_STORE)) {
                db.createObjectStore(SPRITES_STORE, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(MAP_STORE)) {
                db.createObjectStore(MAP_STORE, { keyPath: 'id' });
            }
        },
    });
    return db;
};

export const getMaps = async () => {
    const db = await initDB();
    const tx = db.transaction(MAP_STORE, 'readonly');
    const store = tx.objectStore(MAP_STORE);
    const maps = await store.getAll();
    await tx.done;
    return maps;
};

const clearSpritesStore = async (db) => {
    const tx = db.transaction(SPRITES_STORE, 'readwrite');
    const spritesStore = tx.objectStore(SPRITES_STORE);
    await spritesStore.clear();
    await tx.done;
};

export const saveData = async (mapData, spritesData) => {
    const db = await initDB();
    await clearSpritesStore(db); // Clear the sprites store before saving new data

    const tx = db.transaction([SPRITES_STORE, MAP_STORE], 'readwrite');
    const spritesStore = tx.objectStore(SPRITES_STORE);
    const mapStore = tx.objectStore(MAP_STORE);

    const existingMap = await mapStore.get(mapData.id);
    if (!existingMap) {
        await mapStore.put(mapData);
    } else {
        console.log('Map already exists, skipping save');
    }

    await Promise.all(spritesData.map(async (sprite) => {
        await spritesStore.put(sprite);
    }));

    await tx.done;
};

export const loadData = async () => {
    const db = await initDB();
    const mapData = await db.getAll(MAP_STORE);
    const spritesData = await db.getAll(SPRITES_STORE);
    return { mapData, spritesData };
};

export const clearAllData = async () => {
    const db = await initDB();
    const tx = db.transaction([SPRITES_STORE, MAP_STORE], 'readwrite');
    const spritesStore = tx.objectStore(SPRITES_STORE);
    const mapStore = tx.objectStore(MAP_STORE);

    await spritesStore.clear();
    await mapStore.clear();

    await tx.done;
};
