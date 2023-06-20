<template>
    <div class="LandingPage">
        <div class="page1">
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
import { Telegram, Github, Mail, Editor, CloudStorage, SmartOptimization } from '@icon-park/vue-next'
export default {
    name: 'LandingPage',
    components: {
        Telegram,
        Github,
        Mail,
        Editor,
        CloudStorage,
        SmartOptimization,
    },
    data() {
        return {
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
            ]
        }
    },
    methods: {
        newWindow(url) {
            window.open(url)
        },
    }
}
</script>