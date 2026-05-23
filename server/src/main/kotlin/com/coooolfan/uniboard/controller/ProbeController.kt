package com.coooolfan.uniboard.controller

import cn.dev33.satoken.annotation.SaCheckLogin
import com.coooolfan.uniboard.model.probe.ProbeTarget
import com.coooolfan.uniboard.model.probe.by
import com.coooolfan.uniboard.model.probe.dto.ProbeTargetInsert
import com.coooolfan.uniboard.model.probe.dto.ProbeTargetOrderUpdate
import com.coooolfan.uniboard.model.probe.dto.ProbeTargetUpdate
import com.coooolfan.uniboard.service.ProbeService
import org.babyfish.jimmer.client.FetchBy
import org.babyfish.jimmer.sql.kt.fetcher.newFetcher
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

/**
 * 探针相关资源控制器
 *
 * 处理探针目标的增删改查操作，包括获取所有探针目标、插入新探针目标和更新探针目标信息
 * 所有操作都需要登录验证
 */
@RestController
@RequestMapping("/api/probe-target")
@SaCheckLogin
class ProbeController(private val service: ProbeService) {
    /**
     * 获取所有探针目标列表
     *
     * 获取所有已注册的探针目标列表
     * 需要登录验证
     *
     * @return List<ProbeTarget>
     * 探针目标列表，包含所有标量字段和指标信息
     */
    @GetMapping
    fun getAllProbeTargets(): List<@FetchBy("DEFAULT_PROBE_TARGET") ProbeTarget> {
        return service.findAll(DEFAULT_PROBE_TARGET)
    }


    /**
     * 插入新的探针目标
     *
     * 添加新的探针目标到系统中
     * 需要登录验证
     *
     * @param insert ProbeTargetInsert
     * 包含要插入的探针目标信息
     * @return ProbeTarget
     * 插入后的探针目标对象，包含所有标量字段和指标信息
     */
    @PostMapping
    fun insertProbeTarget(@RequestBody insert: ProbeTargetInsert): @FetchBy("DEFAULT_PROBE_TARGET") ProbeTarget {
        return service.insert(insert, DEFAULT_PROBE_TARGET)
    }


    /**
     * 更新探针目标信息
     *
     * 根据ID更新指定的探针目标信息
     * 需要登录验证
     *
     * @param id 探针目标ID
     * @param update ProbeTargetUpdate
     * 包含要更新的探针目标信息
     */
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun updateProbeTarget(@PathVariable id: Long, @RequestBody update: ProbeTargetUpdate) {
        service.update(update.toEntity { this.id = id })
    }

    /**
     * 删除探针目标
     *
     * 根据ID删除指定的探针目标
     * 需要登录验证
     *
     * @param id 探针目标ID
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteProbeTargetById(@PathVariable id: Long) {
        service.delete(id)
    }

    /**
     * 刷新探针目标的key
     *
     * 根据ID刷新指定探针目标的key并返回新的key
     * 需要登录验证
     *
     * @param id 探针目标ID
     */
    @PutMapping("/{id}/key")
    fun refreshProbeTargetKey(@PathVariable id: Long): @FetchBy("PROBE_TARGET_WITH_KEY") ProbeTarget {
        return service.refreshProbeTargetKey(id, PROBE_TARGET_WITH_KEY)
    }

    /**
     * 更新探针目标的排序
     *
     * 根据提供的排序列表更新探针目标的显示顺序
     * 需要登录验证
     *
     * @param sortList List<ProbeTargetOrderUpdate>
     * 包含要更新的探针目标ID和新的排序值
     */
    @PostMapping("sort")
    fun updateProbeTargetSort(@RequestBody sortList: List<ProbeTargetOrderUpdate>) {
        service.updateSort(sortList)
    }


    companion object {
        private val DEFAULT_PROBE_TARGET = newFetcher(ProbeTarget::class).by {
            allScalarFields()
            key(false)
        }

        private val PROBE_TARGET_WITH_KEY = newFetcher(ProbeTarget::class).by {
            key(true)
        }
    }

}