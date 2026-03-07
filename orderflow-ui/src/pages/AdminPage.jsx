import { useState, useEffect } from 'react';
import { getCategories, getAllOrders, confirmOrder, cancelOrder, shipOrder } from '../api/orderApi';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5085/api' });
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const statusConfig = {
  Pending:   { label: 'Bekliyor',  color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
  Confirmed: { label: 'Onaylandı', color: 'text-green-700',  bg: 'bg-green-50 border-green-200' },
  Shipped:   { label: 'Kargoda',   color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200' },
  Cancelled: { label: 'İptal',     color: 'text-red-700',    bg: 'bg-red-50 border-red-200' },
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: ''
  });
  const [categoryForm, setCategoryForm] = useState({ name: '' });

  useEffect(() => {
    loadCategories();
    loadOrders();
    loadUsers();
  }, []);

  const loadCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await getAllOrders();
      setOrders(res.data);
    } catch {
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch {
    } finally {
      setUsersLoading(false);
    }
  };

  const updateProduct = (field, value) =>
    setProductForm(prev => ({ ...prev, [field]: value }));

  const handleAddProduct = async () => {
    setError(''); setSuccess('');
    try {
      setLoading(true);
      await api.post('/products', {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        categoryId: productForm.categoryId,
        imageUrl: productForm.imageUrl || null
      });
      setSuccess('Ürün başarıyla eklendi!');
      setProductForm({ name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    setError(''); setSuccess('');
    try {
      setLoading(true);
      await api.post('/categories', { name: categoryForm.name });
      setSuccess('Kategori başarıyla eklendi!');
      setCategoryForm({ name: '' });
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (action, orderId) => {
    try {
      if (action === 'confirm') await confirmOrder(orderId);
      else if (action === 'cancel') await cancelOrder(orderId);
      else if (action === 'ship') await shipOrder(orderId);
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'İşlem başarısız.');
    }
  };

  const tabs = [
    { key: 'orders',   label: '📦 Siparişler' },
    { key: 'users',    label: '👥 Kullanıcılar' },
    { key: 'product',  label: '➕ Ürün Ekle' },
    { key: 'category', label: '🏷️ Kategori Ekle' },
  ];

  return (
    <div className="page-shell px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="section-title text-2xl font-bold text-slate-900 mb-6">Admin Paneli</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSuccess(''); setError(''); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/85 border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Siparişler */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            {ordersLoading ? (
              <p className="text-slate-500 text-center py-12">Yükleniyor...</p>
            ) : orders.length === 0 ? (
              <p className="text-slate-500 text-center py-12">Sipariş yok</p>
            ) : (
              orders.map(order => {
                const status = statusConfig[order.status] || statusConfig.Pending;
                return (
                  <div key={order.id} className="card-panel rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-slate-900 font-medium text-sm">{order.customerEmail}</p>
                        <p className="text-slate-500 text-xs mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                            day: 'numeric', month: 'long', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                        <p className="text-slate-400 text-xs font-mono mt-0.5">{order.id}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3 mb-3 space-y-1 border border-slate-200">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="text-slate-600">{item.productName} × {item.quantity}</span>
                          <span className="text-slate-700">{(item.unitPrice * item.quantity).toLocaleString('tr-TR')} ₺</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-bold pt-1 border-t border-slate-200 mt-1">
                        <span className="text-slate-700">Toplam</span>
                        <span className="text-orange-600">{order.totalAmount.toLocaleString('tr-TR')} ₺</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {order.status === 'Pending' && (
                        <button
                          onClick={() => handleOrderAction('confirm', order.id)}
                          className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          ✓ Onayla
                        </button>
                      )}
                      {order.status === 'Confirmed' && (
                        <button
                          onClick={() => handleOrderAction('ship', order.id)}
                          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          🚚 Kargoya Ver
                        </button>
                      )}
                      {(order.status === 'Pending' || order.status === 'Confirmed') && (
                        <button
                          onClick={() => handleOrderAction('cancel', order.id)}
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          ✕ İptal Et
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Kullanıcılar */}
        {activeTab === 'users' && (
          <div className="space-y-3">
            {usersLoading ? (
              <p className="text-slate-500 text-center py-12">Yükleniyor...</p>
            ) : users.length === 0 ? (
              <p className="text-slate-500 text-center py-12">Kullanıcı yok</p>
            ) : (
              users.map(user => (
                <div key={user.id} className="card-panel rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-slate-900 font-medium text-sm">{user.firstName} {user.lastName}</p>
                    <p className="text-slate-600 text-xs mt-0.5">{user.email}</p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${
                    user.role === 'Admin'
                      ? 'bg-orange-100 text-orange-700 border-orange-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {user.role === 'Admin' ? 'Admin' : 'Kullanıcı'}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Ürün Ekle */}
        {activeTab === 'product' && (
          <div className="card-panel rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-xs text-slate-600 mb-1 block">Ürün Adı</label>
              <input
                value={productForm.name}
                onChange={e => updateProduct('name', e.target.value)}
                placeholder="MacBook Pro M3"
                className="input-modern text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 mb-1 block">Açıklama</label>
              <textarea
                value={productForm.description}
                onChange={e => updateProduct('description', e.target.value)}
                placeholder="Ürün açıklaması..."
                rows={3}
                className="input-modern text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 mb-1 block">Fiyat (₺)</label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={e => updateProduct('price', e.target.value)}
                  placeholder="0"
                  className="input-modern text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 mb-1 block">Stok</label>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={e => updateProduct('stock', e.target.value)}
                  placeholder="0"
                  className="input-modern text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-600 mb-1 block">Kategori</label>
              <select
                value={productForm.categoryId}
                onChange={e => updateProduct('categoryId', e.target.value)}
                className="input-modern text-sm"
              >
                <option value="">Kategori seç</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-600 mb-1 block">Görsel URL</label>
              <input
                value={productForm.imageUrl}
                onChange={e => updateProduct('imageUrl', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="input-modern text-sm"
              />
              {productForm.imageUrl && (
                <img
                  src={productForm.imageUrl}
                  alt="preview"
                  className="mt-2 h-32 w-full object-cover rounded-lg"
                  onError={e => e.target.style.display = 'none'}
                />
              )}
            </div>

            {success && <p className="text-green-700 text-sm">{success}</p>}
            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              onClick={handleAddProduct}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? 'Ekleniyor...' : 'Ürün Ekle'}
            </button>
          </div>
        )}

        {/* Kategori Ekle */}
        {activeTab === 'category' && (
          <div className="card-panel rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-xs text-slate-600 mb-1 block">Kategori Adı</label>
              <input
                value={categoryForm.name}
                onChange={e => setCategoryForm({ name: e.target.value })}
                placeholder="Elektronik"
                className="input-modern text-sm"
              />
            </div>

            {categories.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-2">Mevcut kategoriler:</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <span key={cat.id} className="bg-slate-100 text-slate-700 border border-slate-200 text-xs px-3 py-1 rounded-full">
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {success && <p className="text-green-700 text-sm">{success}</p>}
            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              onClick={handleAddCategory}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? 'Ekleniyor...' : 'Kategori Ekle'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}