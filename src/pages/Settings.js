import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ChromePicker } from 'react-color';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../features/categories/CategoriesSlice';
import styles from '../styles/components/Settings.module.css';

function Settings() {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: '#000000',
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        color: category.color,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        color: '#000000',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      color: '#000000',
    });
  };

  const handleSubmit = () => {
    if (editingCategory) {
      dispatch(updateCategory({ id: editingCategory.id, ...formData }));
    } else {
      dispatch(addCategory(formData));
    }
    handleCloseDialog();
  };

  const handleDelete = (category) => {
    setEditingCategory(category);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    if (editingCategory) {
      dispatch(deleteCategory(editingCategory.id));
      setConfirmDialogOpen(false);
      setEditingCategory(null);
    }
  };

  return (
    <div className={styles.settings}>
      <div className={styles.settingsHeader}>
        <Typography className={styles.settingsTitle}>Categories</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Category
        </Button>
      </div>

      <div className={styles.categoryList}>
        {categories.map((category) => (
          <div key={category.id} className={styles.categoryItem}>
            <div className={styles.categoryColor} style={{ backgroundColor: category.color }} />
            <div className={styles.categoryName}>{category.name}</div>
            <div className={styles.categoryActions}>
              <IconButton
                className={styles.actionButton}
                onClick={() => handleOpenDialog(category)}
                size="small"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                className={styles.actionButton}
                onClick={() => handleDelete(category)}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} className={styles.dialog}>
        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>Name</div>
            <TextField
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Category name"
            />
          </div>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>Color</div>
            <div className={styles.colorPicker}>
              <div
                className={styles.colorPickerButton}
                style={{ backgroundColor: formData.color }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              />
              {showColorPicker && (
                <div className={styles.colorPickerPopover}>
                  <div
                    className={styles.colorPickerCover}
                    onClick={() => setShowColorPicker(false)}
                  />
                  <ChromePicker
                    color={formData.color}
                    onChange={(color) => setFormData({ ...formData, color: color.hex })}
                  />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions className={styles.formActions}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingCategory ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        className={styles.dialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <div className={styles.confirmMessage}>
            Are you sure you want to delete this category? This action cannot be undone.
          </div>
        </DialogContent>
        <DialogActions className={styles.confirmActions}>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Settings;
