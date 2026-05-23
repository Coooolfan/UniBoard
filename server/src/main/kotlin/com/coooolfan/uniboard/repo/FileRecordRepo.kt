package com.coooolfan.uniboard.repo

import com.coooolfan.uniboard.model.FileRecord
import com.coooolfan.uniboard.model.FileRecordVisibility
import com.coooolfan.uniboard.model.shareCode
import com.coooolfan.uniboard.model.visibility
import org.babyfish.jimmer.spring.repo.support.AbstractKotlinRepository
import org.babyfish.jimmer.sql.kt.KSqlClient
import org.babyfish.jimmer.sql.kt.ast.expression.eq
import org.babyfish.jimmer.sql.kt.ast.expression.ne
import org.springframework.stereotype.Repository

@Repository
class FileRecordRepo(sql: KSqlClient) : AbstractKotlinRepository<FileRecord, Long>(sql) {

    /**
     * 根据分享码查找文件记录
     *
     * 此方法通过指定的分享码查询文件记录，同时过滤掉私有文件。
     * 在下载和获取文件信息时被使用。
     *
     * @param shareCode 文件记录的唯一分享码
     * @return 返回找到的文件记录对象，如果未找到或为私有文件则返回 null
     */
    fun findByShareCode(shareCode: String): FileRecord? {
        return this.sql.createQuery(FileRecord::class) {
            where(table.shareCode eq shareCode)
            where(table.visibility ne FileRecordVisibility.PRIVATE)
            select(table)
        }.execute().firstOrNull()
    }

}