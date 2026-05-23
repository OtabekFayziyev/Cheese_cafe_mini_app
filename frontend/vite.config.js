import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
// Vite konfiguratsiyasi — Telegram Mini App uchun mo'ljallangan
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        host: true,
        port: 5173,
        // Telegram WebView ichidan ochish uchun HTTPS tunnel kerak bo'lganda ngrok ishlatiladi
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        target: 'esnext',
        cssMinify: 'lightningcss',
        rollupOptions: {
            output: {
                // Vendor chunklarini ajratish — kesh va yuklash tezligi uchun
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'state-vendor': ['zustand', '@tanstack/react-query'],
                    'ui-vendor': ['framer-motion', 'lucide-react'],
                },
            },
        },
    },
});
