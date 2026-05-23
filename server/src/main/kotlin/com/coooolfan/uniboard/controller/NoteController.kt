package com.coooolfan.uniboard.controller

import cn.dev33.satoken.annotation.SaCheckLogin
import com.coooolfan.uniboard.error.CommonException
import com.coooolfan.uniboard.model.Note
import com.coooolfan.uniboard.model.by
import com.coooolfan.uniboard.model.dto.NoteInsert
import com.coooolfan.uniboard.model.dto.NoteUpdate
import com.coooolfan.uniboard.repo.NoteRepo
import org.babyfish.jimmer.client.FetchBy
import org.babyfish.jimmer.sql.ast.mutation.SaveMode
import org.babyfish.jimmer.sql.kt.fetcher.newFetcher
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

/**
 * 笔记控制器
 *
 * 处理笔记的增删改查操作，包括创建、查询、更新和删除笔记
 * 所有操作都需要登录验证
 */
@RestController
@RequestMapping("/api/note")
@SaCheckLogin
class NoteController(private val repo: NoteRepo) {
    /**
     * 获取所有笔记
     *
     * 获取当前用户的所有笔记列表，按ID升序排列
     * 需要登录验证
     *
     * @return List<Note> 笔记列表
     */
    @GetMapping
    fun getAllNotes(): List<@FetchBy("DEFAULT_NOTE") Note> {
        return repo.findAll(DEFAULT_NOTE) {
            asc(Note::id)
        }
    }

    /**
     * 根据ID获取笔记
     *
     * 获取指定ID的笔记详细信息
     * 需要登录验证
     *
     * @param id 笔记ID
     * @return Note 笔记对象
     * @throws CommonException.NotFound 当指定ID的笔记不存在时抛出
     */
    @GetMapping("/{id}")
    @Throws(CommonException.NotFound::class)
    fun getNoteById(@PathVariable id: Long): @FetchBy("DEFAULT_NOTE") Note {
        return repo.findById(id, DEFAULT_NOTE) ?: throw CommonException.NotFound()
    }

    /**
     * 创建新笔记
     *
     * 添加新的笔记到系统中
     * 需要登录验证
     *
     * @param insert 笔记创建数据，包含标题、内容等信息
     * @return Note 创建的笔记对象
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun insertNote(@RequestBody insert: NoteInsert): @FetchBy("DEFAULT_NOTE") Note {
        return repo.saveCommand(insert, SaveMode.INSERT_ONLY).execute(DEFAULT_NOTE).modifiedEntity
    }

    /**
     * 根据ID删除笔记
     *
     * 删除指定ID的笔记
     * 需要登录验证
     *
     * @param id 要删除的笔记ID
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteNoteById(@PathVariable id: Long) {
        repo.deleteById(id)
    }

    /**
     * 根据ID更新笔记
     *
     * 更新指定ID的笔记信息，如标题、内容等
     * 需要登录验证
     *
     * @param id 要更新的笔记ID
     * @param update 笔记更新数据
     */
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun updateNoteById(@PathVariable id: Long, @RequestBody update: NoteUpdate) {
        repo.saveCommand(update.toEntity { this.id = id }, SaveMode.UPDATE_ONLY).execute(DEFAULT_NOTE).modifiedEntity
    }

    companion object {
        private val DEFAULT_NOTE = newFetcher(Note::class).by {
            allScalarFields()
        }
    }
}