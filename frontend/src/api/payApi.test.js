import { createTransaction, getAllTransactions, getTransactionById } from './payApi';
import API_CONFIG from '../config/constants';

// Mock fetch globally
global.fetch = jest.fn();

describe('Pay API', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('createTransaction', () => {
    test('creates a transaction successfully', async () => {
      const mockResponse = {
        id: '123',
        amount: 100.0,
        description: 'Test',
        type: 'payment',
        timestamp: '2024-01-01T00:00:00Z',
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await createTransaction({
        amount: 100,
        description: 'Test',
        type: 'payment',
      });

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('sends correct request body', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const transactionData = {
        amount: 100,
        description: 'Test payment',
        type: 'transfer',
      };

      await createTransaction(transactionData);

      const call = fetch.mock.calls[0];
      const body = JSON.parse(call[1].body);

      expect(body.amount).toBe(100);
      expect(body.description).toBe('Test payment');
      expect(body.type).toBe('transfer');
    });

    test('uses POST method', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await createTransaction({ amount: 100, description: '', type: 'payment' });

      expect(fetch.mock.calls[0][1].method).toBe('POST');
    });

    test('handles API errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Bad request' }),
      });

      await expect(
        createTransaction({ amount: 100, description: '', type: 'payment' })
      ).rejects.toThrow();
    });

    test('converts amount to float', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await createTransaction({
        amount: '100',
        description: 'Test',
        type: 'payment',
      });

      const body = JSON.parse(fetch.mock.calls[0][1].body);
      expect(body.amount).toBe(100);
      expect(typeof body.amount).toBe('number');
    });
  });

  describe('getAllTransactions', () => {
    test('fetches all transactions', async () => {
      const mockTransactions = [
        { id: '1', amount: 100, description: 'Test1', type: 'payment', timestamp: '2024-01-01T00:00:00Z' },
        { id: '2', amount: 200, description: 'Test2', type: 'transfer', timestamp: '2024-01-02T00:00:00Z' },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransactions,
      });

      const result = await getAllTransactions();

      expect(result).toEqual(mockTransactions);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('uses GET method', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await getAllTransactions();

      expect(fetch.mock.calls[0][1].method).toBe('GET');
    });

    test('handles empty response', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await getAllTransactions();

      expect(result).toEqual([]);
    });

    test('handles API errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Server error' }),
      });

      await expect(getAllTransactions()).rejects.toThrow();
    });
  });

  describe('getTransactionById', () => {
    test('fetches single transaction', async () => {
      const mockTransaction = {
        id: '123',
        amount: 100,
        description: 'Test',
        type: 'payment',
        timestamp: '2024-01-01T00:00:00Z',
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransaction,
      });

      const result = await getTransactionById('123');

      expect(result).toEqual(mockTransaction);
    });

    test('uses correct endpoint', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await getTransactionById('123');

      const url = fetch.mock.calls[0][0];
      expect(url).toContain('/transactions/123');
    });

    test('uses GET method', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await getTransactionById('123');

      expect(fetch.mock.calls[0][1].method).toBe('GET');
    });

    test('handles non-existent transaction', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      await expect(getTransactionById('non-existent')).rejects.toThrow();
    });
  });

  describe('API Configuration', () => {
    test('includes correct headers', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await getAllTransactions();

      const headers = fetch.mock.calls[0][1].headers;
      expect(headers['Content-Type']).toBe('application/json');
    });

    test('uses credentials include', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await getAllTransactions();

      expect(fetch.mock.calls[0][1].credentials).toBe('include');
    });
  });

  describe('Error Handling', () => {
    test('logs errors to console', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      try {
        await getAllTransactions();
      } catch {
        // Error expected
      }

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('provides meaningful error messages', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' }),
      });

      await expect(getAllTransactions()).rejects.toThrow(/Internal server error/);
    });
  });
});

