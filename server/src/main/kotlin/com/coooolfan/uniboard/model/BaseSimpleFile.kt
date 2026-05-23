package com.coooolfan.uniboard.model

import org.babyfish.jimmer.sql.Embeddable

@Embeddable
interface BaseSimpleFile {
    val filename: String // 文件名（逻辑上的）
    val filepath: String // 文件路径（物理）
}