import { fetchWithCors, buildApiUrl } from '../config/corsConfig';
import API_CONFIG from '../config/constants';

/**
 * Create a new transaction
 * @param {Object} transactionData - The transaction data (amount, description, type)
 * @returns {Promise<Object>} The created transaction with id and timestamp
 */
export const createTransaction = async (transactionData) => {
  try {
    const data = await fetchWithCors(API_CONFIG.ENDPOINTS.TRANSACTIONS, {
      method: 'POST',
      body: JSON.stringify({
        amount: parseFloat(transactionData.amount),
        description: transactionData.description,
        type: transactionData.type,
      }),
    });
    return data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

/**
 * Get all transactions
 * @returns {Promise<Array>} Array of all transactions
 */
export const getAllTransactions = async () => {
  try {
    const data = await fetchWithCors(API_CONFIG.ENDPOINTS.TRANSACTIONS, {
      method: 'GET',
    });
    return data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

/**
 * Get a specific transaction by ID
 * @param {string} id - The transaction ID
 * @returns {Promise<Object>} The transaction object
 */
export const getTransactionById = async (id) => {
  try {
    const endpoint = `${API_CONFIG.ENDPOINTS.TRANSACTIONS}/${id}`;
    const data = await fetchWithCors(endpoint, {
      method: 'GET',
    });
    return data;
  } catch (error) {
    console.error(`Error fetching transaction ${id}:`, error);
    throw error;
  }
};

