package com.coooolfan.uniboard.model

import org.babyfish.jimmer.sql.Entity
import org.babyfish.jimmer.sql.GeneratedValue
import org.babyfish.jimmer.sql.GenerationType
import org.babyfish.jimmer.sql.Id

@Entity
interface Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long

    val title: String

    val content: String
}