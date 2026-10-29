import { useState } from 'react';

export default function ClienteDashboard() {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [order, setOrder] = useState({
    producto: '',
    cantidad: '',
    notas: ''
  });

  const productos = [
    { name: 'Mango Tommy Atkins', price: '$2.50/kg', description: 'Grande, pulpa firme y poco fibrosa', stock: 'Disponible', emoji: '🥭' },
    { name: 'Mango Ataulfo', price: '$3.00/kg', description: 'Dulce, cremoso y sin fibra', stock: 'Disponible', emoji: '✨' },
    { name: 'Mango Kent', price: '$3.50/kg', description: 'Jugoso, sabor dulce y suave', stock: 'Disponible', emoji: '💚' },
    { name: 'Mango Haden', price: '$2.80/kg', description: 'Sabor intenso y aromático', stock: 'Limitado', emoji: '🔴' },
    { name: 'Mango Keitt', price: '$3.20/kg', description: 'Grande, dulce sin fibra', stock: 'Disponible', emoji: '🟢' },
    { name: 'Mango Manila', price: '$2.00/kg', description: 'Pequeño, muy dulce', stock: 'Disponible', emoji: '🌟' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSent(true);
    setTimeout(() => {
      setOrderSent(false);
      setShowOrderForm(false);
      setOrder({ producto: '', cantidad: '', notas: '' });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-900">¡Bienvenido!</h1>
          <p className="text-gray-500">Explora nuestros mangos frescos y haz tu pedido</p>
        </div>
        <button
          onClick={() => setShowOrderForm(!showOrderForm)}
          className="bg-green-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <span>🛒</span> Hacer Pedido
        </button>
      </div>

      {/* Banner promocional */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <span className="text-5xl">🎉</span>
          <div>
            <h3 className="text-xl font-bold">¡Oferta Especial!</h3>
            <p className="text-amber-100">Compra más de 10kg y obtén un 10% de descuento en tu pedido</p>
          </div>
        </div>
      </div>

      {/* Formulario de pedido */}
      {showOrderForm && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-green-100">
          {orderSent ? (
            <div className="text-center py-8">
              <span className="text-5xl block mb-4">✅</span>
              <h3 className="text-xl font-bold text-green-800">¡Pedido Enviado!</h3>
              <p className="text-gray-500 mt-2">Nos pondremos en contacto contigo pronto para confirmar tu pedido.</p>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-bold text-green-800 mb-4">🛒 Realizar Pedido</h3>
              <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                  <select
                    value={order.producto}
                    onChange={(e) => setOrder({...order, producto: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                    required
                  >
                    <option value="">Seleccionar mango...</option>
                    {productos.map((p, i) => (
                      <option key={i} value={p.name}>{p.name} - {p.price}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad (kg)</label>
                  <input
                    type="number"
                    value={order.cantidad}
                    onChange={(e) => setOrder({...order, cantidad: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                    placeholder="Ej: 5"
                    min="1"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
                  <textarea
                    value={order.notas}
                    onChange={(e) => setOrder({...order, notas: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none resize-none"
                    rows={3}
                    placeholder="¿Alguna indicación especial?"
                  />
                </div>
                <div className="sm:col-span-2 flex gap-3">
                  <button type="submit" className="bg-green-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-800 transition-all">
                    Confirmar Pedido
                  </button>
                  <button type="button" onClick={() => setShowOrderForm(false)} className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all">
                    Cancelar
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}

      {/* Productos disponibles */}
      <div>
        <h3 className="text-xl font-bold text-green-800 mb-4">🥭 Mangos Disponibles</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map((p, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="bg-gradient-to-r from-green-100 to-amber-50 p-6 text-center">
                <span className="text-5xl">{p.emoji}</span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-green-800">{p.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{p.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-lg font-bold text-amber-600">{p.price}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    p.stock === 'Disponible' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {p.stock === 'Disponible' ? '✅' : '⚠️'} {p.stock}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info de contacto para pedidos */}
      <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
        <h3 className="text-lg font-bold text-green-800 mb-3">📞 ¿Necesitas ayuda con tu pedido?</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📱</span>
            <div>
              <p className="text-sm text-gray-500">WhatsApp</p>
              <p className="font-medium text-green-800">+502 5555-1234</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">✉️</span>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-green-800">ventas@asomanpesc.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🕐</span>
            <div>
              <p className="text-sm text-gray-500">Horario</p>
              <p className="font-medium text-green-800">Lun-Sáb 6AM-5PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
