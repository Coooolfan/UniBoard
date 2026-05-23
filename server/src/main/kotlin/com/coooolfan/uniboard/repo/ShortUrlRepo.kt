package com.coooolfan.uniboard.repo

import com.coooolfan.uniboard.model.ShortUrl
import com.coooolfan.uniboard.model.shortUrl
import org.babyfish.jimmer.spring.repo.support.AbstractKotlinRepository
import org.babyfish.jimmer.sql.kt.KSqlClient
import org.babyfish.jimmer.sql.kt.ast.expression.eq
import org.springframework.stereotype.Repository

@Repository
class ShortUrlRepo(sql: KSqlClient) : AbstractKotlinRepository<ShortUrl, Long>(sql){
    fun findByShortUrlCode(shortUrlCode: String): ShortUrl? {
        return sql.createQuery(ShortUrl::class){
            where(table.shortUrl eq shortUrlCode)
            select(table)
        }.execute().firstOrNull()
    }
}