import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const baseURL = 'http://127.0.0.1:8001'

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
            '/api/': baseURL,
            '/media/': baseURL,
            '/s/': baseURL,
            '/file/': baseURL,
            '/admin/': baseURL
        }
    }
})
