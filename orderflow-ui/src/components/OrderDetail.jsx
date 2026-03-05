import { confirmOrder, cancelOrder } from '../api/orderApi';

const statusConfig = {
  Pending:   { label: 'Bekliyor',  color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  Confirmed: { label: 'Onaylandı', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  Shipped:   { label: 'Kargoda',   color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  Cancelled: { label: 'İptal',     color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

export default function OrderDetail({ order, onRefresh }) {
  const status = statusConfig[order.status] || statusConfig.Pending;
  const date = new Date(order.createdAt).toLocaleString('tr-TR');

  const handleConfirm = async () => {
    try {
      await confirmOrder(order.id);
      await onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Hata oluştu');
    }
  };

  const handleCancel = async () => {
    try {
      await cancelOrder(order.id);
      await onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Hata oluştu');
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      {/* Başlık */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">{order.customerEmail}</h2>
          <p className="text-gray-500 text-sm mt-1">{date}</p>
          <p className="text-gray-600 text-xs mt-1 font-mono">{order.id}</p>
        </div>
        <span className={`text-sm px-3 py-1.5 rounded-full border ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Ürünler */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 mb-6">
        <div className="px-4 py-3 border-b border-gray-800">
          <h3 className="text-sm font-medium text-gray-400">Ürünler</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {order.items.map((item, i) => (
            <div key={i} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-white">{item.productName}</p>
                <p className="text-xs text-gray-500">{item.quantity} adet × {item.unitPrice.toLocaleString('tr-TR')} ₺</p>
              </div>
              <p className="text-sm font-medium text-violet-400">
                {(item.quantity * item.unitPrice).toLocaleString('tr-TR')} ₺
              </p>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-gray-800 flex justify-between">
          <span className="text-sm font-medium text-gray-400">Toplam</span>
          <span className="text-lg font-bold text-white">{order.totalAmount.toLocaleString('tr-TR')} ₺</span>
        </div>
      </div>

      {/* Butonlar */}
      {order.status === 'Pending' && (
        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            ✓ Onayla
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            ✕ İptal Et
          </button>
        </div>
      )}

      {order.status === 'Confirmed' && (
        <button
          onClick={handleCancel}
          className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          ✕ İptal Et
        </button>
      )}
    </div>
  );
}