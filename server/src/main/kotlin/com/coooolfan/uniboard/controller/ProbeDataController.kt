package com.coooolfan.uniboard.controller

import com.coooolfan.uniboard.model.SimpleTargetMetricData
import com.coooolfan.uniboard.service.ProbeService
import org.springframework.web.bind.annotation.*
import java.time.Instant

@RestController
@RequestMapping("/api/probe-target/{id}")
class ProbeDataController(private val service: ProbeService) {

    /**
     * 接收探针数据
     *
     * 接收来自探针的监控数据，并存储到系统中
     *
     * @param id 探针目标ID
     * @param data 探针数据，包含时间戳和具体的监控指标
     */
    @PostMapping("/data")
    fun postProbeData(@PathVariable id: Long, @RequestBody data: ProbeTargetData) {
        service.insertData(id, data)
    }

}

data class ProbeTargetData(
    val key: String,
    val timestamp: Instant,
    val data: SimpleTargetMetricData
)
