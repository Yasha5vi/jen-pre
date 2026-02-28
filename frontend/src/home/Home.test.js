import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../home/Home';

describe('Home Component', () => {
  test('renders welcome heading', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    const heading = screen.getByText(/Flakes/i);
    expect(heading).toBeInTheDocument();
  });

  test('renders subtitle', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    const subtitle = screen.getByText(/Manage your transactions/i);
    expect(subtitle).toBeInTheDocument();
  });

  test('renders Make a Payment button', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    const payButton = screen.getByText(/Make a Payment/i);
    expect(payButton).toBeInTheDocument();
  });

  test('renders View Transactions button', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    const transactionButton = screen.getByText(/View Transactions/i);
    expect(transactionButton).toBeInTheDocument();
  });

  test('Pay button links to /pay', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    const payButton = screen.getByText(/Make a Payment/i).closest('a');
    expect(payButton).toHaveAttribute('href', '/pay');
  });

  test('Transactions button links to /transaction', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    const transactionButton = screen.getByText(/View Transactions/i).closest('a');
    expect(transactionButton).toHaveAttribute('href', '/transaction');
  });

  test('buttons have correct CSS classes', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    const payButton = screen.getByText(/Make a Payment/i);
    const transactionButton = screen.getByText(/View Transactions/i);

    expect(payButton).toHaveClass('btn');
    expect(payButton).toHaveClass('btn-primary');
    expect(transactionButton).toHaveClass('btn');
    expect(transactionButton).toHaveClass('btn-secondary');
  });
});

