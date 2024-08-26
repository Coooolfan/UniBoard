import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        createSvgIconsPlugin({
            // 指定需要缓存的图标文件夹
            iconDirs: [resolve(process.cwd(), 'src/components/MilkdownEditor/svg')],
            // 指定symbolId格式
            symbolId: 'icon-[dir]-[name]'
        })
    ],
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
            '/file/': 'http://127.0.0.1:8001',
            '/admin/': 'http://127.0.0.1:8001'
        }
    }
})
