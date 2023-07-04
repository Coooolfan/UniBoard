import { reactive } from 'vue';

export const localstorge_manager = reactive({
    // 向本地存储中写入token
    setToken(token) {
        localStorage.setItem('token', token)
    },
    getToken() {
        return localStorage.getItem('token')
    },
    setDeviceID() {
        // 生成一个随机的设备ID，规则为时间戳+随机字符
        let deviceID = Date.now() + Math.random().toString(36).slice(-8)
        localStorage.setItem('deviceID', deviceID)
    },
    getDeviceID() {
        return localStorage.getItem('deviceID')
    },
    setPage(page) {
        if (page === "LandingPage" || page === "HomePage" ) {
            localStorage.setItem('page', page)
            return true
        }else{
            console.log("page name error")
            return false
        }
    },
    getPage() {
        return localStorage.getItem('page')
    }
})