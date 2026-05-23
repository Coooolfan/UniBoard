package com.coooolfan.uniboard.model

import org.babyfish.jimmer.sql.Serialized

@Serialized
data class ProfileContacts(
    val github: String,
    val telegram: String,
    val qq: String,
    val email: String,
    val weibo: String,
    val zhihu: String,
    val twitter: String,
    val facebook: String,
    val instagram: String,
    val linkedin: String
)
