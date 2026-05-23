package com.coooolfan.uniboard.controller

import cn.dev33.satoken.annotation.SaCheckLogin
import com.coooolfan.uniboard.model.SystemConfig
import com.coooolfan.uniboard.model.by
import com.coooolfan.uniboard.model.dto.SystemConfigUpdate
import com.coooolfan.uniboard.repo.SystemConfigRepo
import org.babyfish.jimmer.client.FetchBy
import org.babyfish.jimmer.sql.kt.fetcher.newFetcher
import org.springframework.web.bind.annotation.*

/**
 * 系统配置控制器
 *
 * 处理系统配置的获取和更新操作，包括主机地址、显示设置等系统级配置
 */
@RestController
@RequestMapping("/api/system-config")
class SystemConfigController(private val repo: SystemConfigRepo) {
    /**
     * 获取系统配置
     *
     * 获取当前的系统配置信息，如果配置不存在则返回默认配置
     *
     * @return SystemConfig 系统配置对象，包含主机地址、显示设置等信息
     */
    @GetMapping
    fun getSystemConfig(): @FetchBy("DEFAULT_SYSTEM_CONFIG") SystemConfig {
        return repo.findById(0, DEFAULT_SYSTEM_CONFIG) ?: SystemConfig {
            id = 0
            host = ""
            showProfile = true
            showCopyRight = true
        }
    }

    /**
     * 更新系统配置
     *
     * 更新系统配置信息，如主机地址、个人资料显示设置、版权显示设置等
     * 需要登录验证
     *
     * @param update 系统配置更新数据
     * @return SystemConfig 更新后的系统配置对象
     */
    @PutMapping
    @SaCheckLogin
    fun updateSystemConfig(
        @RequestBody update: SystemConfigUpdate
    ): @FetchBy("DEFAULT_SYSTEM_CONFIG") SystemConfig {
        return repo.saveCommand(update.toEntity { id = 0 }).execute(DEFAULT_SYSTEM_CONFIG).modifiedEntity
    }

    companion object {
        private val DEFAULT_SYSTEM_CONFIG = newFetcher(SystemConfig::class).by {
            allScalarFields()
        }
    }
}
