import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTransaction } from '../api/payApi';
import './Pay.css';

function Pay() {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    type: 'payment'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Call the API to create transaction
      const response = await createTransaction(formData);
      console.log('Transaction created:', response);

      // Reset form
      setFormData({ amount: '', description: '', type: 'payment' });

      // Navigate to transactions page to see the new transaction
      setTimeout(() => {
        navigate('/transaction');
      }, 500);
    } catch (err) {
      console.error('Error submitting transaction:', err);
      setError('Failed to submit transaction. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="pay-container">
      <h1>Make a Payment</h1>
      <form onSubmit={handleSubmit} className="transaction-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            required
            step="0.01"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter transaction description"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Transaction Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="payment">Payment</option>
            <option value="transfer">Transfer</option>
            <option value="refund">Refund</option>
          </select>
        </div>

        <button type="submit" className="form-submit-btn" disabled={loading}>
          {loading ? 'Processing...' : 'Submit Payment'}
        </button>
      </form>
    </div>
  );
}

export default Pay;

