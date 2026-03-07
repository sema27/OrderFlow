import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    try {
      setLoading(true);
      const res = await login({ email, password });
      loginUser(res.data);
      navigate('/');
    } catch {
      setError('Email veya şifre hatalı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell flex items-center justify-center">
      <div className="card-panel hero-banner rounded-2xl p-7 sm:p-8 w-full max-w-md fade-in-up">
        <h1 className="section-title text-2xl font-bold text-slate-900 mb-2">Giriş Yap</h1>
        <p className="text-slate-600 text-sm mb-8">OrderFlow hesabına giriş yap</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-700 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="input-modern text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-700 mb-1 block">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="••••••••"
              className="input-modern text-sm"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full btn-primary py-2.5 text-sm disabled:opacity-50"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </div>

        <p className="text-slate-600 text-sm text-center mt-6">
          Hesabın yok mu?{' '}
          <Link to="/register" className="text-orange-600 hover:text-orange-700">Kayıt ol</Link>
        </p>
      </div>
    </div>
  );
}