const statusConfig = {
  Pending: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  Confirmed: 'text-green-400 border-green-500/30 bg-green-500/10',
  Shipped: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  Cancelled: 'text-red-400 border-red-500/30 bg-red-500/10',
};

const statusLabel = {
  Pending: 'Bekliyor',
  Confirmed: 'Onaylandı',
  Shipped: 'Kargoda',
  Cancelled: 'İptal',
};

export default function OrderCard({ order, isSelected, onClick }) {
  const statusClass = statusConfig[order.status] || statusConfig.Pending;
  const label = statusLabel[order.status] || statusLabel.Pending;
  const total = Number(order.totalAmount) || 0;
  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleString('tr-TR')
    : '-';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 transition-colors ${
        isSelected ? 'bg-gray-800/80' : 'hover:bg-gray-900/70'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-white truncate">{order.customerEmail || 'Email yok'}</p>
          <p className="text-xs text-gray-500 mt-1">{date}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${statusClass}`}>
          {label}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-gray-500 font-mono truncate">{order.id || '-'}</p>
        <p className="text-sm font-semibold text-violet-400">{total.toLocaleString('tr-TR')} ₺</p>
      </div>
    </button>
  );
}