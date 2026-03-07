import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5085/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getCategories = () => api.get('/categories');

// Cart
export const getCart = () => api.get('/cart');
export const addToCart = (productId, quantity) => api.post('/cart/add', { productId, quantity });
export const removeFromCart = (productId) => api.delete(`/cart/remove/${productId}`);
export const updateCartItem = (productId, quantity) => api.patch('/cart/update', { productId, quantity });

// Favorites
export const getFavorites = () => api.get('/favorites');
export const toggleFavorite = (productId) => api.post(`/favorites/toggle/${productId}`);

// Orders
export const getMyOrders = () => api.get('/orders/my');
export const checkout = () => api.post('/orders/checkout');

// Admin
export const getAllOrders = () => api.get('/orders/all');
export const confirmOrder = (id) => api.patch(`/orders/${id}/confirm`);
export const cancelOrder = (id) => api.patch(`/orders/${id}/cancel`);
export const shipOrder = (id) => api.patch(`/orders/${id}/ship`);
export const getAdminUsers = () => api.get('/admin/users');
export const getAdminOrders = () => api.get('/orders/all');

//User
export const updateProfile = (data) => api.put('/users/profile', data);
