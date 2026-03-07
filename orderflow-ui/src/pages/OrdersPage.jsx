import { useState, useEffect } from 'react';
import { getMyOrders } from '../api/orderApi';

const statusConfig = {
  Pending:   { label: 'Bekliyor',  color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  Confirmed: { label: 'Onaylandı', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  Shipped:   { label: 'Kargoda',   color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  Cancelled: { label: 'İptal',     color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders().then(res => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-shell flex items-center justify-center text-slate-500">Yükleniyor...</div>;

  return (
    <div className="page-shell">
      <div className="max-w-3xl mx-auto">
        <h1 className="section-title text-2xl font-bold text-slate-900 mb-6">Siparişlerim</h1>

        {orders.length === 0 ? (
          <div className="card-panel text-center py-20 text-slate-500">
            <div className="text-5xl mb-4">📦</div>
            <p>Henüz siparişiniz yok</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const status = statusConfig[order.status] || statusConfig.Pending;
              return (
                <div key={order.id} className="card-panel p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-slate-900 font-medium">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
                      <p className="text-slate-500 text-xs font-mono mt-0.5">{order.id}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full border ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="divide-y divide-slate-700/40">
                    {order.items.map((item, i) => (
                      <div key={i} className="py-2 flex justify-between text-sm">
                        <span className="text-slate-700">{item.productName} × {item.quantity}</span>
                        <span className="text-slate-800">{(item.unitPrice * item.quantity).toLocaleString('tr-TR')} ₺</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-700/40 flex justify-between">
                    <span className="text-slate-600 text-sm">Toplam</span>
                    <span className="text-orange-600 font-bold">{order.totalAmount.toLocaleString('tr-TR')} ₺</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}