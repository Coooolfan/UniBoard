import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

let isRefreshing = false // 是否正在刷新token

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
    baseURL: '/api',
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
        if (
            (error.response.status.toString() === '401' ||
                error.response.status.toString() === '403') &&
            !(error.config.url === 'token/') &&
            !(error.config.url === 'token/refresh/')
        ) {
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
                        location.href = window.location.origin
                    })
                    .finally(() => {
                        isRefreshing = false
                    })
            }
            return retryOriginalRequest // 将token过期期间请求的接口包装成promise返回，等待刷新token后重新请求
        } else {
            return Promise.reject(new Error(error.message || 'Error'))
        }
    }
)

function setRefreshToken(token: string) {
    localStorage.setItem('refresh_token', token)
}

function setAccessToken(token: string) {
    localStorage.setItem('access_token', token)
}

function getRefreshToken() {
    return localStorage.getItem('refresh_token') || ''
}

function removeToken() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
}

async function loginByPassword(username: string, password: string): Promise<boolean> {
    try {
        const response = await axiosInstance.post('token/', {
            username: username,
            password: password
        })
        if (response.status === 200) {
            setAccessToken(response.data.access)
            setRefreshToken(response.data.refresh)
            return true
        }
        return false
    } catch (error) {
        console.error(`Error occurred while logging in: ${error}`)
        return false
    }
}

async function loginByTOTP(key: string): Promise<boolean> {
    try {
        const response = await axiosInstance.post('token/totp/', {
            key: key
        })
        if (response.status === 200) {
            setAccessToken(response.data.access)
            setRefreshToken(response.data.refresh)
            return true
        }
        return false
    } catch (error) {
        console.error(`Error occurred while logging in: ${error}`)
        return false
    }
}

function verifyTokenLocal(): boolean {
    const token = getRefreshToken()
    try {
        const decoded = jwtDecode(token)
        if (decoded.exp && decoded.exp > Date.now() / 1000) {
            return true
        }
        return false
    } catch (error) {
        console.log(`Error occurred while verifying token: ${error}`)
        return false
    }
}

export {
    axiosInstance,
    loginByPassword,
    setRefreshToken,
    setAccessToken,
    getRefreshToken,
    removeToken,
    loginByTOTP,
    verifyTokenLocal
}
