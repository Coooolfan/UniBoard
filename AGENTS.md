UniBoard 是个人主页、导航页、笔记、短链接与文件分享服务。

# 项目结构

- 此文件夹为项目根目录。使用 monorepo 管理多个工程，前后端分离。
- **后端**: 于 `./server` 文件夹。Spring Boot, Gradle, Kotlin, JVM 24。
- **前端**: 于 `./web` 文件夹。Vue, TypeScript, Vite, PrimeVue, Tailwind CSS。

# 注意事项

- 前端 API 客户端位于 `./web/src/__generated`，由 `yarn api` 生成，不要手动修改。
- 后端 Jimmer DTO 与生成代码由 Gradle/KSP 管理，不要手动修改生成产物。
