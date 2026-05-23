package com.coooolfan.uniboard.config

import com.coooolfan.uniboard.service.FileRecordService
import com.github.benmanes.caffeine.cache.Cache
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class Scheduler(
    private val directLinkCache: Cache<String, Long>,
    private val shortUrlCountCache: Cache<Long, Long>,
    private val fileRecordCountCache: Cache<Long, Long>,
    private val fileRecordService: FileRecordService
) {

    // 每一秒执行一次定时清理
    @Scheduled(fixedDelay = 1000)
    fun cleanUpCaches() {
        directLinkCache.cleanUp()
        shortUrlCountCache.cleanUp()
        fileRecordCountCache.cleanUp()
    }

    // 每天凌晨2点清理一次
    @Scheduled(cron = "0 0 2 * * ?")
    fun cleanUpFileRecordCache() {
        fileRecordService.cleanFileRecordsFromDisk()
    }
}