import OrderCard from './OrderCard';

export default function OrderList({ orders, selectedId, onSelect }) {
  const safeOrders = Array.isArray(orders) ? orders : [];

  if (safeOrders.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
        Henüz sipariş yok
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-200">
      {safeOrders.map(order => (
        <OrderCard
          key={order.id}
          order={order}
          isSelected={order.id === selectedId}
          onClick={() => onSelect(order)}
        />
      ))}
    </div>
  );
}