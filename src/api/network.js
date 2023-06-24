import axios from 'axios';
import { reactive } from 'vue';
import { localstorge_manager } from './localstorage.js';

export const network_manager = reactive({
    postKey(key) {
        return axios.post('/report/', key).then((response) => {
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
            return response.data
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