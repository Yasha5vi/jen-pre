package com.jen.backend.controller;

import com.jen.backend.model.Transaction;
import com.jen.backend.service.TransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Collection;
import java.util.Optional;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService service;
    private final Logger logger = LoggerFactory.getLogger(TransactionController.class);

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Transaction> create(@RequestBody Transaction txn) {
        logger.info("Creating transaction amount={} type={}", txn.getAmount(), txn.getType());
        return ResponseEntity.ok(service.create(txn));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> get(@PathVariable String id) {
        logger.info("Fetching transaction id={}", id);
        return ResponseEntity.of(Optional.ofNullable(service.get(id)));
    }

    @GetMapping
    public ResponseEntity<Collection<Transaction>> getAll() {
        logger.info("Fetching all transactions");
        return ResponseEntity.ok(service.getAll());
    }

    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();
    }
}
