// router
// 仅声明Landing页面和UniBoard页面
import { createRouter, createMemoryHistory } from 'vue-router'
import Landing from '@/views/LandingView.vue'
import UniBoard from '@/views/UniBoardView.vue'

const routes = [
    {
        path: '/',
        name: 'Landing',
        component: Landing
    },
    {
        path: '/uniboard',
        name: 'UniBoard',
        component: UniBoard
    }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes
})

export default router
