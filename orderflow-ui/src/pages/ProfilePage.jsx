import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/orderApi';

export default function ProfilePage() {
  const { user, loginUser } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.fullName?.split(' ')[0] || '',
    lastName: user?.fullName?.split(' ').slice(1).join(' ') || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setSuccess(''); setError('');
    try {
      setLoading(true);
      await updateProfile(form);
      // LocalStorage'daki user bilgisini güncelle
      const updatedUser = {
        ...user,
        fullName: `${form.firstName} ${form.lastName}`
      };
      loginUser(updatedUser);
      setSuccess('Bilgileriniz güncellendi!');
    } catch (err) {
      setError(err.response?.data?.message || 'Hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell px-6 py-8">
      <div className="max-w-xl mx-auto">
        <h1 className="section-title text-2xl font-bold text-slate-900 mb-8">Profilim</h1>

        {/* Kullanıcı bilgileri kartı */}
        <div className="card-panel rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-slate-900 font-semibold text-lg">{user?.fullName}</p>
              <p className="text-slate-600 text-sm">{user?.email}</p>
              <span className="text-xs bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full mt-1 inline-block">
                {user?.role === 'Admin' ? 'Admin' : 'Kullanıcı'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 mb-1 block">Ad</label>
                <input
                  value={form.firstName}
                  onChange={e => update('firstName', e.target.value)}
                  className="input-modern text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 mb-1 block">Soyad</label>
                <input
                  value={form.lastName}
                  onChange={e => update('lastName', e.target.value)}
                  className="input-modern text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-600 mb-1 block">Email</label>
              <input
                value={user?.email}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-1">Email adresi değiştirilemez</p>
            </div>

            {success && <p className="text-green-700 text-sm">{success}</p>}
            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? 'Kaydediliyor...' : 'Bilgileri Güncelle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}