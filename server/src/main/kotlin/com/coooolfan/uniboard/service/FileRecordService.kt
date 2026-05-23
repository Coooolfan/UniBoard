package com.coooolfan.uniboard.service

import com.coooolfan.uniboard.error.CommonException
import com.coooolfan.uniboard.error.FileRecordException
import com.coooolfan.uniboard.model.FileRecord
import com.coooolfan.uniboard.model.FileRecordVisibility
import com.coooolfan.uniboard.model.dto.FileRecordDirectLinkCreate
import com.coooolfan.uniboard.model.dto.FileRecordDirectLinkResp
import com.coooolfan.uniboard.model.dto.FileRecordInsert
import com.coooolfan.uniboard.model.dto.FileRecordPublic
import com.coooolfan.uniboard.repo.FileRecordRepo
import com.coooolfan.uniboard.utils.getHashedString
import com.github.benmanes.caffeine.cache.Cache
import org.babyfish.jimmer.Page
import org.babyfish.jimmer.spring.repo.PageParam
import org.babyfish.jimmer.sql.ast.mutation.SaveMode
import org.babyfish.jimmer.sql.fetcher.Fetcher
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.nio.file.Paths
import java.util.*

@Service
class FileRecordService(
    private val repo: FileRecordRepo,
    private val directDownloadLinkCache: Cache<String, Long>
) {
    fun findByPage(pageIndex: Int, pageSize: Int, fetcher: Fetcher<FileRecord>): Page<FileRecord> {
        return findByPage(PageParam.byNo(pageIndex, pageSize), fetcher)
    }

    fun findByPage(pageParam: PageParam, fetcher: Fetcher<FileRecord>): Page<FileRecord> {
        return repo.findPage(pageParam, fetcher) {
            asc(FileRecord::id)
        }
    }

    fun findByByShareCode(shareCode: String): FileRecordPublic {
        val findByShareCode = repo.findByShareCode(shareCode)
            ?: throw CommonException.notFound()
        return FileRecordPublic(findByShareCode)
    }

    fun deleteById(id: Long) = repo.deleteById(id)

    fun update(update: FileRecord, fetcher: Fetcher<FileRecord>): FileRecord {
        return repo.saveCommand(update, SaveMode.UPDATE_ONLY).execute(fetcher).modifiedEntity
    }

    fun insert(insert: FileRecordInsert, file: MultipartFile, fetcher: Fetcher<FileRecord>): FileRecord {
        if (insert.visibility == FileRecordVisibility.PASSWORD && insert.password.trim().isEmpty())
            throw FileRecordException.EmptyPassword()

        val relativePath = Paths.get("service/filerecord/${UUID.randomUUID()}")
        val filePath = Paths.get(System.getProperty("user.dir")).resolve(relativePath)
        filePath.parent.toFile().mkdirs()
        file.transferTo(filePath.toFile())
        val shareCode = getHashedString(filePath.toString())
        return repo.saveCommand(
            insert.toEntity {
                this.shareCode = shareCode
                this.file { this.filepath = relativePath.toString() }
            },
            SaveMode.INSERT_ONLY
        ).execute(fetcher).modifiedEntity
    }

    fun createDirectLink(create: FileRecordDirectLinkCreate): FileRecordDirectLinkResp {
        val uuid = UUID.randomUUID().toString()
        directDownloadLinkCache.put(uuid, create.id)
        return FileRecordDirectLinkResp(
            id = create.id,
            directUUID = uuid,
        )
    }

    fun cleanFileRecordsFromDisk() {
        // FileRecord 在插入的时候先将文件存储在磁盘上，然后再将文件记录插入到数据库中
        // 在判断时候需要删除的时候，先读读取数据库中的记录，再读取磁盘上的文件
        // 以避免在写盘和插入之间触发清理的情况

        val fileRecordDir =
            Paths.get(System.getProperty("user.dir")).resolve("service/filerecord").toFile()
        if (!fileRecordDir.exists() || !fileRecordDir.isDirectory)
            return

        // 第一次检查
        val filesToDelete1 = findFilesToDelete(fileRecordDir)

        Thread.sleep(3000)

        // 第二次检查
        val filesToDelete2 = findFilesToDelete(fileRecordDir)
        // 计算两次检查的交集
        val filesToDeleteFinal = filesToDelete1.intersect(filesToDelete2)

        // 删除确认的文件
        filesToDeleteFinal.forEach { file ->
            if (file.exists()) file.delete()
        }
    }

    /**
     * 查找需要删除的文件
     *
     * @param fileRecordDir 文件存储目录
     * @return 需要删除的文件列表
     */
    private fun findFilesToDelete(fileRecordDir: File): List<File> {
        val filesInDb = repo.findAll()
        val filesOnDisk = fileRecordDir.walkTopDown().filter { it.isFile }.toList()

        // 构建数据库文件路径的 Set，提高查找效率
        val normalizedDbPaths = filesInDb
            .map { it.file.filepath.replace('/', File.separatorChar) }
            .toSet()

        return filesOnDisk.filter { fileOnDisk ->
            val canonicalPath = fileOnDisk.canonicalPath
            normalizedDbPaths.none { dbPath ->
                canonicalPath.endsWith(dbPath)
            }
        }
    }
}
