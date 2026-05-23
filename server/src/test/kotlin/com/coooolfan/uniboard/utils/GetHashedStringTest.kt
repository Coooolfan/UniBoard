package com.coooolfan.uniboard.utils

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals
import kotlin.test.assertTrue

class GetHashedStringTest {

    @Test
    fun `test hash length matches requested length`() {
        val input = "test-string"

        // 测试不同长度的哈希值
        assertEquals(4, getHashedString(input, 4).length)
        assertEquals(10, getHashedString(input, 10).length)
        assertEquals(20, getHashedString(input, 20).length)
        assertEquals(37, getHashedString(input, 37).length)
    }

    @Test
    fun `test default hash length is 4`() {
        val input = "test-string"
        assertEquals(4, getHashedString(input).length)
    }

    @Test
    fun `test hash contains only valid charset characters`() {
        val input = "test-string"
        val hash = getHashedString(input, 20)
        val validCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

        // 验证哈希值中的每个字符都在有效字符集中
        hash.forEach { char ->
            assertTrue(validCharset.contains(char), "Character $char is not in the valid charset")
        }
    }

    @Test
    fun `test same input with different timestamps produces different hashes`() {
        val input = "test-string"

        // 由于方法内部使用时间戳，同一输入的两次调用应产生不同的哈希值
        val hash1 = getHashedString(input, 10)
        Thread.sleep(10) // 确保时间戳不同
        val hash2 = getHashedString(input, 10)

        assertNotEquals(hash1, hash2)
    }

    @Test
    fun `test different inputs produce different hashes`() {
        val input1 = "test-string-1"
        val input2 = "test-string-2"

        val hash1 = getHashedString(input1, 10)
        val hash2 = getHashedString(input2, 10)

        assertNotEquals(hash1, hash2)
    }

    @Test
    fun `test throws exception for invalid hash length - zero`() {
        val input = "test-string"

        val exception = assertThrows<IllegalArgumentException> { getHashedString(input, 0) }

        assertTrue(exception.message?.contains("必须大于 0") == true)
    }

    @Test
    fun `test throws exception for invalid hash length - negative`() {
        val input = "test-string"

        val exception = assertThrows<IllegalArgumentException> { getHashedString(input, -5) }

        assertTrue(exception.message?.contains("必须大于 0") == true)
    }

    @Test
    fun `test throws exception for hash length exceeding maximum`() {
        val input = "test-string"

        val exception =
            assertThrows<IllegalArgumentException> {
                getHashedString(input, 38) // MAX_SUPPORTED_LENGTH + 1
            }

        assertTrue(exception.message?.contains("超出了最大支持长度") == true)
    }

    @Test
    fun `test boundary value - minimum valid length 1`() {
        val input = "test-string"
        assertEquals(1, getHashedString(input, 1).length)
    }

    @Test
    fun `test boundary value - maximum valid length 37`() {
        val input = "test-string"
        assertEquals(37, getHashedString(input, 37).length)
    }

    @Test
    fun `test boundary values near maximum`() {
        val input = "test-string"
        assertEquals(36, getHashedString(input, 36).length)
        assertEquals(37, getHashedString(input, 37).length)

        val exception = assertThrows<IllegalArgumentException> { getHashedString(input, 38) }
        assertTrue(exception.message?.contains("超出了最大支持长度") == true)
    }

    @Test
    fun `test empty string input`() {
        val input = ""
        val hash = getHashedString(input, 10)
        assertEquals(10, hash.length)
    }

    @Test
    fun `test very long string input`() {
        val input = "a".repeat(10000)
        val hash = getHashedString(input, 10)
        assertEquals(10, hash.length)
    }

    @Test
    fun `test special characters in input`() {
        val input = "特殊字符!@#$%^&*()_+{}|:<>?~"
        val hash = getHashedString(input, 10)
        assertEquals(10, hash.length)

        val validCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        hash.forEach { char ->
            assertTrue(validCharset.contains(char), "Character $char is not in the valid charset")
        }
    }
}
