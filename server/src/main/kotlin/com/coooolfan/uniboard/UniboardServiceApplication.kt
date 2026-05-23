package com.coooolfan.uniboard

import org.babyfish.jimmer.client.EnableImplicitApi
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
@EnableImplicitApi
class UniboardServiceApplication

fun main(args: Array<String>) {
    runApplication<UniboardServiceApplication>(*args)
}
