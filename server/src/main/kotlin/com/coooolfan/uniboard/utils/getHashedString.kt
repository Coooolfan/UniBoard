package com.coooolfan.uniboard.utils

import java.nio.charset.StandardCharsets
import java.security.MessageDigest

// --- 常量定义 ---
private const val HASH_ALGORITHM = "SHA3-224"
private const val AVAILABLE_HASH_BYTES = 28 // SHA3-224 输出 28 字节
private const val CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
private const val CHARSET_SIZE = CHARSET.length // 值为 62

// 从哈希流中读取 6 位块以映射到字符集
private const val BITS_TO_EXTRACT_PER_CHAR = 6

// 1L shl BITS_TO_EXTRACT_PER_CHAR - 1L => (1 shl 6) - 1 = 64 - 1 = 63 (即 0x3F)
private const val BIT_MASK = (1L shl BITS_TO_EXTRACT_PER_CHAR) - 1L

// floor(AVAILABLE_HASH_BYTES * 8.0 / BITS_TO_EXTRACT_PER_CHAR).toInt()
private const val MAX_SUPPORTED_LENGTH = 37
fun getHashedString(str: String, hashLength: Int = 4): String {

    // --- 前置检查 ---
    // 最大支持长度仍然取决于我们能从哈希中提取多少个 6 位块

    if (hashLength <= 0) {
        throw IllegalArgumentException("hashLength 必须大于 0。")
    }
    if (hashLength > MAX_SUPPORTED_LENGTH) {
        throw IllegalArgumentException(
            "请求的 hashLength ($hashLength) 超出了最大支持长度 ($MAX_SUPPORTED_LENGTH) " +
                    "（基于哈希算法 $HASH_ALGORITHM (${AVAILABLE_HASH_BYTES} 字节) 和每次提取 $BITS_TO_EXTRACT_PER_CHAR 比特）。"
        )
    }
    // --- 检查结束 ---

    val strRand = str + System.currentTimeMillis() // 添加时间戳以增加随机性
    val digest = MessageDigest.getInstance(HASH_ALGORITHM)
    val hashBytes = digest.digest(strRand.toByteArray(StandardCharsets.UTF_8))

    val result = StringBuilder(hashLength)
    var bitBuffer = 0L
    var bitsInBuffer = 0
    var byteIndex = 0

    repeat(hashLength) {
        while (bitsInBuffer < BITS_TO_EXTRACT_PER_CHAR) {
            bitBuffer = (bitBuffer shl 8) or (hashBytes[byteIndex].toLong() and 0xFFL)
            bitsInBuffer += 8
            byteIndex++
        }

        // 提取 6 位原始索引 (0-63)
        val bitsToShift = bitsInBuffer - BITS_TO_EXTRACT_PER_CHAR
        val rawIndex = ((bitBuffer shr bitsToShift) and BIT_MASK).toInt() // rawIndex is 0-63

        // *** 使用模运算将索引映射到 [0, CHARSET_SIZE - 1] ***
        val charIndex = rawIndex % CHARSET_SIZE // Map 0-63 to 0-61

        result.append(CHARSET[charIndex]) // 索引保证在 [0, 61] 范围内

        // 更新缓冲区
        bitsInBuffer -= BITS_TO_EXTRACT_PER_CHAR
        bitBuffer = bitBuffer and ((1L shl bitsInBuffer) - 1L)
    }

    return result.toString()
}

// --- 示例调用 ---
//fun main() {
//
//    repeat (100000) {
//        try {
//            println("Charset size: ${CHARSET.length}") // 确认是 62
//            println("Max length: ${floor(AVAILABLE_HASH_BYTES * 8.0 / BITS_TO_EXTRACT_PER_CHAR).toInt()}") // 确认是 37
//            val input = "$it " + UUID.randomUUID()
//            println("Input: '$input' -> Hash (len 4): ${getHashedString(input, 4)}")
//            println("Input: '$input' -> Hash (len 10): ${getHashedString(input, 10)}")
//            println("Input: '$input' -> Hash (len 37): ${getHashedString(input, 37)}") // Max length
//            println("Input: '$input' -> Hash (len 38): ${getHashedString(input, 38)}") // Max length + 1
//            // 尝试请求超出最大长度，会触发前置检查
//            // getHashedString(input, 38)
//        } catch (e: IllegalArgumentException) {
//            println("捕获到参数异常: ${e.message}")
//        } catch (e: Exception) {
//            e.printStackTrace() // 打印堆栈信息帮助调试
//            // 遇到其他异常时退出repeat
//            println("捕获到其他异常: ${e.message}")
//            return@repeat
//        }
//    }
//}