<template>
    <p class="HomePage-Line1-Timer">
        <span v-for="(item,index) of time" class="HomePage-Line1-Timer-item">{{ item }}</span>
    </p>
</template>
<script>
import '../../assets/styles/timer.css';
import { DateTime } from 'luxon';

export default {
    name: 'timer',
    data() {
        return {
            intervalId: null,
            time: '',
        };
    },
    mounted() {
        this.intervalId = setInterval(() => {
            this.time = DateTime.local().toFormat('HH:mm:ss');
        }, 10);
    },
    beforeDestroy() {
        clearInterval(this.intervalId);
    },
};
</script>