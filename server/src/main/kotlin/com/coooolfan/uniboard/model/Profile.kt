package com.coooolfan.uniboard.model

import org.babyfish.jimmer.sql.Entity
import org.babyfish.jimmer.sql.GeneratedValue
import org.babyfish.jimmer.sql.GenerationType
import org.babyfish.jimmer.sql.Id
import org.babyfish.jimmer.sql.PropOverride

@Entity
interface Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long

    val loginName: String

    val loginPassword: String

    val name: String

    val description: String

    val slogan: String

    val contacts: ProfileContacts

    @PropOverride(prop = "filename", columnName = "custom_font_filename")
    @PropOverride(prop = "filepath", columnName = "custom_font_filepath")
    val customFont: BaseSimpleFile?

    @PropOverride(prop = "filename", columnName = "avatar_name")
    @PropOverride(prop = "filepath", columnName = "avatar_path")
    val avatar: BaseSimpleFile

    @PropOverride(prop = "filename", columnName = "banner_name")
    @PropOverride(prop = "filepath", columnName = "banner_path")
    val banner: BaseSimpleFile
}