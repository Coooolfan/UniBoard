<template>
    <div class="obj-card">
        <div class="obj-card-left">
            <component :is='icon' class="obj-card-left-icon"></component>
            <p>{{ objectName }}</p>
            <div class="obj-card-left-lastStatus">
                <div v-for="(val, key) in lastStatus" class="obj-card-left-lastStatus-item">
                    <span class="obj-card-left-lastStatus-item-key">{{ key }}</span>
                    <span class="obj-card-left-lastStatus-item-val">{{ val }}</span>
                </div>
                <span>{{ this.timedetal + "秒前更新" }}</span>
            </div>

        </div>
        <div class="obj-card-right" v-if="!LineChartsShowing">
            <div class="obj-card-right-item" v-for="(item, index) in statusList" :key="index">
                <span class="obj-card-right-item-name" @click="switchLineChartsShowing(item.statusName)">{{ item.statusName
                }}</span>
                <span v-for="(item_j, index_j) in  PeriodStatus " :key="index_j" class="obj-card-right-item-dot"
                    :style="{ backgroundColor: getBackgroundColor(PeriodStatus[index_j].status[item.statusName]) }"
                    :title="getDotTitle(PeriodStatus[index_j].startStamp, PeriodStatus[index_j].endStamp, PeriodStatus[index_j].status[item.statusName])">
                    {{ PeriodStatus[index_j].status[item.statusName] == 0 ? '' :
                        PeriodStatus[index_j].status[item.statusName] }}
                </span>
            </div>
        </div>
        <div class="obj-card-right-charts" v-else>
            <Return @click="switchLineChartsShowing()" class="obj-card-right-charts-icon"></Return>
            <LineCharts :ObjectIDs="ChartsData.ObjectIDs" :startTimestamp="ChartsData.startTimestamp"
                :endTimestamp="ChartsData.endTimestamp" :items="ChartsData.items" />
        </div>
    </div>
</template>
<script>
import { network_manager } from '../../api/network';
import '../../assets/styles/objCard.css';
import { Devices, NetworkDrive, Return } from '@icon-park/vue-next';
import LineCharts from './LineCharts.vue';
export default {
    name: 'objCard',
    components: {
        Devices,
        NetworkDrive,
        Return,
        LineCharts,
    },
    data() {
        return {
            PeriodStatus: {},
            LineChartsShowing: false,
            ChartsData: {
                ObjectIDs: [this.objectID],
                startTimestamp: 0,
                endTimestamp: 0,
                items: []
            },
            lastStatus: {
            },
            lastStatusStamp: 0,
            timedetal: 0,
        }
    },
    methods: {
        async refreshLastStatus() {
            var startTimestamp = 0
            var endTimestamp = Math.round(new Date().getTime() / 1000)
            var items = []
            for (let index = 0; index < this.statusList.length; index++) {
                items.push(this.statusList[index].statusName)
            }
            var objectIDs = []
            objectIDs.push(this.objectID)
            var density = 1
            var last = true
            var formatted = false
            var res = await network_manager.getStatus(objectIDs, items, startTimestamp, endTimestamp, density, last, formatted)
            this.lastStatusStamp = res[0].data[0]["reportTime"]
            this.lastStatus = res[0].data[0]["status"]
        },
        switchLineChartsShowing(item) {
            this.LineChartsShowing = !this.LineChartsShowing
            if (this.LineChartsShowing) {
                this.ChartsData.items = [item]
                this.ChartsData.endTimestamp = Math.floor(Date.now() / 1000)
                this.ChartsData.startTimestamp = this.ChartsData.endTimestamp - 60 * 60 * 24
            }
        },
        async refreshPeriodStatus() {
            var items = []
            for (let index = 0; index < this.statusList.length; index++) {
                items.push(this.statusList[index].statusName)
            }
            var objectIDs = []
            objectIDs.push(this.objectID)
            var last = false
            var density = 1
            // 以秒计的时间戳
            var endTime = Math.round(new Date().getTime() / 1000)
            endTime = Math.floor(Date.now() / 1000)
            var startTime = endTime - 60 * 60 * 2 * 5
            this.PeriodStatus = await network_manager.getPeriodStatus(objectIDs, items, startTime, endTime, density, last)
            this.PeriodStatus = this.PeriodStatus[0].data
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

        getDotTitle(startTime, endTime, count) {
            startTime = this.stamp2time(startTime)
            endTime = this.stamp2time(endTime)
            return startTime + ' ~ ' + endTime + ' 共' + count + '次异常数据'
        },
        getBackgroundColor(value) {
            if (value >= 70) {
                return '#F53F3F';
            } else if (value > 50) {
                return '#F77234';
            } else {
                return '#23C343';
            }
        },
        updateTimedetal() {
            this.timedetal = Math.floor(Date.now() / 1000) - this.lastStatusStamp;
        }
    },
    mounted() {
        this.refreshPeriodStatus()
        this.refreshLastStatus()
        this.updateTimedetal();
        setInterval(this.updateTimedetal, 1000); // 每秒更新一次
    },
    computed: {
        icon() {
            switch (this.category) {
                case 'device':
                    return 'Devices';
                case 'service':
                    return 'NetworkDrive';
                case 'server':
                    return 'NetworkDrive';
                default:
                    return '';
            }
        }
    },
    props: {
        category: {
            type: String,
            default: ''
        },
        objectName: {
            type: String,
            default: ''
        },
        objectID: {
            type: Number,
            default: ''
        },
        statusList: {
            type: Array,
            default: []
        }
    }
}

</script>