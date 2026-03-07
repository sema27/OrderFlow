import { useState, useEffect } from 'react';
import { getCart, removeFromCart, checkout, updateCartItem } from '../api/orderApi';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { loadCart(); }, []);

  const loadCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    loadCart();
  };

  const handleQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    await updateCartItem(productId, quantity);
    loadCart();
  };

  const handleCheckout = async () => {
    try {
      setCheckingOut(true);
      await checkout();
      alert('Siparişiniz oluşturuldu!');
      navigate('/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Hata oluştu');
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) return (
    <div className="page-shell flex items-center justify-center text-slate-500">
      Yükleniyor...
    </div>
  );

  return (
    <div className="page-shell px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="section-title text-2xl font-bold text-slate-900 mb-6">Sepetim</h1>

        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <div className="text-5xl mb-4">🛒</div>
            <p>Sepetiniz boş</p>
          </div>
        ) : (
          <>
            <div className="card-panel rounded-xl divide-y divide-slate-200 mb-6">
              {cart.items.map(item => (
                <div key={item.id} className="p-4 flex items-center gap-4">
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/80'}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={e => e.target.src = 'https://via.placeholder.com/80'}
                  />
                  <div className="flex-1">
                    <p className="text-slate-900 font-medium">{item.productName}</p>
                    <p className="text-slate-500 text-sm">{item.unitPrice.toLocaleString('tr-TR')} ₺ / adet</p>
                  </div>

                  {/* Adet kontrolü */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantity(item.productId, item.quantity - 1)}
                      className="w-7 h-7 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-bold transition-colors"
                    >
                      −
                    </button>
                    <span className="text-slate-900 text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantity(item.productId, item.quantity + 1)}
                      className="w-7 h-7 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-orange-600 font-bold">{item.subTotal.toLocaleString('tr-TR')} ₺</p>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-red-600 text-xs hover:text-red-700 mt-1"
                    >
                      Kaldır
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="card-panel rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Toplam</p>
                <p className="text-2xl font-bold text-slate-900">{cart.totalAmount.toLocaleString('tr-TR')} ₺</p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                {checkingOut ? 'İşleniyor...' : 'Siparişi Tamamla'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}