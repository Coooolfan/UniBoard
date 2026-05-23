package com.coooolfan.uniboard.model

import org.babyfish.jimmer.sql.GeneratedValue
import org.babyfish.jimmer.sql.Id
import org.babyfish.jimmer.sql.Entity
import org.babyfish.jimmer.sql.GenerationType

@Entity
interface SystemConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long

    val host: String

    val showProfile: Boolean

    val showCopyRight: Boolean
}