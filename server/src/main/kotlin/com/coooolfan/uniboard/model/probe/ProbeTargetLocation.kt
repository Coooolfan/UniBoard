package com.coooolfan.uniboard.model.probe

import org.babyfish.jimmer.sql.Embeddable

@Embeddable
interface ProbeTargetLocation {
    val latitude: Double // 纬度
    val longitude: Double // 经度
}