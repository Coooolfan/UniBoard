import axios from 'axios'
let isRefreshing = false // 是否正在刷新token

function setAccessToken(token: string) {
    localStorage.setItem('access_token', token)
}

function getRefreshToken() {
    return localStorage.getItem('refresh_token')
}

function removeToken() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
}

// 失效后同时发送请求的容器 -- 缓存接口
let callbacks: Function[] = []
function onAccessTokenFetched(newToken: String) {
    callbacks.forEach((callback) => {
        callback(newToken)
    })
    // 清空缓存接口
    callbacks = []
}
// 添加缓存接口
function addCallbacks(callback: Function) {
    callbacks.push(callback)
}
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// 响应拦截器
axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        /**
         * 将未授权接口缓存起来。retryOriginalRequest 这个 Promise 函数很关键，它一直处于等待状态。
         * 只有当token刷新成功后，onAccessTokenFetched 这个函数执行了回调函数，返回了 resolve 状态
         */
        if (error.response && error.response.status === 401) {
            // 获取当前的请求
            const config = error.response.config
            // 刷新token的promise
            const retryOriginalRequest = new Promise((resolve) => {
                addCallbacks((newToken: String) => {
                    // 表示用新的token去替换掉原来的token
                    config.headers.Authorization = `Bearer ${newToken}`
                    resolve(axiosInstance.request(config)) // 调用resolve请求队列里面接口
                })
            })
            // 无感刷新Token
            if (!isRefreshing) {
                isRefreshing = true
                axiosInstance
                    .post('/token/refresh/', { refresh: getRefreshToken() })
                    .then((response) => {
                        // 用refreshToken获取新的token
                        const accessToken = response.data.access
                        setAccessToken(accessToken)
                        onAccessTokenFetched(accessToken)
                    })
                    .catch(() => {
                        // 刷新token错误跳转到登陆页面
                        removeToken()
                        alert('登录无效/过期，请重新登录')
                    })
                    .finally(() => {
                        isRefreshing = false
                    })
            }
            return retryOriginalRequest // 将token过期期间请求的接口包装成promise返回，等待刷新token后重新请求
        } else {
            console.error('Error Message:未处理', error.message)
            return Promise.reject(new Error(error.message || 'Error'))
        }
    }
)

export default axiosInstance
