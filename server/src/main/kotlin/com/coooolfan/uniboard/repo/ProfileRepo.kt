package com.coooolfan.uniboard.repo

import com.coooolfan.uniboard.model.Profile
import org.babyfish.jimmer.spring.repo.support.AbstractKotlinRepository
import org.babyfish.jimmer.sql.kt.KSqlClient
import org.springframework.stereotype.Repository

@Repository
class ProfileRepo(sql: KSqlClient) : AbstractKotlinRepository<Profile, Long>(sql) {
    fun count(): Long {
        return sql.createQuery(Profile::class) {
            selectCount()
        }.execute()[0]
    }
}