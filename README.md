# UniBoard

个人主页 + 导航页 + 笔记 + 短链接 + 文件中转站

此仓库仅为前端页面代码，使用 Vue3 + TS + Primevue4 构建。[后端仓库地址点此访问。](https://github.com/Coooolfan/UniBoard-Service)

## 功能介绍

- 首页个人信息与横幅展示
- 导航页的外链展示与跳转
- 账号密码登录
  - 在主页单击名字，账号密码输入框会弹出
- 云笔记模块
- 短链服务
- 文件存储/分享/直链下载/鉴权
- 着陆页的所有内容可编辑

## 截图

### 着陆页

![着陆页首屏](img/LandingPage1.png)
![着陆页第二屏](img/LandingPage2.png)
![着陆页登录组件](img/login.jpg)

### 主页

![主页仪表盘](img/HomePage0.png)
空荡荡的仪表盘是为了之后放探针服务的全屏展示的~
![主页功能模块](img/HomePage.jpg)

### 文件分享页

![文件分享页面](img/FileSharePage.png)

## 画大饼中……

- 界面优雅且功能精简的探针服务

## 部署与安装

### Docker

此README的wget目标可能未指向最新版本，建议**前往releases查看各个版本的部署指南**

1. 下载`.env`文件和`docker-compsoe.yml`文件

    ```shell
    mkdir uniboard
    cd uniboard
    wget https://github.com/Coooolfan/UniBoard/releases/download/v0.2.0-beta/docker-compose.yml    
    wget https://github.com/Coooolfan/UniBoard/releases/download/v0.2.0-beta/example.env
    ```

2. 按照需要修改`.env`文件和`docker-compsoe.yml`

    1. `docker-compsoe.yml`：默认只暴露`8888`端口（文件第8行），通过此端口向外暴露所有服务，如果您需要对`uniboard`配置反向代理，只需代理此端口即可。
    2. `.env`：按照提示修改即可，切记要修改`DJANGO_SUPERUSER_PASSWORD`的值，**不要使用默认值!**
    3. 修改完成后复制`example.env`为`.env`文件供`docker compose`服务调取

        ```shell
        cp example.env .env
        ```

3. 使用`docker compose`命令启动服务

    ```shell
    docker compose up -d
    ```

4. 使用浏览器访问站点，默认为`8888`端口，如果您在本机部署，即访问`http://localhost:8888`即可
