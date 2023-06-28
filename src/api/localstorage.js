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
        localStorage.setItem('deviceID', new Date().getTime())
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