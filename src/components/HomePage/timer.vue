<template>
    <div class="HomePage-Line1-Timer" v-fullscreen.teleport="options">
        <div class="HomePage-Line1-Timer-min">
            <span v-for="(item, index) of time" class="HomePage-Line1-Timer-item">{{ item }}</span>
        </div>
    </div>
</template>
<script>
import '../../assets/styles/timer.css';
import { DateTime } from 'luxon';
import { directive as fullscreen } from 'vue-fullscreen'
export default {
    name: 'timer',
    directives: {
        fullscreen
    },
    data() {
        return {
            intervalId: null,
            time: '',
            isFullscreen: false,
            options: {
                target: ".HomePage-Line1-Timer",
                callback() {
                    this.isFullscreen = !this.isFullscreen;
                },
                fullscreenClass: "HomePage-Line1-Timer-fullscreen"
            },
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
    computed: {
        icon() {
            return this.isFullscreen ? 'OffScreen' : 'FullScreen';
        }
    }
};
</script>