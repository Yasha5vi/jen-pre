package com.jen.backend.service;

import com.jen.backend.model.Transaction;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TransactionService {

    private final Map<String, Transaction> store = new ConcurrentHashMap<>();
    private final Counter transactionCounter;
    private final Timer transactionTimer;

    public TransactionService(MeterRegistry registry) {
        this.transactionCounter = registry.counter("transactions.created");
        this.transactionTimer = registry.timer("transactions.processing.time");
    }

    public Transaction create(Transaction txn) {
        txn.setId(UUID.randomUUID().toString());
        txn.setTimestamp(Instant.now());
        store.put(txn.getId(), txn);
        return txn;
    }

    public Transaction get(String id) {
        return store.get(id);
    }

    public Collection<Transaction> getAll() {
        return store.values();
    }
}
