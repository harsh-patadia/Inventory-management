import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon,
} from '@mui/icons-material';
import type { RootState } from '../../store';
import { increaseStock, decreaseStock, toggleProductStatus, deleteProduct, updateProduct, addProduct } from '../../store/slices/productSlice';
import type { Product } from '../../store/slices/productSlice';

const Products: React.FC = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state: RootState) => state.products);
  const { categories } = useSelector((state: RootState) => state.categories);
  const { subCategories } = useSelector((state: RootState) => state.subCategories);

  const [openDialog, setOpenDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [isEditMode, setIsEditMode] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    sku: '',
    price: 0,
    cost: 0,
    stockQuantity: 0,
    minStockLevel: 0,
    maxStockLevel: 0,
    categoryId: '',
    subCategoryId: '',
    tags: [] as string[],
  });

  const handleIncreaseStock = (productId: string) => {
    dispatch(increaseStock({ productId, quantity: stockQuantity }));
    setSnackbar({ open: true, message: 'Stock increased successfully', severity: 'success' });
    handleCloseDialog();
  };

  const handleDecreaseStock = (productId: string) => {
    dispatch(decreaseStock({ productId, quantity: stockQuantity }));
    setSnackbar({ open: true, message: 'Stock decreased successfully', severity: 'success' });
    handleCloseDialog();
  };

  const handleToggleStatus = (productId: string) => {
    dispatch(toggleProductStatus(productId));
    setSnackbar({ open: true, message: 'Product status updated', severity: 'success' });
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setViewDialog(true);
  };

  const handleAddProduct = () => {
    setIsEditMode(false);
    setProductForm({
      name: '',
      description: '',
      sku: '',
      price: 0,
      cost: 0,
      stockQuantity: 0,
      minStockLevel: 0,
      maxStockLevel: 0,
      categoryId: '',
      subCategoryId: '',
      tags: [],
    });
    setProductDialog(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditMode(true);
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      sku: product.sku,
      price: product.price,
      cost: product.cost,
      stockQuantity: product.stockQuantity,
      minStockLevel: product.minStockLevel,
      maxStockLevel: product.maxStockLevel,
      categoryId: product.categoryId,
      subCategoryId: product.subCategoryId,
      tags: product.tags,
    });
    setProductDialog(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      dispatch(deleteProduct(selectedProduct.id));
      setSnackbar({ open: true, message: 'Product deleted successfully', severity: 'success' });
    }
    setDeleteDialog(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = () => {
    if (isEditMode && selectedProduct) {
      // Update existing product
      const updatedProduct: Product = {
        ...selectedProduct,
        ...productForm,
        updatedAt: new Date().toISOString(),
      };
      dispatch(updateProduct(updatedProduct));
      setSnackbar({ open: true, message: 'Product updated successfully', severity: 'success' });
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        ...productForm,
        isActive: true,
        imageUrl: 'https://via.placeholder.com/300x300?text=Product',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(addProduct(newProduct));
      setSnackbar({ open: true, message: 'Product added successfully', severity: 'success' });
    }
    setProductDialog(false);
    setSelectedProduct(null);
  };

  const handleOpenDialog = (product: Product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setViewDialog(false);
    setProductDialog(false);
    setDeleteDialog(false);
    setSelectedProduct(null);
    setStockQuantity(1);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getSubCategoryName = (subCategoryId: string) => {
    const subCategory = subCategories.find(sc => sc.id === subCategoryId);
    return subCategory ? subCategory.name : 'Unknown';
  };

  const isLowStock = (product: Product) => product.stockQuantity < 10;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
          Products Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
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
          Add Product
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
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            mr: 2,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          }}
                        >
                          {product.name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {product.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {product.sku}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getCategoryName(product.categoryId)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {getSubCategoryName(product.subCategoryId)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        ${product.price.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: isLowStock(product) ? '#ef4444' : 'inherit'
                          }}
                        >
                          {product.stockQuantity}
                        </Typography>
                        {isLowStock(product) && (
                          <Chip label="Low Stock" color="error" size="small" />
                        )}
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(product)}
                          sx={{ color: '#667eea' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.isActive ? 'Active' : 'Inactive'}
                        color={product.isActive ? 'success' : 'default'}
                        size="small"
                        onClick={() => handleToggleStatus(product.id)}
                        sx={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewProduct(product)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleEditProduct(product)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Stock Management Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Manage Stock - {selectedProduct?.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <div className="space-y-4">
              <div>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Current Stock: {selectedProduct?.stockQuantity}
                </Typography>
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Number(e.target.value))}
                  inputProps={{ min: 1 }}
                />
              </div>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={() => {
              if (selectedProduct) {
                handleDecreaseStock(selectedProduct.id);
              }
            }}
            color="error"
            startIcon={<RemoveCircleIcon />}
          >
            Decrease Stock
          </Button>
          <Button
            onClick={() => {
              if (selectedProduct) {
                handleIncreaseStock(selectedProduct.id);
              }
            }}
            color="success"
            startIcon={<AddCircleIcon />}
          >
            Increase Stock
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={viewDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Product Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Box sx={{ pt: 2 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedProduct.name}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">SKU</Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontFamily: 'monospace' }}>{selectedProduct.sku}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Price</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>${selectedProduct.price.toFixed(2)}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Cost</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>${selectedProduct.cost.toFixed(2)}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Stock Quantity</Typography>
                  <Typography variant="body1" sx={{ mb: 2, color: isLowStock(selectedProduct) ? '#ef4444' : 'inherit' }}>
                    {selectedProduct.stockQuantity}
                    {isLowStock(selectedProduct) && ' (Low Stock)'}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <Chip
                    label={selectedProduct.isActive ? 'Active' : 'Inactive'}
                    color={selectedProduct.isActive ? 'success' : 'default'}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                </div>
                <div className="md:col-span-2">
                  <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedProduct.description}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Category</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{getCategoryName(selectedProduct.categoryId)}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Subcategory</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{getSubCategoryName(selectedProduct.subCategoryId)}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Min Stock Level</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedProduct.minStockLevel}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Max Stock Level</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedProduct.maxStockLevel}</Typography>
                </div>
                <div className="md:col-span-2">
                  <Typography variant="subtitle2" color="textSecondary">Tags</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    {selectedProduct.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" />
                    ))}
                  </Box>
                </div>
              </div>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Product Dialog */}
      <Dialog open={productDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {isEditMode ? `Edit Product - ${selectedProduct?.name}` : 'Add New Product'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="SKU"
                  value={productForm.sku}
                  onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                  required
                  disabled={isEditMode}
                />
              </div>
              <div className="md:col-span-2">
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Cost"
                  type="number"
                  value={productForm.cost}
                  onChange={(e) => setProductForm({ ...productForm, cost: Number(e.target.value) })}
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  type="number"
                  value={productForm.stockQuantity}
                  onChange={(e) => setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })}
                  required
                  inputProps={{ min: 0 }}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Min Stock Level"
                  type="number"
                  value={productForm.minStockLevel}
                  onChange={(e) => setProductForm({ ...productForm, minStockLevel: Number(e.target.value) })}
                  required
                  inputProps={{ min: 0 }}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Max Stock Level"
                  type="number"
                  value={productForm.maxStockLevel}
                  onChange={(e) => setProductForm({ ...productForm, maxStockLevel: Number(e.target.value) })}
                  required
                  inputProps={{ min: 0 }}
                />
              </div>
              <div>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value, subCategoryId: '' })}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div>
                <FormControl fullWidth required>
                  <InputLabel>Subcategory</InputLabel>
                  <Select
                    value={productForm.subCategoryId}
                    onChange={(e) => setProductForm({ ...productForm, subCategoryId: e.target.value })}
                    label="Subcategory"
                    disabled={!productForm.categoryId}
                  >
                    {subCategories
                      .filter(sc => sc.categoryId === productForm.categoryId)
                      .map((subCategory) => (
                        <MenuItem key={subCategory.id} value={subCategory.id}>
                          {subCategory.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained">
            {isEditMode ? 'Update Product' : 'Add Product'}
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
            Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
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

export default Products;