import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatCOP, PRECIO_CANASTA_COP } from '../services/database';
import { VARIEDADES } from '../data/variedades';

export default function ClienteDashboard() {
  const { user } = useAuth();
  const { pedidos, addPedido, precioCanasta } = useData();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [order, setOrder] = useState({
    producto: '',
    cantidad: '',
    notas: ''
  });

  const misPedidos = pedidos.filter(p => p.clienteId === user?.id);

  const productos = VARIEDADES.map((v, i) => ({
    name: v.name.toLowerCase().startsWith('mango') ? v.name : `Mango ${v.name}`,
    description: v.description,
    stock: v.name === 'Haden' ? 'Limitado' : 'Disponible',
    emoji: v.emoji,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order.producto || !order.cantidad) return;

    addPedido({
      clienteId: user!.id,
      clienteNombre: user!.name,
      producto: order.producto,
      cantidad: Number(order.cantidad),
      notas: order.notas,
      estado: 'pendiente'
    });

    setOrderSent(true);
    setTimeout(() => {
      setOrderSent(false);
      setShowOrderForm(false);
      setOrder({ producto: '', cantidad: '', notas: '' });
    }, 3000);
  };

  const totalEstimado = order.cantidad ? Number(order.cantidad) * PRECIO_CANASTA_COP : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-900">
            <i className="bi bi-emoji-smile-fill me-2"></i>¡Bienvenido, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-500">Explora nuestros mangos frescos y haz tu pedido</p>
        </div>
        <button
          onClick={() => setShowOrderForm(!showOrderForm)}
          className="bg-green-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <i className="bi bi-cart-plus-fill"></i> Hacer Pedido
        </button>
      </div>

      {/* Banner promocional */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <i className="bi bi-gift-fill text-5xl"></i>
          <div>
            <h3 className="text-xl font-bold">¡Oferta Especial!</h3>
            <p className="text-amber-100">Canasta de mangos a solo {formatCOP(PRECIO_CANASTA_COP)} COP. ¡Compra más de 10 canastas y obtén descuento!</p>
          </div>
        </div>
      </div>

      {/* Formulario de pedido */}
      {showOrderForm && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-green-100">
          {orderSent ? (
            <div className="text-center py-8">
              <i className="bi bi-check-circle-fill text-5xl text-green-600 block mb-4"></i>
              <h3 className="text-xl font-bold text-green-800">¡Pedido Guardado en la Base de Datos!</h3>
              <p className="text-gray-500 mt-2">Nos pondremos en contacto contigo pronto.</p>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-bold text-green-800 mb-4">
                <i className="bi bi-cart-fill me-2"></i>Realizar Pedido
              </h3>
              <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <i className="bi bi-fruit-cart me-1"></i>Producto
                  </label>
                  <select
                    value={order.producto}
                    onChange={(e) => setOrder({...order, producto: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                    required
                  >
                    <option value="">Seleccionar mango...</option>
                    {productos.map((p, i) => (
                      <option key={i} value={p.name}>{p.name} - {formatCOP(precioCanasta)}/canasta</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <i className="bi bi-basket3 me-1"></i>Cantidad (canastas)
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <i className="bi bi-chat-text me-1"></i>Notas adicionales
                  </label>
                  <textarea
                    value={order.notas}
                    onChange={(e) => setOrder({...order, notas: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none resize-none"
                    rows={3}
                    placeholder="¿Alguna indicación especial?"
                  />
                </div>
                {totalEstimado > 0 && (
                  <div className="sm:col-span-2 bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">
                        <i className="bi bi-calculator me-1"></i>Total estimado:
                      </span>
                      <span className="text-xl font-bold text-green-700">{formatCOP(totalEstimado)} COP</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.cantidad} canastas × {formatCOP(precioCanasta)} = {formatCOP(totalEstimado)}
                    </p>
                  </div>
                )}
                <div className="sm:col-span-2 flex gap-3">
                  <button type="submit" className="bg-green-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-800 transition-all flex items-center gap-2">
                    <i className="bi bi-database-fill-add"></i> Guardar Pedido en DB
                  </button>
                  <button type="button" onClick={() => setShowOrderForm(false)} className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center gap-2">
                    <i className="bi bi-x-lg"></i> Cancelar
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}

      {/* Mis pedidos */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-green-800">
            <i className="bi bi-bag-fill me-2 text-green-600"></i>Mis Pedidos (en DB)
          </h3>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            <i className="bi bi-list-check me-1"></i>{misPedidos.length} pedidos
          </span>
        </div>
        {misPedidos.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <i className="bi bi-inbox text-4xl block mb-2"></i>
            <p>Aún no has realizado ningún pedido</p>
          </div>
        ) : (
          <div className="space-y-3">
            {misPedidos.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                    <i className="bi bi-fruit-cart text-green-700"></i>
                  </div>
                  <div>
                    <p className="font-medium text-green-800">{p.producto}</p>
                    <p className="text-xs text-gray-500">
                      <i className="bi bi-calendar3 me-1"></i>{new Date(p.createdAt).toLocaleDateString()} • {p.notas || 'Sin notas'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700">{p.cantidad} canastas</p>
                  <p className="text-sm text-amber-600 font-bold">{formatCOP(p.precioTotal)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    p.estado === 'entregado' ? 'bg-green-100 text-green-700' :
                    p.estado === 'confirmado' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    <i className={`bi me-1 ${
                      p.estado === 'entregado' ? 'bi-check-circle-fill' :
                      p.estado === 'confirmado' ? 'bi-clock-fill' : 'bi-hourglass-split'
                    }`}></i>
                    {p.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Productos disponibles */}
      <div>
        <h3 className="text-xl font-bold text-green-800 mb-4">
          <i className="bi bi-grid-fill me-2 text-amber-600"></i>Mangos Disponibles
        </h3>
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
                  <span className="text-lg font-bold text-amber-600">{formatCOP(precioCanasta)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    p.stock === 'Disponible' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    <i className={`bi me-1 ${p.stock === 'Disponible' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
                    {p.stock}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info de contacto */}
      <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
        <h3 className="text-lg font-bold text-green-800 mb-3">
          <i className="bi bi-telephone-fill me-2"></i>¿Necesitas ayuda?
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <i className="bi bi-whatsapp text-3xl text-green-600"></i>
            <div>
              <p className="text-sm text-gray-500">WhatsApp Admin</p>
              <p className="font-medium text-green-800">+57 324 203 0867</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <i className="bi bi-envelope-fill text-3xl text-green-600"></i>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-green-800">ventas@asomanpesc.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <i className="bi bi-clock-fill text-3xl text-green-600"></i>
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
