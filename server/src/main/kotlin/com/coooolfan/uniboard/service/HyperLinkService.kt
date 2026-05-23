package com.coooolfan.uniboard.service

import com.coooolfan.uniboard.error.HyperLinkException
import com.coooolfan.uniboard.model.BaseSimpleFile
import com.coooolfan.uniboard.model.HyperLink
import com.coooolfan.uniboard.model.dto.HyperLinkInsert
import com.coooolfan.uniboard.model.dto.HyperLinkInsertBySnapShot
import com.coooolfan.uniboard.model.dto.HyperLinkOrderUpdate
import com.coooolfan.uniboard.repo.HyperLinkRepo
import com.coooolfan.uniboard.utils.SaveFileResult
import com.coooolfan.uniboard.utils.fetchIconFile
import com.coooolfan.uniboard.utils.fetchWebPageMetadata
import org.babyfish.jimmer.sql.ast.mutation.SaveMode
import org.babyfish.jimmer.sql.fetcher.Fetcher
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.nio.file.Paths
import java.util.*

@Service
class HyperLinkService(private val repo: HyperLinkRepo) {
    fun findAll(fetcher: Fetcher<HyperLink>, isLogin: Boolean) = repo.findByIfLogin(fetcher, isLogin)

    fun deleteById(id: Long) = repo.deleteById(id)

    fun update(update: HyperLink, file: MultipartFile?, fetcher: Fetcher<HyperLink>): HyperLink {
        if (file == null) {
            return repo.saveCommand(update, SaveMode.UPDATE_ONLY).execute(fetcher).modifiedEntity
        }
        val (relativePath, fileName) = saveFile(file)
        return repo.saveCommand(
            HyperLink(update) {
                this.icon {
                    this.filename = fileName
                    this.filepath = relativePath
                }
            },
            SaveMode.UPDATE_ONLY
        ).execute(fetcher).modifiedEntity
    }

    fun updateSort(updateList: List<HyperLinkOrderUpdate>) {
        try {
            repo.saveInputsCommand(updateList, SaveMode.UPDATE_ONLY).execute()
        } catch (_: Exception) {
            throw HyperLinkException.UpdateSortFailed()
        }
    }

    fun insert(insert: HyperLinkInsert, file: MultipartFile, fetcher: Fetcher<HyperLink>): HyperLink {
        val (relativePath, fileName) = saveFile(file)
        return repo.saveCommand(
            insert.toEntity {
                this.icon {
                    this.filename = fileName
                    this.filepath = relativePath
                }
            },
            SaveMode.INSERT_ONLY
        ).execute(fetcher).modifiedEntity
    }

    fun insertHyperLinkBySnapshot(insert: HyperLinkInsertBySnapShot, fetcher: Fetcher<HyperLink>): HyperLink {
        val metadataFetched = fetchWebPageMetadata(insert.url)
        val iconFile = metadataFetched.iconUrl?.let(::fetchIconFile)

        val hyperLinkIcon = iconFile
            ?.let(::saveFile)
            ?.let { BaseSimpleFile { filename = it.fileName; filepath = it.relativePath } }
            ?: BaseSimpleFile { filename = "favicon.ico"; filepath = "/favicon.ico" }

        val newHyperLinkInsertMocked = HyperLink {
            title = metadataFetched.title
            description = metadataFetched.description
            url = insert.url
            color = "f2f2f2"
            icon = hyperLinkIcon
            public = insert.public
        }
        return repo.saveCommand(
            newHyperLinkInsertMocked,
            SaveMode.INSERT_ONLY
        ).execute(fetcher).modifiedEntity
    }


    /**
     * 保存文件并返回相对路径
     */
    private fun saveFile(file: MultipartFile): SaveFileResult {
        val fileFormat = file.originalFilename?.substringAfterLast('.') ?: "jpg"
        val fileName = "${UUID.randomUUID()}.$fileFormat"
        val relativePath = Paths.get("service/hyper-link/${fileName}")
        val filePath = Paths.get(System.getProperty("user.dir")).resolve(relativePath)
        filePath.parent.toFile().mkdirs()
        file.transferTo(filePath.toFile())
        return SaveFileResult("file/hyper-link/${fileName}", fileName)
    }

    /**
     * 保存文件并返回相对路径
     */
    private fun saveFile(file: File): SaveFileResult {
        val fileFormat = file.name.substringAfterLast('.', "jpg")
        val fileName = "${UUID.randomUUID()}.$fileFormat"
        val relativePath = Paths.get("service/hyper-link/${fileName}")
        val filePath = Paths.get(System.getProperty("user.dir")).resolve(relativePath)
        filePath.parent.toFile().mkdirs()
        file.copyTo(filePath.toFile(), overwrite = true)
        return SaveFileResult("file/hyper-link/${fileName}", fileName)
    }
}
