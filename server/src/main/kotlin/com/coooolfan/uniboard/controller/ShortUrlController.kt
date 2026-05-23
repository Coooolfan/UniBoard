package com.coooolfan.uniboard.controller

import cn.dev33.satoken.annotation.SaCheckLogin
import com.coooolfan.uniboard.error.CommonException
import com.coooolfan.uniboard.model.ShortUrl
import com.coooolfan.uniboard.model.by
import com.coooolfan.uniboard.model.dto.ShortUrlInsert
import com.coooolfan.uniboard.repo.ShortUrlRepo
import com.coooolfan.uniboard.utils.getHashedString
import com.github.benmanes.caffeine.cache.Cache
import jakarta.servlet.http.HttpServletResponse
import org.babyfish.jimmer.Page
import org.babyfish.jimmer.client.FetchBy
import org.babyfish.jimmer.spring.repo.PageParam
import org.babyfish.jimmer.sql.kt.fetcher.newFetcher
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

/**
 * 短链接控制器
 *
 * 处理短链接的管理操作，包括创建、查询和删除短链接
 * 所有操作都需要登录验证
 */
@RestController
@RequestMapping("/api/short-url")
@SaCheckLogin
class ShortUrlController(private val repo: ShortUrlRepo) {
    /**
     * 获取短链接列表（分页）
     *
     * 获取所有短链接的分页列表，按ID升序排列
     * 需要登录验证
     *
     * @param pageIndex 页面索引（从0开始）
     * @param pageSize 每页大小
     * @return Page<ShortUrl> 分页的短链接列表
     */
    @GetMapping
    fun getShortUrl(
        @RequestParam pageIndex: Int,
        @RequestParam pageSize: Int
    ): Page<@FetchBy("DEFAULT_SHORT_URL") ShortUrl> {
        return repo.findPage(PageParam.byNo(pageIndex, pageSize), DEFAULT_SHORT_URL) {
            asc(ShortUrl::id)
        }
    }

    /**
     * 创建新的短链接
     *
     * 根据长链接URL创建对应的短链接，系统会自动生成短链接码
     * 需要登录验证
     *
     * @param insert 短链接创建数据，包含长链接URL等信息
     * @return ShortUrl 创建的短链接对象
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun insertShortUrl(@RequestBody insert: ShortUrlInsert): @FetchBy("DEFAULT_SHORT_URL") ShortUrl {
        return repo.saveCommand(insert.toEntity { this.shortUrl = getHashedString(insert.longUrl) })
            .execute(DEFAULT_SHORT_URL).modifiedEntity
    }

    /**
     * 根据ID删除短链接
     *
     * 删除指定ID的短链接记录
     * 需要登录验证
     *
     * @param id 要删除的短链接ID
     * @throws CommonException.NotFound 当指定ID的短链接不存在时抛出
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteShortUrl(@PathVariable(value = "id") id: Long) {
        if (repo.deleteById(id) != 1) {
            throw CommonException.NotFound()
        }
    }

    companion object {
        private val DEFAULT_SHORT_URL = newFetcher(ShortUrl::class).by {
            allScalarFields()
        }
    }
}

/**
 * 重定向控制器
 *
 * 处理短链接的重定向功能，将短链接重定向到对应的长链接
 * 并统计访问次数，支持缓存机制提高性能
 */
@RestController
@RequestMapping("/s")
@ResponseStatus(HttpStatus.FOUND)
class RedirectController(
    private val repo: ShortUrlRepo,
    private val shortUrlCountCache: Cache<Long, Long>,
    private val shortUrlCache: Cache<String, ShortUrl>
) {
    /**
     * 短链接重定向
     *
     * 根据短链接码查找对应的长链接并进行重定向
     * 同时记录访问次数，支持缓存机制提高响应速度
     *
     * @param shortUrlCode 短链接码
     * @param resp HTTP响应对象，用于执行重定向
     * @throws CommonException.NotFound 当短链接码不存在时抛出
     */
    @GetMapping("/{shortUrlCode}")
    fun redirect(@PathVariable(value = "shortUrlCode") shortUrlCode: String, resp: HttpServletResponse) {
        // 尝试从缓存中获取
        var entity = shortUrlCache.getIfPresent(shortUrlCode)
        if (entity == null) {
            entity = repo.findByShortUrlCode(shortUrlCode) ?: throw CommonException.NotFound()
            shortUrlCache.put(shortUrlCode, entity)
        }
        shortUrlCountCache.asMap().compute(entity.id) { _, lastCachedIncrement ->
            // 当 lastCachedCount 为 null 时，说明是第一次访问, 从1开始计数
            (lastCachedIncrement ?: 0) + 1
        }
        resp.sendRedirect(entity.longUrl)
        resp.flushBuffer()
    }
}
