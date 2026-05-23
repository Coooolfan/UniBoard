package com.coooolfan.uniboard.service

import com.coooolfan.uniboard.controller.ProbeTargetData
import com.coooolfan.uniboard.error.ProbeException
import com.coooolfan.uniboard.model.probe.ProbeTarget
import com.coooolfan.uniboard.model.probe.dto.ProbeTargetInsert
import com.coooolfan.uniboard.model.probe.dto.ProbeTargetOrderUpdate
import com.coooolfan.uniboard.repo.ProbeTargetRepo
import org.babyfish.jimmer.sql.ast.mutation.SaveMode
import org.babyfish.jimmer.sql.fetcher.Fetcher
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.*

@Service
class ProbeService(private val repo: ProbeTargetRepo) {
    fun findAll(fetcher: Fetcher<ProbeTarget>) = repo.findAll(fetcher)

    fun insert(insert: ProbeTargetInsert, fetcher: Fetcher<ProbeTarget>): ProbeTarget {
        val entity = insert.toEntity {
            this.key = UUID.randomUUID().toString()
            this.lastReportTime = Instant.EPOCH
        }
        return repo.saveCommand(entity, SaveMode.INSERT_ONLY)
            .execute(fetcher).modifiedEntity
    }

    fun update(entity: ProbeTarget) {
        repo.saveCommand(entity, SaveMode.UPDATE_ONLY).execute()
    }

    fun delete(id: Long) = repo.deleteById(id)

    fun refreshProbeTargetKey(id: Long, fetcher: Fetcher<ProbeTarget>): ProbeTarget {
        return repo.saveCommand(
            ProbeTarget {
                this.id = id
                this.key = UUID.randomUUID().toString()
            }, SaveMode.UPDATE_ONLY
        ).execute(fetcher).modifiedEntity
    }

    fun insertData(id: Long, data: ProbeTargetData) {
        if (!repo.checkKeyValid(id, data.key)) throw ProbeException.keyNotMatch()
        repo.updateAndInsertData(id, data.timestamp, data.data)
    }

    fun updateSort(sortList: List<ProbeTargetOrderUpdate>) {
        try {
            repo.saveInputsCommand(sortList, SaveMode.UPDATE_ONLY).execute()
        } catch (_: Exception) {
            throw ProbeException.UpdateSortFailed()
        }
    }

}