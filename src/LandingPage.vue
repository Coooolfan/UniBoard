<template>
    <div class="LandingPage">
        <div class="page1">
            <img src="https://res.coooolfan.com/c-q.jpg" alt="头像" class="page1-avater" @click="jump2blog">
            <p class="page1-name">Yang YiFan</p>
            <p class="page1-intro">学生、摄影爱好者、Minecraft玩家</p>
            <div class="page1-btns">
                <telegram class="page1-btns-item" theme="outline" size="24" fill="#333" @click="jump2tg" />
                <github class="page1-btns-item" theme="outline" size="24" fill="#333" @click="jump2github" />
                <mail class="page1-btns-item" theme="outline" size="24" fill="#333" @click="jump2email" />
            </div>
            <p class="page1-msg">欢迎回来，点击头像往博客或者向下滑动来浏览更多页面</p>
        </div>
        <div class="page2">
            <p>此页面的中的内容并非全部公开项</p>
        </div>
    </div>
</template>
<script>
import '../src/assets/styles/LandingPage.css'
import { Telegram, Github, Mail } from '@icon-park/vue-next'
export default {
    name: 'LandingPage',
    components: {
        Telegram,
        Github,
        Mail
    },
    data() {
        return {
        }
    },
    methods: {
        jump2blog() {
            window.open('https://coooolfan.com')
        },
        jump2tg() {
            window.open('https://t.me/coolfan1024')
        },
        jump2github() {
            window.open('https://github.com/Coooolfan')
        },
        jump2email() {
            window.open('mailto:coolfan1024@gmail.com')
        }
    }
}
</script>