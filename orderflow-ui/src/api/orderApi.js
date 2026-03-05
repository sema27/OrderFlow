import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5085/api',
});

export const getOrders = () => api.get('/orders');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const createOrder = (data) => api.post('/orders', data);
export const confirmOrder = (id) => api.patch(`/orders/${id}/confirm`);
export const cancelOrder = (id) => api.patch(`/orders/${id}/cancel`);