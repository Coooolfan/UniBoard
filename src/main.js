import "@icon-park/vue-next/styles/index.css"
import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import { localstorge_manager } from './api/localstorage.js';

const app = createApp(App)

{
    axios.defaults.withCredentials = false
    axios.defaults.baseURL = import.meta.env.VITE_API_URL
    // axios.defaults.headers.post['Authorization'] = 'Bearer ' + localstorge_manager.getToken()
}

// 劫持请求头向其中添加token
axios.interceptors.request.use(
    (config) => {
        // 在请求发送之前添加请求头部信息
        const token = localstorge_manager.getToken();
        const deviceID = localstorge_manager.getDeviceID();
        config.headers['Authorization'] = 'Bearer ' + token;
        config.headers['deviceID'] = deviceID;
        return config;
    }
)

// 劫持响应头，如果响应头中有token，就将其存入localStorage
axios.interceptors.response.use(
    response => {
        const token = response.data['token']
        if (response.data['token']) {
            localstorge_manager.setToken(token)
        }
        return response
    }
)

// 将 Axios 添加到 Vue 实例原型中
app.config.globalProperties.$axios = axios;

// 挂载 Vue 实例
app.mount('#app');