package com.coooolfan.uniboard.config

import com.coooolfan.uniboard.model.*
import com.github.benmanes.caffeine.cache.Cache
import com.github.benmanes.caffeine.cache.Caffeine
import com.github.benmanes.caffeine.cache.RemovalCause
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import org.babyfish.jimmer.sql.kt.KSqlClient
import org.babyfish.jimmer.sql.kt.ast.expression.eq
import org.babyfish.jimmer.sql.kt.ast.expression.plus
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.EnableCaching
import org.springframework.cache.caffeine.CaffeineCacheManager
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling
import java.util.concurrent.TimeUnit

@Configuration
@EnableCaching
@EnableScheduling
class CacheConfig(
    private val sql: KSqlClient,
    private val cacheScope: CoroutineScope
) {

    @Bean
    fun cacheManager(): CacheManager {
        val cacheManager = CaffeineCacheManager()
        cacheManager.setCaffeine(
            Caffeine.newBuilder()
                .expireAfterWrite(5, TimeUnit.MINUTES)
                .maximumSize(1000)
        )
        return cacheManager
    }

    // 缓存文件记录的下载直链
    // Key: UUID Value: 文件记录ID
    @Bean
    fun directDownloadLinkCache(): Cache<String, Long> {
        return Caffeine.newBuilder()
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .build()
    }

    // 缓存短链接
    // shortUrlCode 和 ShortUrl.longUrl 的关系不会发生更改，无需考虑一致性问题
    // Key: 短链接shortUrlCode Value: 短链接对象
    @Bean
    fun shortUrlCache(): Cache<String, ShortUrl> {
        return Caffeine.newBuilder()
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .maximumSize(1000)
            .build()
    }

    // 缓存缓存短链接的访问次数（增量）
    // Key: 短链接ID Value: 访问次数（增量）
    @Bean
    fun shortUrlCountCache(): Cache<Long, Long> {
        return commonCountCache { shortUrlId, count ->
            sql.createUpdate(ShortUrl::class) {
                set(
                    table.visitCount,
                    table.visitCount + count
                )
                where(table.id eq shortUrlId)
            }.execute()
        }
    }

    // 缓存缓存文件记录的下载次数（增量）
    // Key: 文件记录ID Value: 下载次数（增量）
    @Bean
    fun fileRecordCountCache(): Cache<Long, Long> {
        return commonCountCache { fileRecordId, count ->
            sql.createUpdate(FileRecord::class) {
                set(
                    table.downloadCount,
                    table.downloadCount + count
                )
                where(table.id eq fileRecordId)
            }.execute()
        }
    }

    // 创建通用的计数缓存构建器
    private fun commonCountCache(
        expirationTime: Long = 3,
        timeUnit: TimeUnit = TimeUnit.SECONDS,
        maxSize: Long = 1000,
        updateAction: suspend (Long, Long) -> Unit
    ): Cache<Long, Long> {
        return Caffeine.newBuilder()
            .expireAfterWrite(expirationTime, timeUnit)
            .maximumSize(maxSize)
            .removalListener<Long, Long> { key, count, cause ->
                if (key == null || count == null) return@removalListener
                if (cause == RemovalCause.EXPIRED) {
                    cacheScope.launch { updateAction(key, count) }
                }
            }
            .build()
    }

}
