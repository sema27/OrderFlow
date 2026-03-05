import { useState, useEffect } from 'react';
import { getOrders } from './api/orderApi';
import OrderList from './components/OrderList';
import OrderDetail from './components/OrderDetail';
import CreateOrderForm from './components/CreateOrderForm';

export default function App() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error('Siparişler yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">OrderFlow</h1>
          <p className="text-gray-400 text-sm">Sipariş Yönetim Paneli</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Yeni Sipariş
        </button>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sol: Sipariş Listesi */}
        <div className="w-1/3 border-r border-gray-800 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              Yükleniyor...
            </div>
          ) : (
            <OrderList
              orders={orders}
              selectedId={selectedOrder?.id}
              onSelect={setSelectedOrder}
            />
          )}
        </div>

        {/* Sağ: Sipariş Detayı */}
        <div className="flex-1 overflow-y-auto">
          {selectedOrder ? (
            <OrderDetail
              order={selectedOrder}
              onRefresh={async () => {
  const res = await getOrders();
  setOrders(res.data);
  const updated = res.data.find(o => o.id === selectedOrder.id);
  setSelectedOrder(updated);
}}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-600">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-lg">Detay görmek için bir sipariş seç</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Yeni Sipariş */}
      {showForm && (
        <CreateOrderForm
          onClose={() => setShowForm(false)}
          onCreated={() => { fetchOrders(); setShowForm(false); }}
        />
      )}
    </div>
  );
}