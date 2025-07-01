### web前端构建阶段 ###
FROM node:22 AS web-build-stage
WORKDIR /app

# 定义版本参数，默认为latest
ARG TAG_VERSION=latest

# 优化git clone，减少下载大小
RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    git clone --depth=1 https://github.com/coooolfan/uniboard.git . && \
    if [ "$TAG_VERSION" != "latest" ]; then git fetch --depth=1 origin tag $TAG_VERSION && git checkout $TAG_VERSION; fi && \
    corepack enable && \
    yarn && \
    yarn build

### 后端构建阶段 ###
FROM ibm-semeru-runtimes:open-23-jdk-noble AS backend-build-stage
WORKDIR /app

# 定义版本参数，默认为latest
ARG TAG_VERSION=latest

# 优化git clone，减少下载大小
RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    git clone --depth=1 https://github.com/coooolfan/uniboard-service.git . && \
    if [ "$TAG_VERSION" != "latest" ]; then git fetch --depth=1 origin tag $TAG_VERSION && git checkout $TAG_VERSION; fi

# 从前端构建阶段复制构建结果到后端静态资源目录
COPY --from=web-build-stage /app/dist /app/src/main/resources/static

# 缓存依赖并构建项目
RUN ./gradlew assemble --no-daemon 

### 生产阶段 ###
FROM ibm-semeru-runtimes:open-23-jre-noble
WORKDIR /app

# 从构建阶段复制构建结果
COPY --from=backend-build-stage /app/build/libs/*.jar app.jar

# 暴露应用端口(默认Spring Boot端口)
EXPOSE 8080

# 设置JVM参数
ENV JAVA_OPTS=""

# 启动应用
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]