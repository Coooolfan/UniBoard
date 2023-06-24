<template>
    <div class="SuperBox">
        <timer class="Line1"></timer>
        <div class="Line2">
            <note></note>
            <button @click="loggingout()">Loggin Out</button>
        </div>
    </div>
</template>
<script>
import '../../assets/styles/HomePage.css'
import note from './note.vue'
import timer from './timer.vue'
import { localstorge_manager } from '../../api/localstorage.js'
export default {
    components: {
        note,
        timer,
    },
    name: 'HomePage',
    data() {
        return {
            msg: "",
        };
    },
    methods: {
        loggingout() {
            localstorge_manager.setPage('LandingPage');
            window.location.reload();
        }
    },
};
</script>
