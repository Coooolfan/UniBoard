package com.coooolfan.uniboard.config

import cn.dev33.satoken.`fun`.strategy.SaCorsHandleFunction
import cn.dev33.satoken.interceptor.SaInterceptor
import cn.dev33.satoken.router.SaHttpMethod
import cn.dev33.satoken.router.SaRouter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class SaTokenConfig : WebMvcConfigurer {
    override fun addInterceptors(registry: InterceptorRegistry) {
        // 注册 Sa-Token 拦截器，打开注解式鉴权功能
        registry.addInterceptor(SaInterceptor())
            // 所有接口都会检查是否登录
            .addPathPatterns("/**")
    }

    /**
     * 跨域
     */
    @Bean
    fun corsHandle(): SaCorsHandleFunction {
        return SaCorsHandleFunction { req, res, sto ->
            res.apply {
                // 允许指定域访问跨域资源
                setHeader("Access-Control-Allow-Origin", "*")
                // 允许所有请求方式
                setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE")
                // 有效时间
                setHeader("Access-Control-Max-Age", "3600")
                // 允许的header参数
                setHeader("Access-Control-Allow-Headers", "*")
            }

            // 如果是预检请求，则立即返回到前端
            SaRouter.match(SaHttpMethod.OPTIONS)
                // Kotlin 的 lambda 表达式，println 对应 System.out.println
                .back()
        }
    }
}