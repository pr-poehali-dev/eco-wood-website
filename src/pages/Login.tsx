import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const ADMIN_LOGIN = 'mn-mashkova1603';
const ADMIN_PASS = 'M16M0489Nm06MOh';
const MANAGER_LOGIN = 'oh-mashkova';
const MANAGER_PASS = '06OMh16Mm0489Nm';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (username === ADMIN_LOGIN && password === ADMIN_PASS) {
      navigate('/admin');
    } else if (username === MANAGER_LOGIN && password === MANAGER_PASS) {
      navigate('/manager');
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="min-h-screen bg-eco-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-eco-600 hover:text-eco-800 mb-8 transition-colors"
        >
          <Icon name="ArrowLeft" size={18} />
          <span className="text-sm">На главную</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-eco-100 p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <img
              src="https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/bucket/959b4979-43a8-4629-b1a0-51a51b81c558.png"
              alt="ЭкоДрев"
              className="w-16 h-16 object-contain mb-3"
            />
            <h1 className="font-display text-2xl font-bold text-eco-800">Вход в систему</h1>
            <p className="text-eco-500 text-sm mt-1">ЭкоДрев — панель управления</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-eco-700 text-sm font-medium block mb-2">Имя пользователя</label>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Введите логин"
                className="w-full border border-eco-200 rounded-xl px-4 py-3 text-eco-800 focus:outline-none focus:ring-2 focus:ring-eco-400 bg-eco-50 placeholder-eco-300 text-sm"
                required
              />
            </div>

            <div>
              <label className="text-eco-700 text-sm font-medium block mb-2">Пароль</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="w-full border border-eco-200 rounded-xl px-4 py-3 pr-11 text-eco-800 focus:outline-none focus:ring-2 focus:ring-eco-400 bg-eco-50 placeholder-eco-300 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-eco-400 hover:text-eco-600"
                >
                  <Icon name={showPass ? 'EyeOff' : 'Eye'} size={18} />
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              <Icon name="LogIn" size={18} />
              Войти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
