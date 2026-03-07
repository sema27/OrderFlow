import { useState, useEffect } from 'react';
import { getProducts, getCategories, getFavorites } from '../api/orderApi';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const campaignCards = [
  {
    title: 'Akilli Cihazlarda Bahar Kampanyasi',
    subtitle: 'Secili urunlerde bugune ozel fiyatlar',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Ev Yasam Koleksiyonu',
    subtitle: 'Yeni sezon urunleri simdi vitrinde',
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80',
  },
];

const trustPoints = ['Ayni gun kargo', 'Guvenli odeme', 'Iade garantisi'];
const heroHighlights = [
  {
    title: 'Bugune Ozel Indirim',
    detail: 'Secili urunlerde sepette ekstra %10',
  },
  {
    title: 'Hizli Teslimat',
    detail: '17:00 oncesi siparislerde ayni gun cikis',
  },
  {
    title: 'Guvenli Alisveris',
    detail: '256-bit sifreleme ile guvenli odeme',
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
    if (user) loadFavorites();
  }, [user]);

  useEffect(() => {
    loadProducts();
  }, [search, categoryId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (categoryId) params.categoryId = categoryId;
      const res = await getProducts(params);
      setProducts(res.data.items || []);
    } catch {
      console.error('Ürünler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const loadFavorites = async () => {
    try {
      const res = await getFavorites();
      setFavorites(res.data.map(f => f.id));
    } catch {}
  };

  const handleFavoriteToggle = (productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="page-shell">
      <div className="max-w-7xl mx-auto fade-in-up">
        <section className="hero-banner card-panel promo-hero p-5 sm:p-7 lg:p-8 mb-6">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-4 lg:gap-5 items-stretch">
            <div className="campaign-main">
              <p className="text-xs tracking-[0.18em] uppercase text-orange-700 font-semibold mb-3">YENI SEZON FIRSATLARI</p>
              <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-3">
                Gercek Fiyat,
                <br />
                Hızlı Teslimat,
                <br />
                Guvenli Alisveris
              </h2>
              <p className="text-slate-600 max-w-xl mb-6">
                Gunluk kampanyalar, trend urunler ve stoktan hizli teslimat avantajiyla vitrinimizi kesfet.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Urun, marka veya kategori ara..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="input-modern max-w-md"
                />
                <button
                  type="button"
                  className="btn-primary px-5 py-3 text-sm"
                  onClick={() => setCategoryId('')}
                >
                  Tum Firsatlari Gor
                </button>
              </div>

              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl">
                {heroHighlights.map(item => (
                  <div key={item.title} className="rounded-xl border border-slate-200 bg-white/80 px-3.5 py-3 backdrop-blur-sm">
                    <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {campaignCards.map(card => (
                <article key={card.title} className="promo-tile">
                  <img src={card.image} alt={card.title} loading="lazy" />
                  <div className="promo-tile-content">
                    <p className="text-[11px] uppercase tracking-wider text-orange-100 mb-1">Haftanin Onerisi</p>
                    <h3 className="text-white text-base font-semibold leading-tight">{card.title}</h3>
                    <p className="text-orange-50/90 text-xs mt-1">{card.subtitle}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {trustPoints.map(point => (
              <div key={point} className="trust-pill">
                <span className="trust-pill-dot" aria-hidden="true" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="section-title text-2xl sm:text-3xl font-bold text-slate-900">Vitrindeki Urunler</h3>
            <p className="text-slate-600 text-sm mt-1">
              {loading ? 'Urunler yukleniyor...' : `${products.length} urun listeleniyor`}
            </p>
          </div>
          <div className="card-panel px-4 py-2 text-sm text-slate-600">
            <span className="font-semibold text-slate-800">Canli Stok</span>
            <span className="mx-2 text-slate-400">|</span>
            <span>Gercek zamanli fiyat guncellemesi</span>
          </div>
        </section>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 fade-in-up">
        <div className="w-full lg:w-64 lg:flex-shrink-0 card-panel p-4 h-fit">
          <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Kategoriler</h3>
          <div className="space-y-1.5">
            <button
              onClick={() => setCategoryId('')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !categoryId ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              Tum Urunler
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryId(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  categoryId === cat.id ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="card-panel text-slate-500 text-center py-20">Yükleniyor...</div>
          ) : products.length === 0 ? (
            <div className="card-panel text-slate-500 text-center py-20">Ürün bulunamadı</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {products.map((product, index) => (
                <div key={product.id} className="card-stagger" style={{ animationDelay: `${index * 55}ms` }}>
                  <ProductCard
                    product={product}
                    isFavorited={favorites.includes(product.id)}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}