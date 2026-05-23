package com.coooolfan.uniboard.utils

import java.security.MessageDigest

fun hashPassword(password: String): String {
    val digest = MessageDigest.getInstance("SHA3-384")
    val hashBytes = digest.digest(password.toByteArray(Charsets.UTF_8))

    return hashBytes.joinToString("") {
        "%02x".format(it.toInt() and 0xFF)
    }
}
