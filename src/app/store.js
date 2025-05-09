import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/AuthSlice';
import transactionsReducer from '../features/transactions/TransactionsSlice';
import categoriesReducer from '../features/categories/CategoriesSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        transactions: transactionsReducer,
        categories: categoriesReducer,
    },
});