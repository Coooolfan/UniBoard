package com.coooolfan.uniboard.controller

import cn.dev33.satoken.annotation.SaCheckLogin
import com.coooolfan.uniboard.error.CommonException
import com.coooolfan.uniboard.error.ProfileException
import com.coooolfan.uniboard.model.Profile
import com.coooolfan.uniboard.model.by
import com.coooolfan.uniboard.model.dto.PasswordUpdate
import com.coooolfan.uniboard.model.dto.ProfileCreate
import com.coooolfan.uniboard.model.dto.ProfileUpdate
import com.coooolfan.uniboard.service.ProfileService
import org.babyfish.jimmer.client.FetchBy
import org.babyfish.jimmer.sql.kt.fetcher.newFetcher
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

/**
 * 个人资料控制器
 *
 * 处理用户个人资料的管理操作，包括获取、创建、更新个人资料和修改密码
 */
@RestController
@RequestMapping("/api/profile")
class ProfileController(private val service: ProfileService) {
    /**
     * 获取个人资料
     *
     * 获取系统的个人资料信息，返回公开的个人资料数据（不包含登录凭据）
     *
     * @return Profile 个人资料对象
     * @throws ProfileException.SystemUninitialized 当系统未初始化时抛出
     */
    @GetMapping
    @Throws(ProfileException.SystemUninitialized::class)
    fun getProfile(): @FetchBy("PUBLIC_PROFILE") Profile {
        return service.getProfile(PUBLIC_PROFILE)
    }

    /**
     * 创建个人资料
     *
     * 初始化系统的个人资料，包括基本信息和可选的头像、横幅图片、字体文件
     * 只能在系统未初始化时调用，用于首次设置
     *
     * @param create 个人资料创建数据，包含姓名、登录名、密码等基本信息
     * @param avatar 可选的头像文件
     * @param banner 可选的横幅图片文件
     * @param font 可选的字体文件
     * @throws ProfileException.SystemAlreadyInitialized 当系统已经初始化时抛出
     * @throws ProfileException.EmptyLoginName 当登录名为空时抛出
     * @throws ProfileException.EmptyName 当姓名为空时抛出
     */
    @PostMapping
    @Throws(
        ProfileException.SystemAlreadyInitialized::class,
        ProfileException.EmptyLoginName::class,
        ProfileException.EmptyName::class,
    )
    fun createProfile(
        @RequestPart create: ProfileCreate,
        @RequestPart(required = false) avatar: MultipartFile?,
        @RequestPart(required = false) banner: MultipartFile?,
        @RequestPart(required = false) font: MultipartFile?
    ) {
        service.createProfile(create, avatar, banner, font)
    }

    /**
     * 更新个人资料
     *
     * 更新现有的个人资料信息，可以修改基本信息和上传新的头像、横幅图片、字体文件
     * 需要登录验证
     *
     * @param update 个人资料更新数据
     * @param avatar 可选的新头像文件
     * @param banner 可选的新横幅图片文件
     * @param font 可选的新字体文件
     * @throws ProfileException.SystemUninitialized 当系统未初始化时抛出
     * @throws ProfileException.EmptyName 当姓名为空时抛出
     */
    @PutMapping
    @SaCheckLogin
    @Throws(
        ProfileException.SystemUninitialized::class,
        ProfileException.EmptyName::class,
    )
    fun updateProfile(
        @RequestPart update: ProfileUpdate,
        @RequestPart(required = false) avatar: MultipartFile?,
        @RequestPart(required = false) banner: MultipartFile?,
        @RequestPart(required = false) font: MultipartFile?
    ) {
        service.updateProfile(update, avatar, banner, font)
    }

    /**
     * 更新密码
     *
     * 修改用户的登录密码，需要提供当前密码进行验证
     * 需要登录验证
     *
     * @param update 密码更新数据，包含当前密码和新密码
     * @throws ProfileException.SystemUninitialized 当系统未初始化时抛出
     * @throws ProfileException.EmptyLoginName 当登录名为空时抛出
     * @throws CommonException.Forbidden 当前密码验证失败时抛出
     */
    @PutMapping("/password")
    @SaCheckLogin
    @Throws(
        ProfileException.SystemUninitialized::class,
        ProfileException.EmptyLoginName::class,
        CommonException.Forbidden::class
    )
    fun updatePassword(
        update: PasswordUpdate
    ) {
        service.updatePassword(update)
    }

    companion object {
        private val PUBLIC_PROFILE = newFetcher(Profile::class).by {
            allScalarFields()
            loginName(false)
            loginPassword(false)
        }
    }
}