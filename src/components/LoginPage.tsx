import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onBack: () => void;
}

export default function LoginPage({ onBack }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    const success = login(email, password);
    if (!success) {
      setError('Correo o contraseña incorrectos');
    }
  };

  const demoAccounts = [
    { role: 'Administrador', email: 'admin@asomanpesc.com', password: 'admin123', icon: 'bi-shield-fill-check', color: 'bg-red-50 text-red-700 border-red-200' },
    { role: 'Asociado', email: 'jose@asomanpesc.com', password: 'asociado123', icon: 'bi-person-badge-fill', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { role: 'Cliente', email: 'carlos@cliente.com', password: 'cliente123', icon: 'bi-person-fill', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 via-green-700 to-amber-600 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <button onClick={onBack} className="mb-4 text-white/80 hover:text-white flex items-center gap-2 transition-colors">
          <i className="bi bi-arrow-left"></i>
          Volver al inicio
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🥭</div>
            <h1 className="text-2xl font-bold text-green-800">AsoManPesc</h1>
            <p className="text-gray-500 text-sm mt-1">Inicia sesión en tu cuenta</p>
            <div className="flex justify-center gap-2 mt-3">
              <span className="db-status connected text-xs">
                <span className="pulse"></span>
                <i className="bi bi-database-fill-check"></i> MySQL
              </span>
              <span className="db-status connected text-xs">
                <span className="pulse"></span>
                <i className="bi bi-database-fill-check"></i> SQL Server
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-envelope-fill me-1"></i>Correo electrónico
              </label>
              <div className="relative">
                <i className="bi bi-at absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  placeholder="tu@correo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-lock-fill me-1"></i>Contraseña
              </label>
              <div className="relative">
                <i className="bi bi-key-fill absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <i className="bi bi-box-arrow-in-right"></i>
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              className="w-full text-center text-sm text-green-700 hover:text-green-800 font-medium flex items-center justify-center gap-1"
            >
              <i className={`bi bi-chevron-${showCredentials ? 'up' : 'down'}`}></i>
              {showCredentials ? 'Ocultar cuentas demo' : 'Ver cuentas de demostración'}
            </button>

            {showCredentials && (
              <div className="mt-4 space-y-2">
                {demoAccounts.map((account, i) => (
                  <div key={i} className={`p-3 rounded-xl border ${account.color}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-xs uppercase flex items-center gap-1">
                          <i className={`bi ${account.icon}`}></i>
                          {account.role}
                        </span>
                        <p className="text-xs mt-0.5 opacity-80">{account.email}</p>
                        <p className="text-xs opacity-80">Contraseña: {account.password}</p>
                      </div>
                      <button
                        onClick={() => { setEmail(account.email); setPassword(account.password); }}
                        className="text-xs bg-white/50 hover:bg-white px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1"
                      >
                        <i className="bi bi-arrow-right-circle"></i>
                        Usar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
