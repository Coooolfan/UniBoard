import "@icon-park/vue-next/styles/index.css"
import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'

createApp(App).mount('#app')

{
axios.defaults.withCredentials = false
axios.defaults.baseURL = import.meta.env.VITE_API_URL
}
