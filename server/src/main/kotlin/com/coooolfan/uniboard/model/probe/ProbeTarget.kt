package com.coooolfan.uniboard.model.probe

import com.coooolfan.uniboard.model.SimpleTargetMetricData
import org.babyfish.jimmer.sql.*
import java.time.Instant

@Entity
interface ProbeTarget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long

    val name: String

    val description: String

    // 用于上报服务鉴权
    @Key
    val key: String

    val sort: Int

    val location: ProbeTargetLocation

    val lastReportTime: Instant

    val lastReportData: SimpleTargetMetricData?

}

