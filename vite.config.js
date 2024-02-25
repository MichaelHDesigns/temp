import path from 'path';

export default {
  server: {
    host: '0.0.0.0',
    port: process.env.VITE_PORT || 3000,
    open: true,
    hmr: {
      overlay: false,
    },
  },
  resolve: {
    alias: {
      '/static': path.resolve(__dirname, 'static'),
      '/public': path.resolve(__dirname, 'public'),
    },
  },
  optimizeDeps: {
    include: ['three', 'three/examples/jsm/controls/OrbitControls', 'three/examples/jsm/libs/tween.module.min.js', 'three/examples/jsm/loaders/GLTFLoader', 'three/examples/jsm/loaders/DRACOLoader'],
  },
};
