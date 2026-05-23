package com.coooolfan.uniboard.config

import jakarta.servlet.Filter
import jakarta.servlet.FilterChain
import jakarta.servlet.ServletRequest
import jakarta.servlet.ServletResponse
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus

/**
 * OpenAPI过滤器配置
 *
 * 根据jimmer.client.enable属性决定是否允许访问OpenAPI相关路径
 */
@Configuration
class OpenApiFilterConfig {

    private val log = LoggerFactory.getLogger(OpenApiFilterConfig::class.java)

    @Value("\${jimmer.client.enable:true}")
    private var openApiEnabled: Boolean = true

    @Value("\${jimmer.client.openapi.path:/openapi.yml}")
    private lateinit var openapiPath: String

    @Value("\${jimmer.client.ts.path:/openapi.zip}")
    private lateinit var tsPath: String

    @Value("\${jimmer.client.openapi.ui-path:/openapi.html}")
    private lateinit var uiPath: String

    /**
     * 注册OpenAPI路径过滤器 过滤所有OpenAPI相关的路径请求
     *
     * @return 过滤器注册Bean
     */
    @Bean
    fun openApiFilter(): FilterRegistrationBean<Filter> {
        val registrationBean = FilterRegistrationBean<Filter>()

        log.info("OpenAPI Client: {}", if (openApiEnabled) "enable" else "disable")
        log.info("OpenAPI Client Path: {}, {}, {}", openapiPath, tsPath, uiPath)

        registrationBean.filter =
            Filter { request: ServletRequest, response: ServletResponse, chain: FilterChain ->
                val httpRequest = request as HttpServletRequest
                val httpResponse = response as HttpServletResponse

                val path = httpRequest.requestURI

                // 检查路径是否匹配配置的OpenAPI路径
                if (!openApiEnabled && (path == openapiPath || path == tsPath || path == uiPath)
                ) {
                    // 如果OpenAPI功能被禁用，返回404状态码
                    httpResponse.status = HttpStatus.NOT_FOUND.value()
                    return@Filter
                }

                // 继续处理请求
                chain.doFilter(request, response)
            }

        // 设置过滤器的URL模式，覆盖所有可能的OpenAPI路径
        val patterns = listOf(openapiPath, tsPath, uiPath).toTypedArray()
        registrationBean.addUrlPatterns(*patterns)
        registrationBean.setName("openApiFilter")
        registrationBean.order = 1

        return registrationBean
    }
}
