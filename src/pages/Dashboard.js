import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemSecondaryAction,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import {
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from '../features/transactions/TransactionsSlice';
import { fetchCategories } from '../features/categories/CategoriesSlice';
import styles from '../styles/components/Dashboard.module.css';

function Dashboard() {
  const dispatch = useDispatch();
  const { transactions, balance } = useSelector((state) => state.transactions);
  const { categories } = useSelector((state) => state.categories);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    categoryId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    comment: '',
  });

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpenDialog = (transaction = null) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        type: transaction.type,
        amount: transaction.amount,
        categoryId: transaction.categoryId,
        date: format(new Date(transaction.date), 'yyyy-MM-dd'),
        comment: transaction.comment || '',
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        type: 'expense',
        amount: '',
        categoryId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        comment: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTransaction(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTransaction) {
      dispatch(updateTransaction({
        id: editingTransaction.id,
        transactionData: formData,
      }));
    } else {
      dispatch(addTransaction(formData));
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(id));
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.balanceCard}>
        <div className={styles.balanceTitle}>Current Balance</div>
        <div className={`${styles.balanceAmount} ${balance >= 0 ? styles.positive : styles.negative}`}>
          ${balance.toFixed(2)}
        </div>
      </div>

      <div className={styles.transactionsList}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">Recent Transactions</Typography>
          <Fab
            color="primary"
            size="small"
            onClick={() => handleOpenDialog()}
            className={styles.addButton}
          >
            <AddIcon />
          </Fab>
        </Box>

        <List>
          {transactions.map((transaction) => (
            <ListItem
              key={transaction.id}
              className={styles.transactionItem}
            >
              <div className={styles.transactionIcon}>
                {transaction.type === 'income' ? '+' : '-'}
              </div>
              <div className={styles.transactionDetails}>
                <div className={styles.transactionTitle}>
                  {getCategoryName(transaction.categoryId)}
                </div>
                <div className={styles.transactionCategory}>
                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  {transaction.comment && ` - ${transaction.comment}`}
                </div>
              </div>
              <div className={`${styles.transactionAmount} ${transaction.type === 'income' ? styles.income : styles.expense}`}>
                ${transaction.amount}
              </div>
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleOpenDialog(transaction)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(transaction.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog} className={styles.dialog}>
        <DialogTitle className={styles.dialogTitle}>
          {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <TextField
                select
                fullWidth
                label="Type"
                name="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </TextField>
            </div>
            <div className={styles.formGroup}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                select
                fullWidth
                label="Category"
                name="categoryId"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className={styles.formGroup}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                fullWidth
                label="Comment"
                name="comment"
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
              />
            </div>
            <div className={styles.formActions}>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {editingTransaction ? 'Update' : 'Add'}
              </Button>
            </div>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Dashboard;
