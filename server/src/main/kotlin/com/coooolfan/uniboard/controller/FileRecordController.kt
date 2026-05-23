package com.coooolfan.uniboard.controller

import cn.dev33.satoken.annotation.SaCheckLogin
import com.coooolfan.uniboard.error.FileRecordException
import com.coooolfan.uniboard.model.FileRecord
import com.coooolfan.uniboard.model.by
import com.coooolfan.uniboard.model.dto.*
import com.coooolfan.uniboard.service.FileRecordService
import org.babyfish.jimmer.Page
import org.babyfish.jimmer.client.FetchBy
import org.babyfish.jimmer.sql.kt.fetcher.newFetcher
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

/**
 * 文件记录控制器
 *
 * 处理文件记录的管理操作，包括文件上传、下载、分享、更新和删除等功能
 */
@RestController
@RequestMapping("/api/file-record")
class FileRecordController(private val service: FileRecordService) {
    /**
     * 获取所有文件记录（分页）
     *
     * 获取当前用户上传的文件记录列表，支持分页查询
     * 需要登录验证
     *
     * @param pageIndex 页面索引（从0开始）
     * @param pageSize 每页大小
     * @return Page<FileRecord> 分页的文件记录列表
     */
    @GetMapping
    @SaCheckLogin
    fun getAllFileRecords(
        @RequestParam pageIndex: Int,
        @RequestParam pageSize: Int
    ): Page<@FetchBy("DEFAULT_FILERECORD") FileRecord> {
        return service.findByPage(pageIndex, pageSize, DEFAULT_FILERECORD)
    }

    /**
     * 根据ID更新文件记录
     *
     * 更新指定文件记录的信息，如描述、可见性、密码等
     * 需要登录验证
     *
     * @param id 文件记录ID
     * @param update 文件记录更新数据
     * @return FileRecord 更新后的文件记录
     * @throws FileRecordException.EmptyPassword 当设置密码保护但密码为空时抛出
     */
    @PutMapping("/{id}")
    @SaCheckLogin
    @Throws(FileRecordException.EmptyPassword::class)
    fun updateFileRecordById(
        @PathVariable id: Long,
        @RequestBody update: FileRecordUpdate
    ): @FetchBy("DEFAULT_FILERECORD") FileRecord {
        return service.update(update.toEntity { this.id = id }, DEFAULT_FILERECORD)
    }

    /**
     * 根据分享码获取文件记录
     *
     * 公共接口，用于文件分享页的内容获取，无需登录验证
     * 返回文件的公开信息，不包含敏感数据
     *
     * @param shareCode 文件分享码
     * @return FileRecordPublic 文件记录的公开信息
     */
    @GetMapping("/{shareCode}")
    fun getFileRecordByShareCode(@PathVariable shareCode: String): FileRecordPublic {
        return service.findByByShareCode(shareCode)
    }

    /**
     * 根据ID删除文件记录
     *
     * 删除指定的文件记录及其关联的文件
     * 需要登录验证
     *
     * @param id 要删除的文件记录ID
     */
    @DeleteMapping("/{id}")
    @SaCheckLogin
    fun deleteFileRecordById(@PathVariable id: Long) {
        service.deleteById(id)
    }

    /**
     * 上传文件
     *
     * 上传新文件并创建文件记录，支持设置描述、可见性和密码保护
     * 需要登录验证
     *
     * @param insert 文件记录创建数据
     * @param file 要上传的文件
     * @return FileRecord 创建的文件记录
     * @throws FileRecordException.EmptyPassword 当设置密码保护但密码为空时抛出
     */
    @PostMapping("/files")
    @SaCheckLogin
    @Throws(FileRecordException.EmptyPassword::class)
    fun uploadFile(
        @RequestPart insert: FileRecordInsert,
        @RequestPart file: MultipartFile
    ): @FetchBy("DEFAULT_FILERECORD") FileRecord {
        return service.insert(insert, file, DEFAULT_FILERECORD)
    }

    /**
     * 创建文件直链
     *
     * 为指定的文件记录创建直接下载链接，用于快速访问文件
     * 需要登录验证
     *
     * @param create 直链创建请求数据
     * @return FileRecordDirectLinkResp 包含直链信息的响应
     */
    @PostMapping("/direct-link")
    @SaCheckLogin
    fun createDirectLink(create: FileRecordDirectLinkCreate): FileRecordDirectLinkResp {
        return service.createDirectLink(create)
    }

    companion object {
        private val DEFAULT_FILERECORD = newFetcher(FileRecord::class).by {
            allScalarFields()
        }
    }

}