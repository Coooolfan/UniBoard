# UniBoard

个人主页 + 导航页 + 笔记 + 短链接 + 文件分享

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
    wget https://github.com/Coooolfan/UniBoard/releases/download/v0.2.3/docker-compose.yml    
    wget https://github.com/Coooolfan/UniBoard/releases/download/v0.2.3/example.env
    ```

2. 按照需要修改`.env`文件和`docker-compsoe.yml`

    1. `docker-compsoe.yml`：默认只暴露`8888`端口（文件第8行），通过此端口向外暴露所有服务，如果您需要对`uniboard`配置反向代理，只需代理此端口即可。
    2. `.env`：按照提示修改即可，切记要修改`DJANGO_SUPERUSER_PASSWORD`的值，**不要使用默认值!**
    3. 修改完成后复制`example.env`为`.env`文件,供`docker compose`服务调取

        ```shell
        cp example.env .env
        ```

3. 使用`docker compose`命令启动服务

    ```shell
    docker compose up -d
    ```

4. 使用浏览器访问站点，默认为`8888`端口，如果您在本机部署，即访问`http://localhost:8888`即可

### 使用Nginx配置反向代理(可选)

Uniboard程序本身不提供ssl相关功能，直接暴露8888端口不是一个好的选择。

考虑到不同环境下Nginx的配置可能并不相同，下文仅提供思路和必要配置。

1. 创建对应站点的conf文件

2. 编辑监听的server_name, ssl相关内容

3. 配置反向代理

    ```conf
    client_max_body_size 0; # 设置最大包大小为无上限
    location / {
        proxy_pass http://127.0.0.1:8888;
        proxy_set_header Host $host; # 保留代理之前的host
        proxy_set_header X-Real-IP $remote_addr; # 保留代理之前的真实客户端ip
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header HTTP_X_FORWARDED_FOR $remote_addr; # 在多级代理的情况下，记录每次代理之前的客户端真实ip
        proxy_set_header X-Forwarded-Proto $scheme; # 表示客户端真实的协议（http还是https）
        proxy_redirect default; # 指定修改被代理服务器返回的响应头中的location头域跟refresh头域数值
        proxy_buffering off;
    }
    ```

4. 让Nginx重新加载配置

    ```shell
    nginx -s reload
    ```

## 升级

除非特殊说明，升级时只需将容器版本指向最新版本即可。

**建议参照Release页面的更新日志进行升级。如无警告，直接升级即可。**

### 手动编辑`docker-compose.yml`文件

1. 编辑`docker-compose.yml`文件第5行和第17行，将`image`字段最后一个`:`后的版本号改为最新版本即可。

2. 重新启动服务

    ```shell
    # docker 会自动下载最新版本的镜像并启动服务
    docker compose up -d
    ```

### 重新下载`docker-compose.yml`文件

1. 下载最新的`docker-compose.yml`文件

    ```shell
    wget https://github.com/Coooolfan/UniBoard/releases/download/v0.2.3/docker-compose.yml
    ```

2. 按照需要修改`docker-compose.yml`文件

3. 重新启动服务

    ```shell
    # docker 会自动下载最新版本的镜像并启动服务
    docker compose up -d
    ```

## API

可见：<https://github.com/Coooolfan/UniBoard-Service/blob/main/api/urls/index.py>和<https://github.com/Coooolfan/UniBoard-Service/blob/main/UniBoard/urls.py>

其中`api.urls.index.py`中的路径需要加上`/api/`的前缀。

### 与文件相关的API说明

注意：所有涉及**增删改**的操作都要带上`jwt_token`，即在请求头中加上`Authorization : Bearer <token string>`。

1. 上传文件
    - `POST /api/file-records/`：上传文件，参数为[`FileRecord`对象](https://github.com/Coooolfan/UniBoard-Service/blob/main/api/models/FileRecord.py)，其中的`share_code`字段会被忽略，由服务器生成。返回新增成功的`FileRecord`对象，包含生成的`share_code`字段。注意上传时使用`multipart/form-data`格式，以携带二进制文件。

2. 编辑文件信息  
    - `PATCH /api/file-records/<int:file_id>/`：编辑文件信息，参数为[`FileRecord`对象](https://github.com/Coooolfan/UniBoard-Service/blob/main/api/models/FileRecord.py)，返回修改成功的`FileRecord`对象。如果要修改文件的`file`字段，需要使用`multipart/form-data`格式，以携带二进制文件。

3. 获取文件列表
    - `GET /api/file-records/`：获取文件列表，返回[`FileRecord`对象](https://github.com/Coooolfan/UniBoard-Service/blob/main/api/models/FileRecord.py)列表。（此方法需要携带`jwt_token`）

4. 获取文件下载直链
    - `GET /api/file-records/<int:file_id>/token/`：获取文件下载直链，返回一个UUID。使用`5`中的API，替换`<str:UUID>`为UUID即可。获取的地址在5分钟后会失效。（此方法需要携带`jwt_token`，对所有文件都有效）

5. 使用API直接下载文件

    此API不需要携带`jwt_token`，对非私有文件有效。(wget下载时需要加上`--content-disposition`参数)
    - `GET /file/<str:UUID>/`：使用此API直接下载文件，`UUID`为`4`中返回的UUID。此API不需要携带`jwt_token`，对所有文件有效。
    - `GET /file/<str:share_code>/?pw=<str:password>`：使用此API直接下载**非私有文件**，`share_code`为文件的`share_code`字段，`password`即为文件设置的密码，**密码参数可选**。
    - 部分客户端默认不支持使用content-disposition设定文件名，您可以在路径最后加上文件名来为这些客户端提供文件名。比如`localhost/file/UUID/文件名`或者`localhost/file/share_code/文件名`。其中`文件名`不参与任何服务端的逻辑，仅用于客户端显性显示文件名。对于密码保护的文件，需要在路径中加上`?pw=文件密码`。例如`localhost/file/i2S3/sky.png?pw=123456`，这样可以直接下载`share_code`为`i2S3`的文件并显性地向客户端文件名为`sky.png`，其中密码为`123456`。
