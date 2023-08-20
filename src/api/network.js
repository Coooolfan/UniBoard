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
            return response.data.data
        })
    },
    getStatus(objectIDs, items, startTime, endTime, density, last, formatted) {
        var params = {
            "objectIDs": objectIDs,
            "items": items,
            "startTime": startTime,
            "endTime": endTime,
            "density": density,
            "last": last,
        }
        return axios.get('/status/', { params: params }).then((response) => {
            if (!formatted && objectIDs.length === 1) 
                return response.data.data
            var recievedData = response.data.data[0].data
            var formattedData = []
            items.forEach((item) => { 
                formattedData.push({
                    "item": item,
                    "data": []
                })
            })
            recievedData.forEach((data) => { 
                var formatted_time = this.stamp2time(data.reportTime)
                items.forEach((item, index) => { 
                    formattedData[index].data.push([
                        formatted_time,
                        data.status[item]
                    ])
                })
            })
            return formattedData
        })
    },
    stamp2time(stamp) {
        // 从UTC时间转换为北京时间
        stamp = stamp + 3600 * 8
        var date = new Date(stamp * 1000)
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        return Y + M + D + h + m + s
    },
})


// axios.interceptors.request.use(
//     config => {
//         return config.headers['Authorization'] = localstorge_manager.getToken()
//     }
// )


