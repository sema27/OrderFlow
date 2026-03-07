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
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-panel hero-banner rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200/80">
          <h2 className="text-lg font-semibold text-slate-900">Yeni Sipariş</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 transition-colors text-xl">×</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Email */}
          <div>
            <label className="text-xs text-slate-600 mb-1 block">Müşteri Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="musteri@email.com"
              className="input-modern text-sm"
            />
          </div>

          {/* Ürünler */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-slate-600">Ürünler</label>
              <button onClick={addItem} className="text-xs text-orange-600 hover:text-orange-700">+ Ürün Ekle</button>
            </div>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    placeholder="Ürün adı"
                    value={item.productName}
                    onChange={e => updateItem(i, 'productName', e.target.value)}
                    className="input-modern flex-1 text-sm py-2"
                  />
                  <input
                    placeholder="Fiyat"
                    type="number"
                    value={item.unitPrice}
                    onChange={e => updateItem(i, 'unitPrice', e.target.value)}
                    className="input-modern w-24 text-sm py-2"
                  />
                  <input
                    placeholder="Adet"
                    type="number"
                    value={item.quantity}
                    onChange={e => updateItem(i, 'quantity', e.target.value)}
                    className="input-modern w-16 text-sm py-2"
                  />
                  {items.length > 1 && (
                    <button onClick={() => removeItem(i)} className="text-red-500 hover:text-red-600 px-1">×</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Toplam */}
          {total > 0 && (
            <div className="flex justify-between items-center py-2 border-t border-slate-200/80">
              <span className="text-sm text-slate-600">Toplam</span>
              <span className="text-lg font-bold text-orange-600">{total.toLocaleString('tr-TR')} ₺</span>
            </div>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

        <div className="p-6 border-t border-slate-200/80 flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary py-2.5 text-sm transition-colors">
            İptal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 btn-primary disabled:opacity-50 py-2.5 text-sm font-medium transition-colors"
          >
            {loading ? 'Oluşturuluyor...' : 'Sipariş Oluştur'}
          </button>
        </div>
      </div>
    </div>
  );
}