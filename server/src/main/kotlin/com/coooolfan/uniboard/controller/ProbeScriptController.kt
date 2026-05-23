package com.coooolfan.uniboard.controller

import com.coooolfan.uniboard.service.ProbeScriptService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/probe-script")
class ProbeScriptController(private val probeScriptService: ProbeScriptService) {

    /**
     * 获取自定义安装脚本
     *
     * @param probeId 探针ID
     * @param key 探针密钥
     * @param interval 采集间隔（秒）
     * @return 安装脚本内容
     */
    @GetMapping("/installer/probe/{probeId}/key/{key}/interval/{interval}")
    fun getCustomInstallScript(
        @PathVariable probeId: Long,
        @PathVariable key: String,
        @PathVariable interval: Int,
    ): String {
        return probeScriptService.genCustomInstallScript(probeId, key, interval)
    }


    /**
     * 获取监控脚本
     *
     * @return 监控脚本内容
     */
    @GetMapping("/probe-monitor.sh", produces = ["text/plain"])
    fun getMonitorScript(): String {
        return probeScriptService.genMonitorScript()
    }
}