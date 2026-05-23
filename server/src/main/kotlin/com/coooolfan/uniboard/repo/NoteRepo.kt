package com.coooolfan.uniboard.repo

import com.coooolfan.uniboard.model.Note
import org.babyfish.jimmer.spring.repo.support.AbstractKotlinRepository
import org.babyfish.jimmer.sql.kt.KSqlClient
import org.springframework.stereotype.Repository

@Repository
class NoteRepo(sql: KSqlClient) : AbstractKotlinRepository<Note, Long>(sql)