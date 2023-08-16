import axios from 'axios';
import { reactive } from 'vue';
import { localstorge_manager } from './localstorage.js';

export const network_manager = reactive({
    postKey(key) {
        const data = {
            "key": key,
        }
        return axios.post('/report/', data).then((response) => {
            if (response.data["verified"] === true) {
                return response.data["token"]
            }
        }
        ).catch((error) => {
            console.log(error)
        })
    },
    getNote() {
        return axios.get('/note/').then((response) => {
            return response
        })
    },
    postNote(note) {
        const data = {
            "content": note,
            'last edited': new Date().getTime(),
        }
        return axios.post('/note/', data).then((response) => {
            return response.data
        })
    },
    getMonitoredObjects() {
        return axios.get('/monitored-objects/').then((response) => {
            return response.data["monitored_objects"]
        })
    },
    getPeriodStatus(objectIDs, items, startTime, endTime, density, last) {
        var params = {
            "objectIDs": objectIDs,
            "items": items,
            "startTime": startTime,
            "endTime": endTime,
            "density": density,
            "last": last,
        }
        return axios.get('/period-status/', {params:params}).then((response) => {
            // return response.data["data"] //在函数里面返回
            return response.data.data //直接返回，在调用函数的地方再处理
        })
    }
})


// axios.interceptors.request.use(
//     config => {
//         return config.headers['Authorization'] = localstorge_manager.getToken()
//     }
// )


