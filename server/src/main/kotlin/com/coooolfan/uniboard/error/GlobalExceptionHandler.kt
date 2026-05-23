package com.coooolfan.uniboard.error

import cn.dev33.satoken.exception.NotLoginException
import cn.dev33.satoken.stp.StpUtil
import org.babyfish.jimmer.error.CodeBasedRuntimeException
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(CodeBasedRuntimeException::class)
    fun handle(ex: CodeBasedRuntimeException): ResponseEntity<Map<String, Any>> {
        val statusCode = when (ex.code) {
            ProfileErrorCode.SYSTEM_UNINITIALIZED.toString() -> 404 // Service Unavailable
            ProfileErrorCode.SYSTEM_ALREADY_INITIALIZED.toString() -> 409 // Conflict
            CommonErrorCode.NOT_FOUND.toString() -> 404 // Not Found
            CommonErrorCode.AUTHENTICATION_FAILED.toString() -> 401 // Unauthorized
            CommonErrorCode.FORBIDDEN.toString() -> 403 // Forbidden
            ProfileErrorCode.EMPTY_LOGIN_NAME.toString() -> 400 // Bad Request
            ProfileErrorCode.EMPTY_NAME.toString() -> 400 // Bad Request
            HyperLinkErrorCode.FETCH_SNAPSHOT_FAILED.toString() -> 400 // Bad Request
            HyperLinkErrorCode.UPDATE_SORT_FAILED.toString() -> 400 // Bad Request
            else -> 500 // Internal Server Error
        }
        return ResponseEntity
            .status(statusCode)
            .body(resultMap(ex))
    }


    @ExceptionHandler(NotLoginException::class)
    fun handleAuthenticationFailed(): ResponseEntity<Any>? {
        StpUtil.logout()
        return ResponseEntity
            .status(401)
            .body(resultMap(CommonException.AuthenticationFailed()))
    }

    private fun resultMap(ex: CodeBasedRuntimeException): Map<String, Any> {
        val resultMap: MutableMap<String, Any> = LinkedHashMap()
        resultMap["family"] = ex.family
        resultMap["code"] = ex.code
        return resultMap
    }

}