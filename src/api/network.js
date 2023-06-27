import axios from 'axios';
import { reactive } from 'vue';
import { localstorge_manager } from './localstorage.js';

export const network_manager = reactive({
    postKey(key) {
        var data = {
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
        var data = {
            "content": note,
            'last edited': new Date().getTime(),
        }
        return axios.post('/note/', data).then((response) => {
            return response.data
        })
    }


})


// axios.interceptors.request.use(
//     config => {
//         return config.headers['Authorization'] = localstorge_manager.getToken()
//     }
// )


