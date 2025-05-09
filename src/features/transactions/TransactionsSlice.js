import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/transactions`, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/add',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/transactions`,
        transactionData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/update',
  async ({ id, transactionData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/transactions/${id}`,
        transactionData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/transactions/${id}`, getAuthHeader());
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  transactions: [],
  loading: false,
  error: null,
  balance: 0,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        // Convert all amounts to numbers with 2 decimal places
        state.transactions = action.payload.map(transaction => ({
          ...transaction,
          amount: parseFloat(parseFloat(transaction.amount).toFixed(2))
        }));
        
        // Calculate total income
        const totalIncome = state.transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => {
            const amount = parseFloat(parseFloat(t.amount).toFixed(2));
            return sum + amount;
          }, 0);
          
        // Calculate total expenses
        const totalExpenses = state.transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => {
            const amount = parseFloat(parseFloat(t.amount).toFixed(2));
            return sum + amount;
          }, 0);
          
        // Calculate final balance with 2 decimal places
        state.balance = parseFloat((totalIncome - totalExpenses).toFixed(2));
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add transaction
      .addCase(addTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const newTransaction = {
          ...action.payload,
          amount: parseFloat(parseFloat(action.payload.amount).toFixed(2))
        };
        state.transactions.push(newTransaction);
        
        // Recalculate total balance
        const totalIncome = state.transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => {
            const amount = parseFloat(parseFloat(t.amount).toFixed(2));
            return sum + amount;
          }, 0);
          
        const totalExpenses = state.transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => {
            const amount = parseFloat(parseFloat(t.amount).toFixed(2));
            return sum + amount;
          }, 0);
          
        state.balance = parseFloat((totalIncome - totalExpenses).toFixed(2));
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update transaction
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.transactions.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          const updatedTransaction = {
            ...action.payload,
            amount: parseFloat(parseFloat(action.payload.amount).toFixed(2))
          };
          state.transactions[index] = updatedTransaction;
          
          // Recalculate total balance
          const totalIncome = state.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => {
              const amount = parseFloat(parseFloat(t.amount).toFixed(2));
              return sum + amount;
            }, 0);
            
          const totalExpenses = state.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => {
              const amount = parseFloat(parseFloat(t.amount).toFixed(2));
              return sum + amount;
            }, 0);
            
          state.balance = parseFloat((totalIncome - totalExpenses).toFixed(2));
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete transaction
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter(t => t.id !== action.payload);
        
        // Recalculate total balance
        const totalIncome = state.transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => {
            const amount = parseFloat(parseFloat(t.amount).toFixed(2));
            return sum + amount;
          }, 0);
          
        const totalExpenses = state.transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => {
            const amount = parseFloat(parseFloat(t.amount).toFixed(2));
            return sum + amount;
          }, 0);
          
        state.balance = parseFloat((totalIncome - totalExpenses).toFixed(2));
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = transactionsSlice.actions;
export default transactionsSlice.reducer;
