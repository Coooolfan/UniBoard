import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

const baseURL = 'http://127.0.0.1:8000'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), tailwindcss()],
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
