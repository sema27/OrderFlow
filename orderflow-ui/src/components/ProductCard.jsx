import { useState } from 'react';
import { addToCart, toggleFavorite } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, isFavorited, onFavoriteToggle }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const isAdmin = user?.role === 'Admin';
  const rating = ((product.id?.length || 3) % 5 + 3.8).toFixed(1);
  const reviewCount = ((product.id?.charCodeAt?.(0) || 50) % 280) + 20;
  const stockPercent = Math.min(100, Math.max(8, product.stock * 4));
  const hasDeal = product.price >= 1000;

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    try {
      setAdding(true);
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      alert('Sepete eklenemedi');
    } finally {
      setAdding(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) return navigate('/login');
    try {
      await toggleFavorite(product.id);
      onFavoriteToggle(product.id);
    } catch {
      alert('Favori işlemi başarısız');
    }
  };

  return (
    <article className="card-panel product-card rounded-xl overflow-hidden hover:border-orange-200 transition-colors">
      <div className="relative product-media">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-52 object-cover"
          onError={e => e.target.src = 'https://via.placeholder.com/400'}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {hasDeal && <span className="deal-badge">%20 Firsat</span>}
          <span className="deal-soft">Ayni Gun</span>
        </div>
        {!isAdmin && (
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 border border-slate-200 rounded-full flex items-center justify-center hover:bg-orange-50 transition-colors"
          >
            {isFavorited ? '❤️' : '🤍'}
          </button>
        )}
      </div>

      <div className="p-4">
        <span className="text-xs text-orange-600 font-medium">{product.categoryName}</span>
        <h3 className="text-slate-900 font-medium mt-1 mb-1">{product.name}</h3>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <span className="font-semibold text-amber-600">★ {rating}</span>
          <span>({reviewCount} degerlendirme)</span>
        </div>
        <p className="text-slate-500 text-xs mb-3 line-clamp-2 min-h-[2.4rem]">{product.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-orange-600 font-bold text-lg">
            {product.price.toLocaleString('tr-TR')} ₺
          </span>
          <span className="text-slate-600 text-xs">Stok: {product.stock}</span>
        </div>

        <div className="mt-2 mb-3">
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-400 to-cyan-500" style={{ width: `${stockPercent}%` }} />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Kargo tahmini: 24 saat icinde</p>
        </div>

        {!isAdmin && (
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            {added ? '✓ Eklendi' : adding ? 'Ekleniyor...' : 'Sepete Ekle'}
          </button>
        )}
      </div>
    </article>
  );
}