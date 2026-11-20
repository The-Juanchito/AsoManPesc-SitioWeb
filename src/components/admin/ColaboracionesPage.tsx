export default function ColaboracionesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <i className="bi bi-handshake text-2xl text-purple-600"></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-green-900">Colaboraciones</h1>
          <p className="text-gray-500 text-sm">Aliados de la asociación</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-green-800 mb-4">
          <i className="bi bi-handshake me-2 text-purple-600"></i>Colaboraciones Estratégicas
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                <i className="bi bi-megaphone-fill"></i>
              </div>
              <div>
                <h4 className="font-bold text-red-800">Hit Social</h4>
                <p className="text-xs text-red-600">Aliado Comercial</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Campañas de marketing digital y presencia en redes sociales para impulsar las ventas de mangos.</p>
            <div className="mt-3 flex gap-2">
              <span className="bg-red-200 text-red-700 px-2 py-0.5 rounded-full text-xs"><i className="bi bi-megaphone me-1"></i>Marketing</span>
              <span className="bg-red-200 text-red-700 px-2 py-0.5 rounded-full text-xs"><i className="bi bi-instagram me-1"></i>Redes</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                <i className="bi bi-truck"></i>
              </div>
              <div>
                <h4 className="font-bold text-blue-800">Postobón</h4>
                <p className="text-xs text-blue-600">Aliado de Distribución</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Distribución y logística para llevar nuestros mangos a diferentes puntos del país.</p>
            <div className="mt-3 flex gap-2">
              <span className="bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full text-xs"><i className="bi bi-box-seam me-1"></i>Logística</span>
              <span className="bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full text-xs"><i className="bi bi-geo-alt me-1"></i>Distribución</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
