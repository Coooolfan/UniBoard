<template>
    <div class="HomePage-notebox">
        <textarea class="note-inputbox" type="text" v-model="note_content"></textarea>
        <div class="note-input-btns" @click="switchStatus()">
            <div class="note-input-btns-item1">
                <Notes></Notes>
                <div>{{ msg }}</div>
            </div>
            <div class="note-input-btns-item2">
                <dot class="note-input-status" :style="{ color: dot_color }"></dot>
                <div class="note-input-msg">{{ note_msg }}</div>
            </div>

        </div>
    </div>
</template>
<script>
import '../../assets/styles/note.css';
import { network_manager } from '../../api/network.js'
import { Dot, Notes } from '@icon-park/vue-next';
export default {
    components: {
        Dot,
        Notes,
    },
    name: 'note',
    watch: {
        note_content: {
            handler() {
                this.last_edited = new Date().getTime()
                this.postNote();
            },
        },
    },
    data() {
        return {
            msg: "Note",
            intervalId: null,
            note_content: "",
            note_msg: "Loading",
            last_edited: 0,
        };
    },
    computed: {
        dot_color() {
            if (this.note_msg === "Online") {
                return "#00FF00";
            } else if (this.note_msg === "Loading") {
                return "#FFFF00";
            } else if (this.note_msg === "Offline") {
                return "#FF0000";
            }
        },
    },
    mounted() {
        this.intervalId = setInterval(() => {
            this.note_msg = "Loading";
            this.getNote();
        }, 1000);
    },
    destroyed() {
        clearInterval(this.intervalId);
    },
    methods: {
        async getNote() {
            var new_content = await network_manager.getNote();
            var remote_last_edited = new_content["last edited"];
            // 比较本地和远程时间
            if (remote_last_edited > this.last_edited || this.note_content === "") {
                this.note_content = new_content["content"];
                this.note_msg = "Online";
            } else {
                this.note_msg = "Online";
            }

        },
        postNote() {
            if (this.note_msg === "Online") {
            } else {
                this.note_msg = "Posted"
            }
            network_manager.postNote(this.note_content);
        },
        switchStatus() {
            // 离线状态下，点击切换为在线状态, 并且开始轮询
            if (this.note_msg === "Online") {
                this.note_msg = "Offline";
                clearInterval(this.intervalId);
            } else {
                this.intervalId = setInterval(() => {
                    this.note_msg = "Loading";
                    this.getNote();
                }, 1000);
            }
        },
    },
};
</script>