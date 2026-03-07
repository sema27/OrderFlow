import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <header className="sticky top-0 z-40">
      <div className="promo-strip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 text-[11px] sm:text-xs flex items-center justify-between gap-3 text-white">
          <span>500 ₺ ve uzeri alisverislerde ucretsiz kargo</span>
          <span className="hidden sm:inline">Canli Destek: 7/24</span>
        </div>
      </div>
      <nav className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-bold text-slate-900 tracking-tight">
          Order<span className="text-orange-500">Flow</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          {!isAdmin && (
            <>
              <Link to="/" className="text-slate-700 hover:text-orange-600 text-sm transition-colors">Ürünler</Link>
              {user && (
                <>
                  <Link to="/cart" className="text-slate-700 hover:text-orange-600 text-sm transition-colors">Sepet</Link>
                  <Link to="/favorites" className="text-slate-700 hover:text-orange-600 text-sm transition-colors">Favoriler</Link>
                  <Link to="/orders" className="text-slate-700 hover:text-orange-600 text-sm transition-colors">Siparişlerim</Link>
                </>
              )}
            </>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors">
              ⚙️ Admin Paneli
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {!isAdmin ? (
                <Link to="/profile" className="text-slate-700 hover:text-orange-600 text-sm transition-colors">
                  {user.fullName}
                </Link>
              ) : (
                <span className="text-slate-700 text-sm">{user.fullName}</span>
              )}
              {isAdmin && (
                <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full font-medium">Admin</span>
              )}
              <button onClick={handleLogout} className="btn-secondary px-4 py-2 text-sm">
                Çıkış
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn-secondary px-4 py-2 text-sm">Giriş</Link>
              <Link to="/register" className="btn-primary px-4 py-2 text-sm">Kayıt Ol</Link>
            </div>
          )}
        </div>
      </div>
      </nav>
    </header>
  );
}