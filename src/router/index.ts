// router
// 仅声明Landing页面和UniBoard页面
import { createRouter, createWebHistory } from 'vue-router'
const Landing = () => import('@/views/landing/LandingView.vue')
const UniBoard = () => import('@/views/DashBoardView.vue')
const FileShare = () => import('@/views/FileShareView.vue')
const Setup = () => import('@/views/landing/SetupView.vue')

const routes = [
    {
        path: '/',
        name: 'Landing',
        component: Landing
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: UniBoard
    },
    {
        path: '/f/:fileShareCode',
        name: 'FileShare',
        component: FileShare
    },
    {
        path: '/setup',
        name: 'Setup',
        component: Setup
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
