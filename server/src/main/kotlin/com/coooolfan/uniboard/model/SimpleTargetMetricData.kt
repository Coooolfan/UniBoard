package com.coooolfan.uniboard.model

import org.babyfish.jimmer.sql.Serialized

@Serialized
data class SimpleTargetMetricData(
    val cpu: Double,
    val memory: Double,
    val load: Double
)
