import { useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LOGO_URL } from '../data/variedades';

interface LoginPageProps {
  onBack: () => void;
}

export default function LoginPage({ onBack }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verPass, setVerPass] = useState(false);
  const { login, loginGoogle } = useAuth();
  const googleBtn = useRef<HTMLDivElement>(null);
  const [googleId, setGoogleId] = useState<string | null>(null);

  useEffect(() => { api.getGoogleConfig().then(setGoogleId); }, []);

  // Botón oficial "Continuar con Google"
  useEffect(() => {
    if (!googleId) return;
    const pintar = () => {
      const g = (window as any).google?.accounts?.id;
      if (!g || !googleBtn.current) return;
      g.initialize({
        client_id: googleId,
        callback: async (resp: { credential: string }) => {
          setError(''); setLoading(true);
          const result = await loginGoogle(resp.credential);
          setLoading(false);
          if (!result.ok) setError(result.error);
        },
      });
      g.renderButton(googleBtn.current, { theme: 'outline', size: 'large', text: 'continue_with', shape: 'pill', width: 336, locale: 'es' });
    };
    if ((window as any).google?.accounts?.id) { pintar(); return; }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.onload = pintar;
    document.head.appendChild(s);
  }, [googleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
    }
  };

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
            <img src={LOGO_URL} alt="Logo AsoManPesc" className="w-28 h-28 rounded-full object-cover mx-auto mb-3 shadow-lg ring-4 ring-amber-400" />
            <h1 className="text-2xl font-bold text-green-800">AsoManPesc</h1>
            <p className="text-gray-500 text-sm mt-1">Inicia sesión en tu cuenta</p>
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
                  type={verPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setVerPass(v => !v)}
                  aria-label={verPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  title={verPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-700 p-1"
                >
                  <i className={`bi ${verPass ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <i className={`bi ${loading ? 'bi-hourglass-split' : 'bi-box-arrow-in-right'}`}></i>
              {loading ? 'Entrando...' : 'Iniciar Sesión'}
            </button>
          </form>

          {googleId && (
            <div className="mt-5">
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                <span className="flex-1 h-px bg-gray-200"></span>o<span className="flex-1 h-px bg-gray-200"></span>
              </div>
              <div ref={googleBtn} className="flex justify-center"></div>
              <p className="mt-2 text-center text-[11px] text-gray-400">Solo funciona con el correo con el que el administrador creó tu cuenta.</p>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-gray-400">
            <i className="bi bi-shield-lock-fill me-1"></i>Acceso con tu cuenta registrada. ¿No tienes una? Pídela al administrador.
          </p>
        </div>
      </div>
    </div>
  );
}
