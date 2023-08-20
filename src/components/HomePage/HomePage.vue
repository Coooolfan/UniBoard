<template>
    <div class="SuperBox">
        <timer class="Line1"></timer>
        <div class="Line2">
            <note></note>
            <button @click="loggingout()">Loggin Out</button>
        </div>
        <LineCharts></LineCharts>
        <div class="Line3">
            <objCard v-for="(item, index) in MonitoredObjects" :key="index" :category="item.category" :objectName="item.objectName" :statusList="item.statusList" :objectID="item.objectID"></objCard>
        </div>
    </div>
</template>
<script>
import '../../assets/styles/HomePage.css'
import note from './note.vue'
import timer from './timer.vue'
import objCard from './objCard.vue'
import LineCharts from './LineCharts.vue'
import { localstorge_manager } from '../../api/localstorage.js'
import { network_manager } from '../../api/network.js'
export default {
    components: {
        note,
        timer,
        objCard,
        LineCharts
    },
    name: 'HomePage',
    data() {
        return {
            msg: "",
            MonitoredObjects:[]

        }
    },
    methods: {
        loggingout() {
            localstorge_manager.setPage('LandingPage')
            window.location.reload()
        },
        async getMonitoredObjects() {
            this.MonitoredObjects = await network_manager.getMonitoredObjects()
        }
    },
    mounted() {
        this.getMonitoredObjects()
    }
};
</script>
