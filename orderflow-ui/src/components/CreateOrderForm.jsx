import { useState } from 'react';
import { createOrder } from '../api/orderApi';

export default function CreateOrderForm({ onClose, onCreated }) {
  const [email, setEmail] = useState('');
  const [items, setItems] = useState([{ productName: '', unitPrice: '', quantity: 1 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addItem = () => setItems([...items, { productName: '', unitPrice: '', quantity: 1 }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i][field] = value;
    setItems(updated);
  };

  const total = items.reduce((sum, item) => {
    return sum + (parseFloat(item.unitPrice) || 0) * (parseInt(item.quantity) || 0);
  }, 0);

  const handleSubmit = async () => {
    setError('');
    if (!email) return setError('Email gerekli.');
    if (items.some(i => !i.productName || !i.unitPrice)) return setError('Tüm ürün bilgilerini doldurun.');

    try {
      setLoading(true);
      await createOrder({
        customerEmail: email,
        items: items.map(i => ({
          productName: i.productName,
          unitPrice: parseFloat(i.unitPrice),
          quantity: parseInt(i.quantity),
        })),
      });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Sipariş oluşturulamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Yeni Sipariş</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl">×</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Email */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Müşteri Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="musteri@email.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Ürünler */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400">Ürünler</label>
              <button onClick={addItem} className="text-xs text-violet-400 hover:text-violet-300">+ Ürün Ekle</button>
            </div>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    placeholder="Ürün adı"
                    value={item.productName}
                    onChange={e => updateItem(i, 'productName', e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                  />
                  <input
                    placeholder="Fiyat"
                    type="number"
                    value={item.unitPrice}
                    onChange={e => updateItem(i, 'unitPrice', e.target.value)}
                    className="w-24 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                  />
                  <input
                    placeholder="Adet"
                    type="number"
                    value={item.quantity}
                    onChange={e => updateItem(i, 'quantity', e.target.value)}
                    className="w-16 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                  />
                  {items.length > 1 && (
                    <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-300 px-1">×</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Toplam */}
          {total > 0 && (
            <div className="flex justify-between items-center py-2 border-t border-gray-800">
              <span className="text-sm text-gray-400">Toplam</span>
              <span className="text-lg font-bold text-violet-400">{total.toLocaleString('tr-TR')} ₺</span>
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        <div className="p-6 border-t border-gray-800 flex gap-3">
          <button onClick={onClose} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg text-sm transition-colors">
            İptal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? 'Oluşturuluyor...' : 'Sipariş Oluştur'}
          </button>
        </div>
      </div>
    </div>
  );
}