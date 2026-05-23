package com.coooolfan.uniboard.model

import org.babyfish.jimmer.sql.Entity
import org.babyfish.jimmer.sql.GeneratedValue
import org.babyfish.jimmer.sql.GenerationType
import org.babyfish.jimmer.sql.Id
import org.babyfish.jimmer.sql.Key

@Entity
interface ShortUrl {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long

    val longUrl: String

    @Key
    val shortUrl: String //  短链的字符串

    val visitCount: Long
}