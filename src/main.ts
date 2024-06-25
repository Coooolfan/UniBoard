import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import router from '@/router/index'
import DialogService from 'primevue/dialogservice'
import 'primeicons/primeicons.css'
import './index.css'

const app = createApp(App)

app.use(router)

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
})

app.use(DialogService)

app.mount('#app')
