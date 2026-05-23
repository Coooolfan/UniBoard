package com.coooolfan.uniboard.controller

import cn.dev33.satoken.annotation.SaCheckLogin
import com.coooolfan.uniboard.error.CommonException
import com.coooolfan.uniboard.model.Note
import com.coooolfan.uniboard.model.by
import com.coooolfan.uniboard.model.dto.NoteInsert
import com.coooolfan.uniboard.model.dto.NoteUpdate
import com.coooolfan.uniboard.service.NoteService
import org.babyfish.jimmer.client.ApiIgnore
import org.babyfish.jimmer.client.FetchBy
import org.babyfish.jimmer.sql.kt.fetcher.newFetcher
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

/**
 * 笔记控制器
 *
 * 处理笔记的增删改查操作，包括创建、查询、更新和删除笔记
 * 所有操作都需要登录验证
 */
@RestController
@RequestMapping("/api/note")
class NoteController(private val service: NoteService) {
    /**
     * 获取所有笔记
     *
     * 获取当前用户的所有笔记列表，按ID升序排列
     * 需要登录验证
     *
     * @return List<Note> 笔记列表
     */
    @GetMapping
    @SaCheckLogin
    fun getAllNotes(): List<@FetchBy("DEFAULT_NOTE") Note> {
        return service.findAll(DEFAULT_NOTE)
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
    @GetMapping("/{id}", params = ["!pw"])
    @SaCheckLogin
    @Throws(CommonException.NotFound::class)
    fun getNoteById(@PathVariable id: Long): @FetchBy("DEFAULT_NOTE") Note {
        return service.findById(id, DEFAULT_NOTE)
    }

    @GetMapping("/{id}", params = ["pw"], produces = [MediaType.TEXT_PLAIN_VALUE])
    @ApiIgnore
    @Throws(CommonException.NotFound::class)
    fun downloadNotePlainText(@PathVariable id: Long, @RequestParam pw: String): String {
        return service.downloadPlainText(id, pw)
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
    @SaCheckLogin
    @ResponseStatus(HttpStatus.CREATED)
    fun insertNote(@RequestBody insert: NoteInsert): @FetchBy("DEFAULT_NOTE") Note {
        return service.insert(insert, DEFAULT_NOTE)
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
    @SaCheckLogin
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteNoteById(@PathVariable id: Long) {
        service.deleteById(id)
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
    @SaCheckLogin
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun updateNoteById(@PathVariable id: Long, @RequestBody update: NoteUpdate) {
        service.update(id, update, DEFAULT_NOTE)
    }

    companion object {
        private val DEFAULT_NOTE = newFetcher(Note::class).by {
            title()
            content()
        }
    }
}
