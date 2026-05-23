package com.coooolfan.uniboard.service

import com.coooolfan.uniboard.error.CommonException
import com.coooolfan.uniboard.model.Note
import com.coooolfan.uniboard.model.dto.NoteInsert
import com.coooolfan.uniboard.model.dto.NoteUpdate
import com.coooolfan.uniboard.repo.NoteRepo
import com.coooolfan.uniboard.utils.hashPassword
import org.babyfish.jimmer.sql.ast.mutation.SaveMode
import org.babyfish.jimmer.sql.fetcher.Fetcher
import org.springframework.stereotype.Service

@Service
class NoteService(private val repo: NoteRepo) {
    fun findAll(fetcher: Fetcher<Note>): List<Note> {
        return repo.findAll(fetcher) {
            asc(Note::id)
        }
    }

    fun findById(id: Long, fetcher: Fetcher<Note>): Note {
        return repo.findById(id, fetcher) ?: throw CommonException.NotFound()
    }

    fun downloadPlainText(id: Long, password: String): String {
        if (password.length <= MIN_PASSWORD_LENGTH) throw CommonException.NotFound()

        val note = repo.findById(id) ?: throw CommonException.NotFound()
        val passwordHash = note.password ?: throw CommonException.NotFound()
        if (passwordHash != hashPassword(password)) throw CommonException.NotFound()

        return note.content
    }

    fun insert(insert: NoteInsert, fetcher: Fetcher<Note>): Note {
        return repo.saveCommand(insert.toEntity {
            password = preparePassword(insert.password)
        }, SaveMode.INSERT_ONLY).execute(fetcher).modifiedEntity
    }

    fun deleteById(id: Long) {
        repo.deleteById(id)
    }

    fun update(id: Long, update: NoteUpdate, fetcher: Fetcher<Note>) {
        val current = repo.findById(id) ?: throw CommonException.NotFound()
        repo.saveCommand(update.toEntity {
            this.id = id
            password = preparePassword(update.password, current.password)
        }, SaveMode.UPDATE_ONLY).execute(fetcher).modifiedEntity
    }

    private fun preparePassword(password: String?, fallback: String? = null): String? {
        if (password == null) return fallback

        val trimmed = password.trim()
        if (trimmed.isEmpty()) return null
        if (trimmed.length <= MIN_PASSWORD_LENGTH) throw CommonException.Forbidden()

        return hashPassword(trimmed)
    }

    companion object {
        private const val MIN_PASSWORD_LENGTH = 8
    }
}
