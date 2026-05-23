package com.coooolfan.uniboard.repo

import com.coooolfan.uniboard.model.SimpleTargetMetricData
import com.coooolfan.uniboard.model.probe.*
import org.babyfish.jimmer.spring.repo.support.AbstractKotlinRepository
import org.babyfish.jimmer.sql.kt.KSqlClient
import org.babyfish.jimmer.sql.kt.ast.expression.eq
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
class ProbeTargetRepo(sql: KSqlClient) : AbstractKotlinRepository<ProbeTarget, Long>(sql) {
    fun checkKeyValid(id: Long, key: String): Boolean {
        return sql.createQuery(ProbeTarget::class) {
            where(table.id eq id)
            where(table.key eq key)
            selectCount()
        }.execute()[0] == 1L
    }

    fun updateAndInsertData(
        id: Long, timestamp: Instant, data: SimpleTargetMetricData
    ) {
        sql.executeUpdate(ProbeTarget::class) {
            set(
                table.lastReportTime,
                timestamp
            )
            set(
                table.lastReportData,
                data
            )
            where(table.id eq id)

        }
    }

}