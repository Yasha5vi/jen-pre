import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Pay from './Pay';
import * as payApi from '../api/payApi';

jest.mock('../api/payApi');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('Pay Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders pay form heading', () => {
    render(
      <BrowserRouter>
        <Pay />
      </BrowserRouter>
    );
    const heading = screen.getByText(/Make a Payment/i);
    expect(heading).toBeInTheDocument();
  });

  test('renders all form fields', () => {
    render(
      <BrowserRouter>
        <Pay />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Transaction Type/i)).toBeInTheDocument();
  });

  test('renders submit button', () => {
    render(
      <BrowserRouter>
        <Pay />
      </BrowserRouter>
    );
    const submitButton = screen.getByRole('button', { name: /Submit Payment/i });
    expect(submitButton).toBeInTheDocument();
  });

  test('form inputs are initially empty', () => {
    render(
      <BrowserRouter>
        <Pay />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/Amount/i)).toHaveValue(null);
    expect(screen.getByLabelText(/Description/i)).toHaveValue('');
  });

  test('default transaction type is payment', () => {
    render(
      <BrowserRouter>
        <Pay />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/Transaction Type/i)).toHaveValue('payment');
  });

  test('form validation requires amount', () => {
    render(
      <BrowserRouter>
        <Pay />
      </BrowserRouter>
    );
    const amountInput = screen.getByLabelText(/Amount/i);
    expect(amountInput).toBeRequired();
  });

  test('accepts decimal amounts', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Pay />
      </BrowserRouter>
    );
    const amountInput = screen.getByLabelText(/Amount/i);
    await user.type(amountInput, '123.45');
    expect(amountInput).toHaveValue(123.45);
  });

  test('updates form fields on user input', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Pay />
      </BrowserRouter>
    );

    const amountInput = screen.getByLabelText(/Amount/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const typeSelect = screen.getByLabelText(/Transaction Type/i);

    await user.type(amountInput, '100');
    await user.type(descriptionInput, 'Test payment');
    await user.selectOptions(typeSelect, 'transfer');

    expect(amountInput).toHaveValue(100);
    expect(descriptionInput).toHaveValue('Test payment');
    expect(typeSelect).toHaveValue('transfer');
  });

  test('submit button has correct class', () => {
    render(
      <BrowserRouter>
        <Pay />
      </BrowserRouter>
    );
    const submitButton = screen.getByRole('button', { name: /Submit Payment/i });
    expect(submitButton).toHaveClass('form-submit-btn');
  });

  test('handles API error gracefully', async () => {
    const user = userEvent.setup();
    payApi.createTransaction.mockRejectedValueOnce(new Error('API Error'));

    render(
      <BrowserRouter>
        <Pay />
      </BrowserRouter>
    );

    const amountInput = screen.getByLabelText(/Amount/i);
    const submitButton = screen.getByRole('button', { name: /Submit Payment/i });

    await user.type(amountInput, '100');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to submit transaction/i)).toBeInTheDocument();
    });
  });

  test('transaction type options are available', () => {
    render(
      <BrowserRouter>
        <Pay />
      </BrowserRouter>
    );
    const typeSelect = screen.getByLabelText(/Transaction Type/i);
    const options = typeSelect.querySelectorAll('option');

    expect(options).toHaveLength(3);
    expect(options[0]).toHaveValue('payment');
    expect(options[1]).toHaveValue('transfer');
    expect(options[2]).toHaveValue('refund');
  });

  test('form fields are disabled during submission', async () => {
    const user = userEvent.setup();
    payApi.createTransaction.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({}), 100))
    );

    render(
      <BrowserRouter>
        <Pay />
      </BrowserRouter>
    );

    const amountInput = screen.getByLabelText(/Amount/i);
    const submitButton = screen.getByRole('button', { name: /Submit Payment/i });

    await user.type(amountInput, '100');
    await user.click(submitButton);

    await waitFor(() => {
      expect(amountInput).toBeDisabled();
    });
  });
});

