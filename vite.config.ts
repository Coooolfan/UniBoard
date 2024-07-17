import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '/api/': 'http://127.0.0.1:8001',
            '/media/': 'http://127.0.0.1:8001',
            '/s/': 'http://127.0.0.1:8001',
            '/admin/': 'http://127.0.0.1:8001'
        }
    }
})
