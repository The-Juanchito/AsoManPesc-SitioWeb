// Catálogo único de variedades de mango de AsoManPesc.
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
  { name: 'Tommy Atkins', description: 'Grande, de piel roja-verdosa. Pulpa firme y poco fibrosa.', color: 'from-red-500 to-orange-400', emoji: '🥭', season: 'Todo el año', characteristics: ['Firme', 'Poco fibroso', 'Grande'] },
  { name: 'Ataulfo', description: 'Pequeño y dulce, amarillo dorado. Sin fibra, cremoso y aromático.', color: 'from-yellow-400 to-amber-500', emoji: '✨', season: 'Marzo - Junio', characteristics: ['Cremoso', 'Sin fibra', 'Aromático'] },
  { name: 'Kent', description: 'Grande y jugoso con tonos verdes y rojos. Sabor dulce y textura suave.', color: 'from-green-600 to-red-500', emoji: '💚', season: 'Junio - Agosto', characteristics: ['Jugoso', 'Suave', 'Dulce'] },
  { name: 'Haden', description: 'Rojo brillante con manchas amarillas. Sabor intenso y aromático.', color: 'from-red-600 to-yellow-400', emoji: '🔴', season: 'Febrero - Mayo', characteristics: ['Intenso', 'Aromático', 'Colorido'] },
  { name: 'Keitt', description: 'Grande, verde incluso maduro. Pulpa dulce sin fibra.', color: 'from-green-500 to-yellow-300', emoji: '🟢', season: 'Agosto - Septiembre', characteristics: ['Grande', 'Sin fibra', 'Verde'] },
  { name: 'Manila', description: 'Pequeño, alargado y muy dulce. Ideal fresco y en postres.', color: 'from-yellow-300 to-orange-400', emoji: '🌟', season: 'Abril - Julio', characteristics: ['Dulce', 'Pequeño', 'Alargado'] },

  // Variedades de Pescadero
  { name: 'Mango de Clases', description: 'Mango criollo de la región, muy apreciado en el mercado local.', color: 'from-amber-400 to-orange-500', emoji: '🥭', season: 'Según cosecha', characteristics: ['Criollo', 'Local', 'Tradicional'] },
  { name: 'Mango de Dilasa', description: 'Variedad de la zona de Pescadero, fruta fresca de la región.', color: 'from-yellow-400 to-orange-500', emoji: '🥭', season: 'Según cosecha', characteristics: ['Regional', 'Fresco', 'Jugoso'] },
  { name: 'Mango de Corazón', description: 'Variedad criolla de la región, fruta fresca recién cosechada.', color: 'from-rose-400 to-orange-400', emoji: '❤️', season: 'Según cosecha', characteristics: ['Criollo', 'Fresco', 'Regional'] },
  { name: 'Mango Filipino', description: 'Variedad dulce de la región, muy pedida por nuestros clientes.', color: 'from-yellow-300 to-amber-500', emoji: '🌟', season: 'Según cosecha', characteristics: ['Dulce', 'Aromático', 'Regional'] },
  { name: 'Mango Azúcar', description: 'Variedad criolla muy dulce, ideal para comer fresca.', color: 'from-amber-300 to-yellow-500', emoji: '🍯', season: 'Según cosecha', characteristics: ['Muy dulce', 'Criollo', 'Fresco'] },
  { name: 'Mango Piña', description: 'Variedad de la región, fruta fresca de nuestros productores.', color: 'from-yellow-400 to-lime-400', emoji: '🍍', season: 'Según cosecha', characteristics: ['Regional', 'Fresco', 'Dulce'] },
  { name: 'Mango Piñita', description: 'Variedad de menor tamaño de la región, fruta fresca.', color: 'from-lime-400 to-yellow-400', emoji: '🥭', season: 'Según cosecha', characteristics: ['Pequeño', 'Regional', 'Fresco'] },
  { name: 'Mango Número 11', description: 'Variedad conocida en la región como "el número 11".', color: 'from-orange-400 to-red-400', emoji: '🔢', season: 'Según cosecha', characteristics: ['Regional', 'Fresco', 'Tradicional'] },
  { name: 'Mango de Hovo', description: 'Variedad criolla de la región, fruta fresca de nuestros productores.', color: 'from-green-500 to-amber-400', emoji: '🥭', season: 'Según cosecha', characteristics: ['Criollo', 'Regional', 'Fresco'] },
  { name: 'Mango Mamei', description: 'Variedad de la región, fruta fresca de nuestros productores.', color: 'from-orange-500 to-rose-400', emoji: '🥭', season: 'Según cosecha', characteristics: ['Regional', 'Fresco', 'Aromático'] },
  { name: 'Mango de Piedra', description: 'Variedad criolla de pulpa firme, tradicional de la región.', color: 'from-stone-400 to-amber-500', emoji: '🪨', season: 'Según cosecha', characteristics: ['Firme', 'Criollo', 'Tradicional'] },
  { name: 'Mango Madurate Verde', description: 'Variedad que mantiene su color verde aun estando madura.', color: 'from-green-600 to-lime-400', emoji: '🟢', season: 'Según cosecha', characteristics: ['Verde', 'Regional', 'Fresco'] },
  { name: 'Mango de Chancleta', description: 'Variedad criolla alargada, conocida en la región como "de chancleta".', color: 'from-yellow-500 to-orange-400', emoji: '🥭', season: 'Según cosecha', characteristics: ['Alargado', 'Criollo', 'Regional'] },
  { name: 'Mango de Paloma', description: 'Variedad criolla de la región, fruta fresca de nuestros productores.', color: 'from-sky-400 to-amber-400', emoji: '🕊️', season: 'Según cosecha', characteristics: ['Criollo', 'Regional', 'Fresco'] },
];

export const NOMBRES_VARIEDADES = VARIEDADES.map(v => v.name);

export const LOGO_URL = '/logo.jpg';
