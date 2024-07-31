import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src/main.jsx',
      name: 'MapEditorCMS',
      fileName: (format) => `map-editor-cms.${format}.js`,
      formats: ['umd'],
    },
    rollupOptions: {
      output: {
        assetFileNames: "map-editor-cms.min.[ext]",
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
});
