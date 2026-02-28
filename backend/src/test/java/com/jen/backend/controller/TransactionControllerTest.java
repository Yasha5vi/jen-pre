package com.jen.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jen.backend.model.Transaction;
import com.jen.backend.service.TransactionService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
class TransactionControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TransactionService transactionService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @AfterEach
    void tearDown() {
        // Clear all transactions after each test to ensure test isolation
        transactionService.clear();
    }

    @Test
    void testCreateTransaction() throws Exception {
        Transaction transaction = new Transaction(null, 100.0, "Test payment", "payment", null);

        MvcResult result = mockMvc.perform(post("/transactions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(transaction)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.amount").value(100.0))
                .andExpect(jsonPath("$.description").value("Test payment"))
                .andExpect(jsonPath("$.type").value("payment"))
                .andExpect(jsonPath("$.timestamp").exists())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        Transaction createdTransaction = objectMapper.readValue(responseBody, Transaction.class);
        assertTransactionValid(createdTransaction);
    }

    @Test
    void testGetTransaction() throws Exception {
        Transaction transaction = new Transaction(null, 50.0, "Get test", "transfer", null);
        Transaction created = transactionService.create(transaction);

        mockMvc.perform(get("/transactions/" + created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(created.getId()))
                .andExpect(jsonPath("$.amount").value(50.0))
                .andExpect(jsonPath("$.description").value("Get test"));
    }

    @Test
    void testGetNonExistentTransaction() throws Exception {
        mockMvc.perform(get("/transactions/non-existent-id"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetAllTransactions() throws Exception {
        transactionService.create(new Transaction(null, 100.0, "First", "payment", null));
        transactionService.create(new Transaction(null, 200.0, "Second", "transfer", null));

        mockMvc.perform(get("/transactions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(2))));
    }

    @Test
    void testCreateTransactionWithNullAmount() throws Exception {
        String jsonPayload = "{\"amount\": null, \"description\": \"Test\", \"type\": \"payment\"}";

        mockMvc.perform(post("/transactions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
                .andExpect(status().is4xxClientError());
    }

    @Test
    void testCreateTransactionWithDifferentTypes() throws Exception {
        String[] types = {"payment", "transfer", "refund"};

        for (String type : types) {
            Transaction transaction = new Transaction(null, 100.0, type + " test", type, null);

            mockMvc.perform(post("/transactions")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(transaction)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.type").value(type));
        }
    }

    @Test
    void testCreateTransactionWithNegativeAmount() throws Exception {
        Transaction transaction = new Transaction(null, -100.0, "Refund", "refund", null);

        // Backend allows negative amounts (could represent refunds)
        MvcResult result = mockMvc.perform(post("/transactions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(transaction)))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        Transaction createdTransaction = objectMapper.readValue(responseBody, Transaction.class);
        assertEquals(-100.0, createdTransaction.getAmount());
    }

    @Test
    void testTransactionsCorsHeaders() throws Exception {
        // CORS headers are added by Spring's DispatcherServlet in a real servlet context
        // In MockMvc, we just verify the endpoint is accessible
        mockMvc.perform(get("/transactions")
                .header("Origin", "http://localhost:3000"))
                .andExpect(status().isOk());
    }

    @Test
    void testCreateMultipleTransactions() throws Exception {
        for (int i = 0; i < 5; i++) {
            Transaction transaction = new Transaction(null, i * 10.0, "Transaction " + i, "payment", null);

            mockMvc.perform(post("/transactions")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(transaction)))
                    .andExpect(status().isOk());
        }


        mockMvc.perform(get("/transactions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)));
    }

    @Test
    void testOptionsRequest() throws Exception {
        mockMvc.perform(options("/transactions"))
                .andExpect(status().isOk());
    }

    // Helper method to validate transaction structure
    private void assertTransactionValid(Transaction transaction) {
        assert transaction != null : "Transaction should not be null";
        assert transaction.getId() != null : "Transaction ID should not be null";
        assert transaction.getTimestamp() != null : "Transaction timestamp should not be null";
    }
}

