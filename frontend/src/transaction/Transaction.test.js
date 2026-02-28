import { render, screen, waitFor } from '@testing-library/react';
import Transaction from './Transaction';
import * as payApi from '../api/payApi';

jest.mock('../api/payApi');

describe('Transaction Component', () => {
  const mockTransactions = [
    {
      id: '1',
      amount: 100.0,
      description: 'Coffee',
      type: 'payment',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      amount: 50.0,
      description: 'Lunch',
      type: 'transfer',
      timestamp: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders transactions heading', () => {
    payApi.getAllTransactions.mockResolvedValueOnce(mockTransactions);

    render(<Transaction />);
    const heading = screen.getByText(/Transactions/i);
    expect(heading).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    payApi.getAllTransactions.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve(mockTransactions), 100))
    );

    render(<Transaction />);
    expect(screen.getByText(/Loading transactions/i)).toBeInTheDocument();
  });

  test('displays transactions table when data loaded', async () => {
    payApi.getAllTransactions.mockResolvedValueOnce(mockTransactions);

    render(<Transaction />);

    await waitFor(() => {
      expect(screen.getByText(/Coffee/i)).toBeInTheDocument();
    });
  });

  test('renders table headers', async () => {
    payApi.getAllTransactions.mockResolvedValueOnce(mockTransactions);

    render(<Transaction />);

    await waitFor(() => {
      expect(screen.getByText(/ID/i)).toBeInTheDocument();
      expect(screen.getByText(/Amount/i)).toBeInTheDocument();
      expect(screen.getByText(/Description/i)).toBeInTheDocument();
      expect(screen.getByText(/Type/i)).toBeInTheDocument();
      expect(screen.getByText(/Date/i)).toBeInTheDocument();
    });
  });

  test('displays transaction data correctly', async () => {
    payApi.getAllTransactions.mockResolvedValueOnce(mockTransactions);

    render(<Transaction />);

    await waitFor(() => {
      expect(screen.getByText('Coffee')).toBeInTheDocument();
      expect(screen.getByText('$100.00')).toBeInTheDocument();
      expect(screen.getByText('payment')).toBeInTheDocument();
    });
  });

  test('handles empty transaction list', async () => {
    payApi.getAllTransactions.mockResolvedValueOnce([]);

    render(<Transaction />);

    await waitFor(() => {
      expect(screen.getByText(/No transactions found/i)).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    payApi.getAllTransactions.mockRejectedValueOnce(new Error('API Error'));

    render(<Transaction />);

    // Should still show loading initially
    expect(screen.getByText(/Loading transactions/i)).toBeInTheDocument();

    // Error is logged but component shows no transactions
    await waitFor(() => {
      expect(screen.getByText(/No transactions found/i)).toBeInTheDocument();
    });
  });

  test('converts timestamp to date correctly', async () => {
    const testDate = '2024-01-15T10:30:00Z';
    const transactions = [
      {
        id: '1',
        amount: 100.0,
        description: 'Test',
        type: 'payment',
        timestamp: testDate,
      },
    ];

    payApi.getAllTransactions.mockResolvedValueOnce(transactions);

    render(<Transaction />);

    await waitFor(() => {
      expect(screen.getByText(/1\/15\/2024/i)).toBeInTheDocument();
    });
  });

  test('formats amount with two decimal places', async () => {
    const transactions = [
      {
        id: '1',
        amount: 100.5,
        description: 'Test',
        type: 'payment',
        timestamp: new Date().toISOString(),
      },
    ];

    payApi.getAllTransactions.mockResolvedValueOnce(transactions);

    render(<Transaction />);

    await waitFor(() => {
      expect(screen.getByText('$100.50')).toBeInTheDocument();
    });
  });

  test('shows transaction table class', async () => {
    payApi.getAllTransactions.mockResolvedValueOnce(mockTransactions);

    const { container } = render(<Transaction />);

    await waitFor(() => {
      expect(container.querySelector('.transaction-table')).toBeInTheDocument();
    });
  });

  test('handles array and object responses', async () => {
    // API might return array or object values
    const objectResponse = {
      0: mockTransactions[0],
      1: mockTransactions[1],
    };

    payApi.getAllTransactions.mockResolvedValueOnce(objectResponse);

    render(<Transaction />);

    await waitFor(() => {
      expect(screen.getByText('Coffee')).toBeInTheDocument();
    });
  });

  test('displays correct transaction count', async () => {
    payApi.getAllTransactions.mockResolvedValueOnce(mockTransactions);

    render(<Transaction />);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // Header row + 2 data rows
      expect(rows).toHaveLength(3);
    });
  });

  test('calls getAllTransactions on mount', () => {
    payApi.getAllTransactions.mockResolvedValueOnce([]);

    render(<Transaction />);

    expect(payApi.getAllTransactions).toHaveBeenCalledTimes(1);
  });

  test('ID is truncated to 8 characters', async () => {
    const transactions = [
      {
        id: '123456789012345',
        amount: 100.0,
        description: 'Test',
        type: 'payment',
        timestamp: new Date().toISOString(),
      },
    ];

    payApi.getAllTransactions.mockResolvedValueOnce(transactions);

    render(<Transaction />);

    await waitFor(() => {
      expect(screen.getByText('12345678...')).toBeInTheDocument();
    });
  });
});

