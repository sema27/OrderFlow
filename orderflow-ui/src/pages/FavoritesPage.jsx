import { useState, useEffect } from 'react';
import { getFavorites, toggleFavorite, addToCart } from '../api/orderApi';
import { getProductImageSrc, onProductImageError } from '../utils/productImage';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadFavorites(); }, []);

  const loadFavorites = async () => {
    try {
      const res = await getFavorites();
      setFavorites(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    await toggleFavorite(productId);
    setFavorites(prev => prev.filter(f => f.id !== productId));
  };

  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1);
    alert('Sepete eklendi!');
  };

  if (loading) return <div className="page-shell flex items-center justify-center text-slate-500">Yükleniyor...</div>;

  return (
    <div className="page-shell">
      <div className="max-w-5xl mx-auto">
        <h1 className="section-title text-2xl font-bold text-slate-900 mb-6">Favorilerim</h1>

        {favorites.length === 0 ? (
          <div className="card-panel text-center py-20 text-slate-500">
            <div className="text-5xl mb-4">♡</div>
            <p>Favori ürününüz yok</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map(product => (
              <div key={product.id} className="card-panel overflow-hidden hover:-translate-y-1 transition-transform duration-200">
                <img
                  src={getProductImageSrc(product, product.name, 'card')}
                  alt={product.name}
                  data-size="card"
                  onError={onProductImageError}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <p className="text-xs text-orange-600 mb-1">{product.categoryName}</p>
                  <p className="text-slate-900 font-medium mb-1">{product.name}</p>
                  <p className="text-orange-600 font-bold mb-3">{product.price.toLocaleString('tr-TR')} ₺</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="flex-1 btn-primary py-2 text-sm"
                    >
                      Sepete Ekle
                    </button>
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="px-3 py-2 btn-secondary text-red-500 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}