import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setError('');
    try {
      setLoading(true);
      const res = await register(form);
      loginUser(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt başarısız.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell flex items-center justify-center">
      <div className="card-panel hero-banner rounded-2xl p-7 sm:p-8 w-full max-w-md fade-in-up">
        <h1 className="section-title text-2xl font-bold text-slate-900 mb-2">Kayıt Ol</h1>
        <p className="text-slate-600 text-sm mb-8">Yeni hesap oluştur</p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-700 mb-1 block">Ad</label>
              <input
                value={form.firstName}
                onChange={e => update('firstName', e.target.value)}
                placeholder="Ad"
                className="input-modern text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-700 mb-1 block">Soyad</label>
              <input
                value={form.lastName}
                onChange={e => update('lastName', e.target.value)}
                placeholder="Soyad"
                className="input-modern text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-700 mb-1 block">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              placeholder="email@example.com"
              className="input-modern text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-700 mb-1 block">Şifre</label>
            <input
              type="password"
              value={form.password}
              onChange={e => update('password', e.target.value)}
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
            {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </button>
        </div>

        <p className="text-slate-600 text-sm text-center mt-6">
          Hesabın var mı?{' '}
          <Link to="/login" className="text-orange-600 hover:text-orange-700">Giriş yap</Link>
        </p>
      </div>
    </div>
  );
}