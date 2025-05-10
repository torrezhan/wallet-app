import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Box,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { fetchTransactions } from '../features/transactions/TransactionsSlice';
import { fetchCategories } from '../features/categories/CategoriesSlice';
import styles from '../styles/components/Statistics.module.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function Statistics() {
  const dispatch = useDispatch();
  const { transactions } = useSelector((state) => state.transactions);
  const { categories } = useSelector((state) => state.categories);
  const [dateRange, setDateRange] = useState('thisMonth');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
  }, [dispatch]);

  const getDateRange = () => {
    const now = new Date();
    let startDate, endDate;

    switch (dateRange) {
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      case 'custom':
        if (!customStartDate || !customEndDate) {
          return { startDate: null, endDate: null };
        }
        startDate = new Date(customStartDate);
        endDate = new Date(customEndDate);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    return { startDate, endDate };
  };

  const getFilteredTransactions = () => {
    const { startDate, endDate } = getDateRange();
    
    if (!startDate || !endDate) {
      return [];
    }

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };

  const getIncomeByCategory = () => {
    const filteredTransactions = getFilteredTransactions();
    const incomeByCategory = {};

    filteredTransactions
      .filter((t) => t.type === 'income')
      .forEach((transaction) => {
        const category = categories.find((c) => c.id === transaction.categoryId);
        const categoryName = category ? category.name : 'Unknown';
        incomeByCategory[categoryName] = (incomeByCategory[categoryName] || 0) + Number(transaction.amount);
      });

    return Object.entries(incomeByCategory).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getExpensesByCategory = () => {
    const filteredTransactions = getFilteredTransactions();
    const expensesByCategory = {};

    filteredTransactions
      .filter((t) => t.type === 'expense')
      .forEach((transaction) => {
        const category = categories.find((c) => c.id === transaction.categoryId);
        const categoryName = category ? category.name : 'Unknown';
        expensesByCategory[categoryName] = (expensesByCategory[categoryName] || 0) + Number(transaction.amount);
      });

    return Object.entries(expensesByCategory).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getTotalIncome = () => {
    return getFilteredTransactions()
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  const getTotalExpenses = () => {
    return getFilteredTransactions()
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  const incomeData = getIncomeByCategory();
  const expensesData = getExpensesByCategory();
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();

  return (
    <div className={styles.statistics}>
      <div className={styles.filters}>
        <FormControl className={styles.filterSelect}>
          <InputLabel>Date Range</InputLabel>
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            label="Date Range"
          >
            <MenuItem value="thisMonth">This Month</MenuItem>
            <MenuItem value="lastMonth">Last Month</MenuItem>
            <MenuItem value="thisYear">This Year</MenuItem>
            <MenuItem value="custom">Custom Range</MenuItem>
          </Select>
        </FormControl>

        {dateRange === 'custom' && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              type="date"
              label="Start Date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="date"
              label="End Date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        )}
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>Total Income</div>
            <div className={`${styles.summaryValue} ${styles.income}`}>
              ${totalIncome.toFixed(2)}
            </div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>Total Expenses</div>
            <div className={`${styles.summaryValue} ${styles.expense}`}>
              ${totalExpenses.toFixed(2)}
            </div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>Net Balance</div>
            <div className={`${styles.summaryValue} ${totalIncome - totalExpenses >= 0 ? styles.income : styles.expense}`}>
              ${(totalIncome - totalExpenses).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <Typography className={styles.chartTitle}>Income by Category</Typography>
        </div>
        <div className={styles.chartContainer}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={incomeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {incomeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <Typography className={styles.chartTitle}>Expenses by Category</Typography>
        </div>
        <div className={styles.chartContainer}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={expensesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {expensesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <Typography className={styles.chartTitle}>Income vs Expenses</Typography>
        </div>
        <div className={styles.chartContainer}>
          <ResponsiveContainer>
            <BarChart
              data={[
                { name: 'Income', value: totalIncome },
                { name: 'Expenses', value: totalExpenses },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Statistics; 