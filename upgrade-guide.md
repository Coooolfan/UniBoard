# 更新指南

本文将简要描述 UniBoard 在各个版本更新时的操作手册，指导您安全、优雅地完成版本升级操作。

## 如何阅读？

本文自上至下，每一节表示从旧版本升级到此版本需要做什么。所以您只需要找到**不大于**您目前的版本号，然后开始阅读即可。

有些时候您会发现本文没有提到您使用的版本，说明此版本升级无需任何人工介入，直接`docker compose pull`然后`docker compose up -d`即可。

## 0.3.0 - 发布于东八区 2025-05-03

很遗憾，这是一次彻底的破坏性更新。我们没有考虑任何升级迁移的可能。劳烦完全删除原组件，然后参照 README 重新安装。

## 0.4.0 - 发布于东八区 2025-07-05

我们在此版本再此尝试减少 Docker Compose 组件。现在前端服务和后端服务统一由 SpringBoot 提供。整个服务仅由`web`和`db`组成。希望这是我们最后一次调整 Docker Compose 文件。

### 暂停原有服务

进入到先前安装目录。停止原有服务。

```shell
docker compose stop
```

### 修改 Docker Compose 文件

> [!NOTE]
> 如果您在低版本直接使用了我们提供的`docker-compose.yml`文件，那么您只需要从此版本的 releases 中下载新版`docker-compose.yml`文件并替换您原有文件即可，无需其他操作。否则，请继续完成此小节⬇️

使用任意您喜欢的编辑器编辑`docker-compose.yml`文件。做以下修改：

1. 在 `web` 服务中添加原 `backend` 中所有的 `volumes` 选项
2. 修改 `web` 服务的 `depends_on` 值从 `backend` 到 `db`
3. 修改 `web` 服务的端口映射 `ports` 从 `{your_port}:80` 到 `{your_port}:8080`
4. 移除整个 `backend` 服务
5. 修改 `web` 服务的 `container_name` 的值为 `uniboard-web`（可选）

### 拉取新镜像并启动

```shell
docker compose pull && docker compose up -d
```

