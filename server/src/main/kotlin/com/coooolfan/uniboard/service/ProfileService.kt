package com.coooolfan.uniboard.service

import cn.dev33.satoken.stp.StpUtil
import com.coooolfan.uniboard.error.CommonException
import com.coooolfan.uniboard.error.ProfileException
import com.coooolfan.uniboard.model.Profile
import com.coooolfan.uniboard.model.ProfileDraft
import com.coooolfan.uniboard.model.SystemConfig
import com.coooolfan.uniboard.model.dto.PasswordUpdate
import com.coooolfan.uniboard.model.dto.ProfileCreate
import com.coooolfan.uniboard.model.dto.ProfileLogin
import com.coooolfan.uniboard.model.dto.ProfileUpdate
import com.coooolfan.uniboard.repo.ProfileRepo
import com.coooolfan.uniboard.repo.SystemConfigRepo
import com.coooolfan.uniboard.utils.SaveFileResult
import org.babyfish.jimmer.sql.ast.mutation.SaveMode
import org.babyfish.jimmer.sql.fetcher.Fetcher
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Paths
import java.security.MessageDigest

@Service
class ProfileService(private val repo: ProfileRepo, private val sysRepo: SystemConfigRepo) {
    fun getProfile(fetcher: Fetcher<Profile>): Profile {
        return repo.findById(0, fetcher) ?: throw ProfileException.SystemUninitialized()
    }

    @Transactional
    fun createProfile(create: ProfileCreate, avatar: MultipartFile?, banner: MultipartFile?, font: MultipartFile?) {
        if (repo.count() > 0) throw ProfileException.SystemAlreadyInitialized()
        if (create.loginName.trim().isEmpty()) throw ProfileException.EmptyLoginName()
        if (create.name.trim().isEmpty()) throw ProfileException.EmptyName()
        repo.saveCommand(create.toEntity {
            id = 0
            applyProfileFiles(this, avatar, banner, font)
            loginPassword = hashPassword(create.loginPassword)
        }, SaveMode.INSERT_ONLY).execute()
        sysRepo.saveCommand(SystemConfig {
            id = 0
            host = ""
            showProfile = true
            showCopyRight = true
        }, SaveMode.UPSERT).execute()
    }

    fun updateProfile(update: ProfileUpdate, avatar: MultipartFile?, banner: MultipartFile?, font: MultipartFile?) {
        if (repo.count() == 0.toLong()) throw ProfileException.SystemUninitialized()
        if (update.name.trim().isEmpty()) throw ProfileException.EmptyName()
        repo.saveCommand(update.toEntity {
            id = 0
            applyProfileFiles(this, avatar, banner, font)
        }, SaveMode.UPDATE_ONLY).execute()
    }

    fun checkLogin(login: ProfileLogin) {
        val profile = repo.findById(0) ?: throw CommonException.AuthenticationFailed()
        if (profile.loginName == login.loginName && profile.loginPassword == hashPassword(login.loginPassword))
            StpUtil.login(0)
        else throw CommonException.AuthenticationFailed()
    }

    fun updatePassword(update: PasswordUpdate) {
        val profile = repo.findById(0) ?: throw ProfileException.SystemUninitialized()
        if (profile.loginPassword != hashPassword(update.oldPassword)) throw CommonException.Forbidden()
        if (update.newLoginName.trim().isEmpty()) throw ProfileException.EmptyLoginName()
        repo.saveCommand(Profile {
            id = 0
            loginName = update.newLoginName
            loginPassword = hashPassword(update.newPassword)
        }, SaveMode.UPDATE_ONLY).execute()
    }

    private fun hashPassword(password: String): String {
        val digest = MessageDigest.getInstance("SHA3-384")
        val hashBytes = digest.digest(password.toByteArray(Charsets.UTF_8))

        return hashBytes.joinToString("") {
            "%02x".format(it.toInt() and 0xFF)
        }
    }

    private fun saveProfileFile(file: MultipartFile?, category: String): SaveFileResult? {
        if (file?.isEmpty != false) return null

        // 获取原始文件名的扩展名
        val originalFilename = file.originalFilename ?: ""
        val extension = originalFilename.substringAfterLast('.', "")

        // 构建带扩展名的文件名
        val filename = if (extension.isNotEmpty()) "$category.$extension" else category

        val relativePath = Paths.get("service/profile/$filename")
        val filePath = Paths.get(System.getProperty("user.dir")).resolve(relativePath)
        filePath.parent.toFile().mkdirs()
        file.transferTo(filePath)
        return SaveFileResult(relativePath.toString().replace("service", "file"), filename)
    }

    private fun applyProfileFiles(
        profile: ProfileDraft, avatar: MultipartFile?, banner: MultipartFile?, font: MultipartFile?
    ) {
        saveProfileFile(avatar, "avatar")?.let { res ->
            profile.avatar {
                filepath = res.relativePath
                filename = res.fileName
            }
        }
        saveProfileFile(banner, "banner")?.let { res ->
            profile.banner {
                filepath = res.relativePath
                filename = res.fileName
            }
        }
        saveProfileFile(font, "font")?.let { res ->
            profile.customFont {
                filepath = res.relativePath
                filename = res.fileName
            }
        }
    }

}