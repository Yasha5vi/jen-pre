import React, { useState, useEffect } from 'react';
import { getAllTransactions } from '../api/payApi';
import './Transaction.css';

function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getAllTransactions();
      // Convert the data to array if it's an object (Map)
      const transactionsArray = Array.isArray(data) ? data : Object.values(data);
      setTransactions(transactionsArray);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="transaction-container"><p>Loading transactions...</p></div>;
  }


  return (
    <div className="transaction-container">
      <h1>Transactions</h1>
      {transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id.substring(0, 8)}...</td>
                <td>${transaction.amount.toFixed(2)}</td>
                <td>{transaction.description || '-'}</td>
                <td>{transaction.type}</td>
                <td>{new Date(transaction.timestamp).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Transaction;

