package com.jen.backend.service;

import com.jen.backend.model.Transaction;
import io.micrometer.core.instrument.MeterRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collection;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    private TransactionService transactionService;

    @Mock
    private MeterRegistry meterRegistry;

    @BeforeEach
    void setUp() {
        transactionService = new TransactionService(meterRegistry);
    }

    @Test
    void testCreateTransaction() {
        Transaction transaction = new Transaction(null, 100.0, "Test payment", "payment", null);

        Transaction created = transactionService.create(transaction);

        assertNotNull(created);
        assertNotNull(created.getId());
        assertEquals(100.0, created.getAmount());
        assertEquals("Test payment", created.getDescription());
        assertEquals("payment", created.getType());
        assertNotNull(created.getTimestamp());
    }

    @Test
    void testGetTransaction() {
        Transaction transaction = new Transaction(null, 50.0, "Get test", "transfer", null);
        Transaction created = transactionService.create(transaction);

        Transaction retrieved = transactionService.get(created.getId());

        assertNotNull(retrieved);
        assertEquals(created.getId(), retrieved.getId());
        assertEquals(50.0, retrieved.getAmount());
    }

    @Test
    void testGetNonExistentTransaction() {
        Transaction retrieved = transactionService.get("non-existent-id");
        assertNull(retrieved);
    }

    @Test
    void testGetAllTransactions() {
        transactionService.create(new Transaction(null, 100.0, "First", "payment", null));
        transactionService.create(new Transaction(null, 200.0, "Second", "transfer", null));

        Collection<Transaction> all = transactionService.getAll();

        assertNotNull(all);
        assertEquals(2, all.size());
    }

    @Test
    void testGetAllTransactionsEmpty() {
        Collection<Transaction> all = transactionService.getAll();

        assertNotNull(all);
        assertTrue(all.isEmpty());
    }

    @Test
    void testMultipleTransactions() {
        for (int i = 0; i < 5; i++) {
            transactionService.create(new Transaction(null, i * 10.0, "Transaction " + i, "payment", null));
        }

        Collection<Transaction> all = transactionService.getAll();
        assertEquals(5, all.size());
    }

    @Test
    void testTransactionIdUniqueness() {
        Transaction t1 = transactionService.create(new Transaction(null, 100.0, "T1", "payment", null));
        Transaction t2 = transactionService.create(new Transaction(null, 200.0, "T2", "payment", null));

        assertNotEquals(t1.getId(), t2.getId());
    }

    @Test
    void testTransactionWithNullDescription() {
        Transaction transaction = new Transaction(null, 100.0, null, "payment", null);
        Transaction created = transactionService.create(transaction);

        assertNotNull(created);
        assertNull(created.getDescription());
    }

    @Test
    void testCreateTransactionWithDifferentTypes() {
        String[] types = {"payment", "transfer", "refund"};

        for (String type : types) {
            Transaction tx = transactionService.create(
                new Transaction(null, 100.0, type + " test", type, null)
            );
            assertEquals(type, tx.getType());
        }
    }
}

