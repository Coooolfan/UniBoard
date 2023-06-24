<template>
    <div class="LandingPage">
        <div class="page1">
            <p v-if="msg !== ''" style="padding: 0;margin: 0;">{{ msg }}</p>
            <img src="https://res.coooolfan.com/c-q.jpg" alt="头像" class="page1-avater" @click="jump2blog">
            <p class="page1-name">{{ userName }}</p>
            <p class="page1-intro">{{ intro }}</p>
            <div class="page1-btns">
                <div class="page1-btns-item" v-for="(item, index) in contacts" :key="index" @click="newWindow(item.link)">
                    <component :is="item.icon"></component>
                </div>
            </div>
            <p class="page1-msg">欢迎回来,点击头像往博客或者向下滑动来浏览更多页面</p>
        </div>
        <div class="page2">
            <p class="page2-title">选择一个页面继续</p>
            <p class="page2-intro">此页面的中的内容并非全部公开项</p>
            <div class="page2-cards-list">
                <div class="page2-cards-item" v-for="(item, index) in links" :key="index" @click="newWindow(item.link)">
                    <div class="page2-cards-words">
                        <p class="page2-cards-item-title">{{ item.title }}</p>
                        <p class="page2-cards-item-intro">{{ item.intro }}</p>
                    </div>
                    <component class="page2-cards-item-icon" :is="item.icon" :style="{ 'background-color': item.color }">
                    </component>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
import '../../assets/styles/LandingPage.css'
import { network_manager } from '../../api/network.js'
import { localstorge_manager } from '../../api/localstorage.js'
import { Telegram, Github, Mail, Editor, CloudStorage, SmartOptimization, AirConditioning, NetworkDrive } from '@icon-park/vue-next'
export default {
    name: 'LandingPage',
    components: {
        Telegram,
        Github,
        Mail,
        Editor,
        CloudStorage,
        SmartOptimization,
        AirConditioning,
    },
    data() {
        return {
            msg: "",
            userName: "Yang YiFan",
            intro: "学生、摄影爱好者、Minecraft玩家",
            contacts: [
                {
                    title: 'Telegram',
                    link: 'https://t.me/coolfan1024',
                    icon: "telegram",
                },
                {
                    title: 'Github',
                    link: 'https://github.com/Coooolfan',
                    icon: "github",

                },
                {
                    title: 'Email',
                    link: 'mailto:coolfan1024@gmail.com',
                    icon: "mail",
                },
            ],

            links: [
                {
                    title: '博客',
                    intro: '记录生活、学习、摄影的地方',
                    link: 'https://coooolfan.com',
                    icon: "editor",
                    color: "grey",
                },
                {
                    title: '网盘',
                    intro: '存放一些文件的地方',
                    link: 'https://drive.coooolfan.com',
                    icon: "CloudStorage",
                    color: "#87CEFA",

                },
                {
                    title: 'GPT',
                    intro: '来自OPENAI的力量',
                    link: 'https://chat.coooolfan.com',
                    icon: "SmartOptimization",
                    color: "#18A058",

                },
                {
                    title: '空调',
                    intro: '轻凉一下~',
                    link: 'https://yangyi.fan/air_condition',
                    icon: "AirConditioning",
                    color: "#DCE2F1",
                },
            ]
        }
    },
    created() {
        // window.addEventListener("keyup", this.enterSearch)
    },
    methods: {
        async enterSearch(e) {
            // 如果按下的是数字
            if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105) {
                var token = await network_manager.postKey(e.key)
                // 存储token，保存登录状态，刷新后跳转到首页
                if (token !== undefined) {
                    localstorge_manager.setToken(token)
                    this.msg = "登录成功"
                    localstorge_manager.setPage('HomePage')
                    window.location.reload()
                }
            }
        },
        newWindow(url) {
            window.open(url)
        },
    },
    destroyed() {
        window.removeEventListener("keyup", this.enterSearch)
    },
}
</script>