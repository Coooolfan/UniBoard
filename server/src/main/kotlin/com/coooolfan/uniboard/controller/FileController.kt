package com.coooolfan.uniboard.controller

import cn.dev33.satoken.annotation.SaCheckLogin
import com.coooolfan.uniboard.model.dto.NotePicture
import com.coooolfan.uniboard.service.FileService
import jakarta.servlet.http.HttpServletResponse
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody

/**
 * 文件控制器
 *
 * 处理文件的上传、下载和访问操作，包括文件记录下载、笔记图片、超链接图片和个人资料文件
 */
@RestController
@RequestMapping("/file")
class FileController(private val service: FileService) {

    /**
     * 通过UUID和文件名下载文件记录
     *
     * @param uuid 文件的唯一标识符
     * @param filename 文件名（用于下载时的文件名显示）
     * @param pw 可选的密码参数，用于访问受密码保护的文件
     * @param resp HTTP响应对象
     * @return StreamingResponseBody 文件流响应体
     */
    @GetMapping("/{uuid}/{filename}")
    fun downloadFileRecordWithFilename(
        @PathVariable uuid: String,
        @PathVariable filename: String,
        @RequestParam(required = false) pw: String?,
        resp: HttpServletResponse
    ): StreamingResponseBody {
        return service.downloadFileRecord(uuid, pw, resp)
    }

    /**
     * 通过UUID下载文件记录
     *
     * @param uuid 文件的唯一标识符
     * @param pw 可选的密码参数，用于访问受密码保护的文件
     * @param resp HTTP响应对象
     * @return StreamingResponseBody 文件流响应体
     */
    @GetMapping("/{uuid}")
    fun downloadFileRecord(
        @PathVariable uuid: String,
        @RequestParam(required = false) pw: String?,
        resp: HttpServletResponse
    ): StreamingResponseBody {
        return service.downloadFileRecord(uuid, pw, resp)
    }

    /**
     * 上传笔记图片
     *
     * 支持批量上传多个图片文件，用于笔记中的图片内容
     * 需要登录验证
     *
     * @param files 要上传的图片文件数组
     * @return List<NotePicture> 上传成功的图片信息列表
     */
    @PostMapping("/note")
    @SaCheckLogin
    fun uploadNotePicture(@RequestParam("file[]") files: Array<MultipartFile>): List<NotePicture> {
        return files.map { file ->
            service.uploadNotePicture(file)
        }
    }

    /**
     * 下载笔记图片
     *
     * 根据UUID获取笔记中的图片文件
     * 需要登录验证
     *
     * @param uuid 图片的唯一标识符
     * @param response HTTP响应对象
     * @return StreamingResponseBody 图片文件流响应体
     */
    @GetMapping("/note/{uuid}")
    @SaCheckLogin
    fun downloadNotePicture(@PathVariable uuid: String, response: HttpServletResponse): StreamingResponseBody {
        return service.downloadNotePicture(uuid, response)
    }

    /**
     * 下载超链接图片
     *
     * 获取与超链接关联的图片文件，通常用于显示链接的预览图或图标
     *
     * @param uuid 超链接图片的唯一标识符
     * @param response HTTP响应对象
     * @return StreamingResponseBody 图片文件流响应体
     */
    @GetMapping("/hyper-link/{uuid}")
    fun downloadHyperLinkPicture(@PathVariable uuid: String, response: HttpServletResponse): StreamingResponseBody {
        return service.downloadHyperLinkPicture(uuid, response)
    }

    /**
     * 下载个人资料文件
     *
     * 根据类别获取个人资料相关的文件，如头像、横幅图片或字体文件
     *
     * @param category 文件类别（如：avatar、banner、font等）
     * @param response HTTP响应对象
     * @return StreamingResponseBody 文件流响应体
     */
    @GetMapping("/profile/{category}")
    fun downloadProfileFile(@PathVariable category: String, response: HttpServletResponse): StreamingResponseBody {
        return service.downloadProfileFile(category, response)
    }
}