<template>
    <div class="obj-card">
        <div class="obj-card-left">
            <component :is='icon' class="obj-card-left-icon"></component>
            <p>{{ objectName }}</p>
        </div>
    </div>
</template>
<script>
import '../../assets/styles/objCard.css';
import { Devices, NetworkDrive } from '@icon-park/vue-next';
export default {
    name: 'objCard',
    components: {
        Devices,
        NetworkDrive
    },
    data() {
        return {
        }
    },
    methods: {

    },
    mounted() {

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
            type: Number,
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