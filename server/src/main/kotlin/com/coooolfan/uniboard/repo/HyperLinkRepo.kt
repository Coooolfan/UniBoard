package com.coooolfan.uniboard.repo

import com.coooolfan.uniboard.model.HyperLink
import com.coooolfan.uniboard.model.public
import org.babyfish.jimmer.spring.repo.support.AbstractKotlinRepository
import org.babyfish.jimmer.sql.fetcher.Fetcher
import org.babyfish.jimmer.sql.kt.KSqlClient
import org.babyfish.jimmer.sql.kt.ast.expression.eq
import org.springframework.stereotype.Repository

@Repository
class HyperLinkRepo(sql: KSqlClient) : AbstractKotlinRepository<HyperLink, Long>(sql) {
    fun findByIfLogin(fetcher: Fetcher<HyperLink>, isLogin: Boolean): List<HyperLink> {
        return sql.createQuery(HyperLink::class) {
            if (!isLogin) where(table.public eq true)
            select(table.fetch(fetcher))
        }.execute()
    }

}
