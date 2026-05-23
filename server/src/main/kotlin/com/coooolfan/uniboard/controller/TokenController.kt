package com.coooolfan.uniboard.controller

import cn.dev33.satoken.annotation.SaCheckLogin
import cn.dev33.satoken.stp.StpUtil
import com.coooolfan.uniboard.error.CommonException
import com.coooolfan.uniboard.model.dto.ProfileLogin
import com.coooolfan.uniboard.service.ProfileService
import org.springframework.web.bind.annotation.*

/**
 * 令牌控制器
 *
 * 处理用户身份验证相关操作，包括获取令牌（登录）、删除令牌（登出）和刷新令牌
 */
@RestController
@RequestMapping("/api/token")
class TokenController(private val service: ProfileService) {
    /**
     * 获取令牌（登录）
     *
     * @param login 用户登录信息
     * @throws CommonException.AuthenticationFailed 如果认证失败
     */
    @GetMapping
    @Throws(CommonException.AuthenticationFailed::class)
    fun getToken(login: ProfileLogin) {
        service.checkLogin(login)
    }

    /**
     * 删除令牌（登出）
     *
     * 使当前用户登出系统
     */
    @DeleteMapping
    fun deleteToken() {
        StpUtil.logout()
    }

    /**
     * 刷新令牌
     *
     * 为当前登录用户刷新身份验证令牌
     * 需要用户已经登录
     */
    @PostMapping
    @SaCheckLogin
    fun refreshToken() {
        StpUtil.login(0)
    }
}
