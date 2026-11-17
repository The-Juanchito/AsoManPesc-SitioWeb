// Catálogo de AsoManPesc: la asociación se enfoca en el Mango de Dilasa.
// Se usa en la página principal, el panel del cliente, el del asociado y el chatbot.

export interface Variedad {
  name: string;          // Nombre corto (para formularios y registros)
  description: string;
  color: string;         // Gradiente Tailwind para la tarjeta
  emoji: string;
  season: string;
  characteristics: string[];
}

export const VARIEDADES: Variedad[] = [
  { name: 'Mango de Dilasa', description: 'Nuestro mango insignia de la zona de Pescadero: fruta fresca, jugosa y recién cosechada por los productores de la asociación.', color: 'from-yellow-400 to-orange-500', emoji: '🥭', season: 'Según cosecha', characteristics: ['Regional', 'Fresco', 'Jugoso'] },
];

export const NOMBRES_VARIEDADES = VARIEDADES.map(v => v.name);

export const LOGO_URL = '/logo.jpg';
