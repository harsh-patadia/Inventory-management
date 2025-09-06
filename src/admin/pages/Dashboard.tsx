import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import type { RootState } from '../../store';
import { setProducts } from '../../store/slices/productSlice';
import { setCategories } from '../../store/slices/categorySlice';
import { setUsers, setRoles } from '../../store/slices/userSlice';
import { sampleProducts, sampleCategories, sampleUsers, sampleRoles } from '../../store/staticData';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state: RootState) => state.products);
  const { categories } = useSelector((state: RootState) => state.categories);
  const { users } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Initialize with sample data only if not already loaded
    if (products.length === 0) {
      dispatch(setProducts(sampleProducts));
    }
    if (categories.length === 0) {
      dispatch(setCategories(sampleCategories));
    }
    if (users.length === 0) {
      dispatch(setUsers(sampleUsers));
    }
    // Initialize roles if not already loaded
    dispatch(setRoles(sampleRoles));
  }, [dispatch, products.length, categories.length, users.length]);

  // Update low stock products when products change
  useEffect(() => {
    // This effect will run whenever products array changes
    // Low stock products will be recalculated automatically
    console.log('Products updated, recalculating low stock products:', products.length);
  }, [products]);

  const lowStockProducts = products.filter(product => product.stockQuantity < 10);
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stockQuantity), 0);
  const activeProducts = products.filter(product => product.isActive).length;

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: <InventoryIcon sx={{ fontSize: 40, color: '#667eea' }} />,
      color: '#667eea',
    },
    {
      title: 'Categories',
      value: categories.length,
      icon: <CategoryIcon sx={{ fontSize: 40, color: '#10b981' }} />,
      color: '#10b981',
    },
    {
      title: 'Users',
      value: users.length,
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#f59e0b' }} />,
      color: '#f59e0b',
    },
    {
      title: 'Total Value',
      value: `$${totalValue.toLocaleString()}`,
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#8b5cf6' }} />,
      color: '#8b5cf6',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 'bold', color: '#1e293b' }}>
        Dashboard Overview
      </Typography>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderRadius: 3,
              border: '1px solid #e2e8f0',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: stat.color }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: `${stat.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderRadius: 3,
              border: '1px solid #e2e8f0',
            }}
          >
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Recent Products
              </Typography>
              <List>
                {products.slice(0, 5).map((product) => (
                  <ListItem key={product.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                      >
                        {product.name[0]}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={product.name}
                      secondary={`SKU: ${product.sku} | Stock: ${product.stockQuantity}`}
                    />
                    <Chip
                      label={product.isActive ? 'Active' : 'Inactive'}
                      color={product.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card
            sx={{
              height: '100%',
              background: lowStockProducts.length > 0 
                ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: lowStockProducts.length > 0
                ? '0 4px 6px -1px rgba(239, 68, 68, 0.1), 0 2px 4px -1px rgba(239, 68, 68, 0.06)'
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderRadius: 3,
              border: lowStockProducts.length > 0 ? '1px solid #fecaca' : '1px solid #e2e8f0',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarningIcon 
                  sx={{ 
                    fontSize: 24, 
                    color: lowStockProducts.length > 0 ? '#ef4444' : '#10b981',
                    mr: 1 
                  }} 
                />
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                  Low Stock Alert
                </Typography>
                {lowStockProducts.length > 0 && (
                  <Chip 
                    label={lowStockProducts.length} 
                    color="error" 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
              {lowStockProducts.length > 0 ? (
                <List>
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <ListItem key={product.id} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <WarningIcon color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {product.name}
                            </Typography>
                            <Chip 
                              label={`${product.stockQuantity} left`} 
                              color="error" 
                              size="small" 
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              SKU: {product.sku}
                            </Typography>
                            <Typography variant="caption" color="error">
                              Min Level: {product.minStockLevel} | Max Level: {product.maxStockLevel}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                  {lowStockProducts.length > 5 && (
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                        +{lowStockProducts.length - 5} more products with low stock
                      </Typography>
                    </ListItem>
                  )}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <CheckCircleIcon sx={{ fontSize: 48, color: '#10b981', mb: 1 }} />
                  <Typography color="textSecondary" sx={{ fontWeight: 'bold' }}>
                    All products are well stocked
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    No immediate restocking needed
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Card
          sx={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderRadius: 3,
            border: '1px solid #e2e8f0',
          }}
        >
          <CardContent>
            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
              Stock Status Overview
            </Typography>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#10b981' }}>
                  {activeProducts}
                </Typography>
                <Typography color="textSecondary">Active Products</Typography>
              </div>
              <div className="text-center">
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ef4444' }}>
                  {products.length - activeProducts}
                </Typography>
                <Typography color="textSecondary">Inactive Products</Typography>
              </div>
              <div className="text-center">
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f59e0b' }}>
                  {lowStockProducts.length}
                </Typography>
                <Typography color="textSecondary">Low Stock Items</Typography>
              </div>
              <div className="text-center">
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#8b5cf6' }}>
                  {categories.length}
                </Typography>
                <Typography color="textSecondary">Categories</Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Box>
  );
};

export default Dashboard;