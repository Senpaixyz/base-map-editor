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
      // Do not treat react and react-dom as external dependencies
      // This will include them in the bundle
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
});
