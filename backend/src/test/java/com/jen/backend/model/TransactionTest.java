package com.jen.backend.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class TransactionTest {

    private Transaction transaction;

    @BeforeEach
    void setUp() {
        transaction = new Transaction("123", 100.50, "Test payment", "payment", Instant.now());
    }

    @Test
    void testTransactionCreation() {
        assertNotNull(transaction);
        assertEquals("123", transaction.getId());
        assertEquals(100.50, transaction.getAmount());
        assertEquals("Test payment", transaction.getDescription());
        assertEquals("payment", transaction.getType());
        assertNotNull(transaction.getTimestamp());
    }

    @Test
    void testSetId() {
        transaction.setId("456");
        assertEquals("456", transaction.getId());
    }

    @Test
    void testSetAmount() {
        transaction.setAmount(200.00);
        assertEquals(200.00, transaction.getAmount());
    }

    @Test
    void testSetDescription() {
        transaction.setDescription("Updated description");
        assertEquals("Updated description", transaction.getDescription());
    }

    @Test
    void testSetType() {
        transaction.setType("transfer");
        assertEquals("transfer", transaction.getType());
    }

    @Test
    void testSetTimestamp() {
        Instant newTime = Instant.now();
        transaction.setTimestamp(newTime);
        assertEquals(newTime, transaction.getTimestamp());
    }

    @Test
    void testNoArgConstructor() {
        Transaction tx = new Transaction();
        assertNotNull(tx);
    }

    @Test
    void testToString() {
        String result = transaction.toString();
        assertTrue(result.contains("123"));
        assertTrue(result.contains("100.5"));
        assertTrue(result.contains("payment"));
    }

    @Test
    void testNegativeAmount() {
        Transaction tx = new Transaction("999", -50.0, "Refund", "refund", Instant.now());
        assertEquals(-50.0, tx.getAmount());
    }

    @Test
    void testZeroAmount() {
        Transaction tx = new Transaction("999", 0.0, "Zero", "payment", Instant.now());
        assertEquals(0.0, tx.getAmount());
    }

    @Test
    void testNullDescription() {
        Transaction tx = new Transaction("999", 100.0, null, "payment", Instant.now());
        assertNull(tx.getDescription());
    }

    @Test
    void testEmptyDescription() {
        Transaction tx = new Transaction("999", 100.0, "", "payment", Instant.now());
        assertEquals("", tx.getDescription());
    }
}

