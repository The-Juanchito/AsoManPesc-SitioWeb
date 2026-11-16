import { useEffect, useState } from 'react';
import { api, EstadoBD } from './api';

// Consulta al servidor si MySQL responde y cuántas filas tiene cada tabla.
export function useEstadoBD() {
  const [estado, setEstado] = useState<EstadoBD | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vivo = true;
    api.getEstadoBD()
      .then(e => { if (vivo) { setEstado(e); setError(null); } })
      .catch(e => { if (vivo) setError(e.message); })
      .finally(() => { if (vivo) setCargando(false); });
    return () => { vivo = false; };
  }, []);

  return { estado, error, cargando, conectado: !!estado?.ok };
}
