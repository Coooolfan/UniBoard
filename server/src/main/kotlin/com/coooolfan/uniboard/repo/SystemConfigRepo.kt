package com.coooolfan.uniboard.repo

import com.coooolfan.uniboard.model.SystemConfig
import org.babyfish.jimmer.spring.repo.support.AbstractKotlinRepository
import org.babyfish.jimmer.sql.kt.KSqlClient
import org.springframework.stereotype.Repository

@Repository
class SystemConfigRepo(sql: KSqlClient) : AbstractKotlinRepository<SystemConfig, Long>(sql)
