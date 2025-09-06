import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import type { RootState } from '../../store';
import { toggleCategoryStatus, addCategory, updateCategory, deleteCategory } from '../../store/slices/categorySlice';
import { addSubCategory, updateSubCategory, deleteSubCategory, toggleSubCategoryStatus } from '../../store/slices/subCategorySlice';
import type { Category } from '../../store/slices/categorySlice';
import type { SubCategory } from '../../store/slices/subCategorySlice';

const Categories: React.FC = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state: RootState) => state.categories);
  const { subCategories } = useSelector((state: RootState) => state.subCategories);

  const [viewDialog, setViewDialog] = useState(false);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [subCategoryDialog, setSubCategoryDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
  });
  const [subCategoryForm, setSubCategoryForm] = useState({
    name: '',
    description: '',
    categoryId: '',
  });

  const handleToggleStatus = (categoryId: string) => {
    dispatch(toggleCategoryStatus(categoryId));
    setSnackbar({ open: true, message: 'Category status updated', severity: 'success' });
  };

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setViewDialog(true);
  };

  const handleAddCategory = () => {
    setIsEditMode(false);
    setCategoryForm({
      name: '',
      description: '',
    });
    setCategoryDialog(true);
  };

  const handleEditCategory = (category: Category) => {
    setIsEditMode(true);
    setSelectedCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
    });
    setCategoryDialog(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCategory) {
      dispatch(deleteCategory(selectedCategory.id));
      setSnackbar({ open: true, message: 'Category deleted successfully', severity: 'success' });
    } else if (selectedSubCategory) {
      dispatch(deleteSubCategory(selectedSubCategory.id));
      setSnackbar({ open: true, message: 'Subcategory deleted successfully', severity: 'success' });
    }
    setDeleteDialog(false);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
  };

  const handleSaveCategory = () => {
    if (isEditMode && selectedCategory) {
      // Update existing category
      const updatedCategory: Category = {
        ...selectedCategory,
        ...categoryForm,
        updatedAt: new Date().toISOString(),
      };
      dispatch(updateCategory(updatedCategory));
      setSnackbar({ open: true, message: 'Category updated successfully', severity: 'success' });
    } else {
      // Add new category
      const newCategory: Category = {
        id: Date.now().toString(),
        ...categoryForm,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(addCategory(newCategory));
      setSnackbar({ open: true, message: 'Category added successfully', severity: 'success' });
    }
    setCategoryDialog(false);
    setSelectedCategory(null);
  };

  const handleAddSubCategory = (category: Category) => {
    setSelectedCategory(category);
    setSubCategoryForm({
      name: '',
      description: '',
      categoryId: category.id,
    });
    setSubCategoryDialog(true);
  };

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setSubCategoryForm({
      name: subCategory.name,
      description: subCategory.description,
      categoryId: subCategory.categoryId,
    });
    setSubCategoryDialog(true);
  };

  const handleDeleteSubCategory = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setDeleteDialog(true);
  };

  const handleSaveSubCategory = () => {
    if (selectedSubCategory) {
      // Update existing subcategory
      const updatedSubCategory: SubCategory = {
        ...selectedSubCategory,
        ...subCategoryForm,
        updatedAt: new Date().toISOString(),
      };
      dispatch(updateSubCategory(updatedSubCategory));
      setSnackbar({ open: true, message: 'Subcategory updated successfully', severity: 'success' });
    } else {
      // Add new subcategory
      const newSubCategory: SubCategory = {
        id: Date.now().toString(),
        ...subCategoryForm,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(addSubCategory(newSubCategory));
      setSnackbar({ open: true, message: 'Subcategory added successfully', severity: 'success' });
    }
    setSubCategoryDialog(false);
    setSelectedSubCategory(null);
  };

  const handleCloseDialog = () => {
    setViewDialog(false);
    setCategoryDialog(false);
    setSubCategoryDialog(false);
    setDeleteDialog(false);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
  };

  const getSubCategoriesForCategory = (categoryId: string) => {
    return subCategories.filter(sc => sc.categoryId === categoryId);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
          Categories Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCategory}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            },
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
          }}
        >
          Add Category
        </Button>
      </Box>

      <Card
        sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: 3,
          border: '1px solid #e2e8f0',
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Categories" />
            <Tab label="Subcategories" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          mr: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                      >
                        <CategoryIcon />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {category.name}
                        </Typography>
                        <Chip
                          label={category.isActive ? 'Active' : 'Inactive'}
                          color={category.isActive ? 'success' : 'default'}
                          size="small"
                          onClick={() => handleToggleStatus(category.id)}
                          sx={{ cursor: 'pointer' }}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {category.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="textSecondary">
                        Created: {new Date(category.createdAt).toLocaleDateString()}
                      </Typography>
                      <Box>
                        <IconButton size="small" color="primary" onClick={() => handleViewCategory(category)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton size="small" color="primary" onClick={() => handleEditCategory(category)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteCategory(category)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <div className="space-y-4">
              {categories.map((category) => (
                <Card key={category.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {category.name} Subcategories
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddSubCategory(category)}
                        sx={{ textTransform: 'none' }}
                      >
                        Add Subcategory
                      </Button>
                    </Box>
                    <List>
                      {getSubCategoriesForCategory(category.id).map((subCategory) => (
                        <ListItem key={subCategory.id} sx={{ px: 0 }}>
                          <ListItemText
                            primary={subCategory.name}
                            secondary={subCategory.description}
                          />
                          <ListItemSecondaryAction>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip
                                label={subCategory.isActive ? 'Active' : 'Inactive'}
                                color={subCategory.isActive ? 'success' : 'default'}
                                size="small"
                                onClick={() => dispatch(toggleSubCategoryStatus(subCategory.id))}
                                sx={{ cursor: 'pointer', mr: 1 }}
                              />
                              <IconButton size="small" onClick={() => handleEditSubCategory(subCategory)}>
                                <EditIcon />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDeleteSubCategory(subCategory)}>
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                      {getSubCategoriesForCategory(category.id).length === 0 && (
                        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                          No subcategories found
                        </Typography>
                      )}
                    </List>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Box>
        )}
      </Card>

      {/* View Category Dialog */}
      <Dialog open={viewDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Category Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedCategory && (
            <Box sx={{ pt: 2 }}>
              <div className="space-y-4">
                <div>
                  <TextField
                    fullWidth
                    label="Name"
                    value={selectedCategory.name}
                    disabled
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    label="Description"
                    value={selectedCategory.description}
                    disabled
                    multiline
                    rows={3}
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    label="Status"
                    value={selectedCategory.isActive ? 'Active' : 'Inactive'}
                    disabled
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    label="Created At"
                    value={new Date(selectedCategory.createdAt).toLocaleString()}
                    disabled
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    label="Updated At"
                    value={new Date(selectedCategory.updatedAt).toLocaleString()}
                    disabled
                  />
                </div>
              </div>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Category Dialog */}
      <Dialog open={categoryDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {isEditMode ? `Edit Category - ${selectedCategory?.name}` : 'Add New Category'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <div className="space-y-4">
              <div>
                <TextField
                  fullWidth
                  label="Category Name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  required
                />
              </div>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveCategory} variant="contained">
            {isEditMode ? 'Update Category' : 'Add Category'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit SubCategory Dialog */}
      <Dialog open={subCategoryDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {selectedSubCategory ? `Edit Subcategory - ${selectedSubCategory.name}` : `Add Subcategory to ${selectedCategory?.name}`}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <div className="space-y-4">
              <div>
                <TextField
                  fullWidth
                  label="Subcategory Name"
                  value={subCategoryForm.name}
                  onChange={(e) => setSubCategoryForm({ ...subCategoryForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={subCategoryForm.description}
                  onChange={(e) => setSubCategoryForm({ ...subCategoryForm, description: e.target.value })}
                  required
                />
              </div>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveSubCategory} variant="contained">
            {selectedSubCategory ? 'Update Subcategory' : 'Add Subcategory'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Confirm Delete
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedCategory?.name || selectedSubCategory?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Categories;
