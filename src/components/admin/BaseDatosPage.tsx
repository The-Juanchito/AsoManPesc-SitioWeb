import { useState } from 'react';
import { MYSQL_CONFIG, MYSQL_SCHEMA } from '../../services/database';

export default function BaseDatosPage() {
  const [showSchema, setShowSchema] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'schema' | 'tables'>('config');

  const tables = [
    { name: 'usuarios', icon: 'bi-people-fill', color: 'blue', records: 5, description: 'Admins, asociados y clientes' },
    { name: 'canastas', icon: 'bi-basket3-fill', color: 'amber', records: 8, description: 'Registro de canastas producidas' },
    { name: 'registros_produccion', icon: 'bi-clipboard-data-fill', color: 'green', records: 3, description: 'Producción por asociado' },
    { name: 'pedidos', icon: 'bi-bag-fill', color: 'purple', records: 2, description: 'Pedidos de clientes' },
    { name: 'mensajes_chat', icon: 'bi-chat-dots-fill', color: 'rose', records: 0, description: 'Mensajes del chatbot' },
    { name: 'precios', icon: 'bi-tag-fill', color: 'indigo', records: 1, description: 'Precios de productos' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <i className="bi bi-database-fill-gear text-2xl text-indigo-600"></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-green-900">Base de Datos MySQL</h1>
          <p className="text-gray-500 text-sm">Configuración, esquema y tablas del sistema</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            activeTab === 'config'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'
          }`}
        >
          <i className="bi bi-gear-fill"></i> Configuración
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            activeTab === 'schema'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'
          }`}
        >
          <i className="bi bi-file-code-fill"></i> Schema SQL
        </button>
        <button
          onClick={() => setActiveTab('tables')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            activeTab === 'tables'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'
          }`}
        >
          <i className="bi bi-table"></i> Tablas
        </button>
      </div>

      {/* Configuración */}
      {activeTab === 'config' && (
        <div className="bg-white rounded-2xl shadow-md border border-blue-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="bi bi-database-fill text-3xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold">MySQL</h3>
                  <p className="text-blue-100 text-sm">Base de datos principal de AsoManPesc</p>
                </div>
              </div>
              <span className="db-status connected bg-white/20 text-white">
                <span className="pulse"></span>
                <i className="bi bi-check-circle-fill"></i> Conectado
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <i className="bi bi-hdd-network text-blue-600"></i>
                  <span className="text-sm font-medium text-gray-700">Host</span>
                </div>
                <code className="text-sm font-mono bg-white px-3 py-1.5 rounded-lg border border-gray-200 block">
                  {MYSQL_CONFIG.host}:{MYSQL_CONFIG.port}
                </code>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <i className="bi bi-person-badge text-blue-600"></i>
                  <span className="text-sm font-medium text-gray-700">Usuario</span>
                </div>
                <code className="text-sm font-mono bg-white px-3 py-1.5 rounded-lg border border-gray-200 block">
                  {MYSQL_CONFIG.user}
                </code>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <i className="bi bi-folder2-open text-blue-600"></i>
                  <span className="text-sm font-medium text-gray-700">Base de datos</span>
                </div>
                <code className="text-sm font-mono bg-white px-3 py-1.5 rounded-lg border border-gray-200 block">
                  {MYSQL_CONFIG.database}
                </code>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <i className="bi bi-fonts text-blue-600"></i>
                  <span className="text-sm font-medium text-gray-700">Charset</span>
                </div>
                <code className="text-sm font-mono bg-white px-3 py-1.5 rounded-lg border border-gray-200 block">
                  {MYSQL_CONFIG.charset}
                </code>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <i className="bi bi-diagram-3 text-blue-600"></i>
                  <span className="text-sm font-medium text-gray-700">Límite de conexiones</span>
                </div>
                <code className="text-sm font-mono bg-white px-3 py-1.5 rounded-lg border border-gray-200 block">
                  {MYSQL_CONFIG.connectionLimit} conexiones máx.
                </code>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <i className="bi bi-shield-lock text-blue-600"></i>
                  <span className="text-sm font-medium text-gray-700">Seguridad</span>
                </div>
                <code className="text-sm font-mono bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200 block">
                  <i className="bi bi-check-lg"></i> Contraseña encriptada
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schema SQL */}
      {activeTab === 'schema' && (
        <div className="bg-white rounded-2xl shadow-md border border-blue-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="bi bi-file-code-fill text-2xl text-green-400"></i>
              <div>
                <h3 className="font-bold">Schema MySQL - asomanpesc_db</h3>
                <p className="text-gray-400 text-xs">Estructura completa de la base de datos</p>
              </div>
            </div>
            <button
              onClick={() => setShowSchema(!showSchema)}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <i className={`bi bi-${showSchema ? 'eye-slash' : 'eye'}`}></i>
              {showSchema ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          {showSchema && (
            <pre className="bg-gray-900 text-green-400 p-6 text-xs overflow-x-auto max-h-[600px] overflow-y-auto font-mono leading-relaxed">
              {MYSQL_SCHEMA}
            </pre>
          )}
          {!showSchema && (
            <div className="p-8 text-center text-gray-400">
              <i className="bi bi-eye-slash text-4xl mb-2 block"></i>
              <p>Haz clic en "Mostrar" para ver el schema SQL completo</p>
            </div>
          )}
        </div>
      )}

      {/* Tablas */}
      {activeTab === 'tables' && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
            <i className="bi bi-table text-blue-600"></i> Tablas Disponibles en MySQL
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map((table, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 bg-${table.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <i className={`bi ${table.icon} text-${table.color}-600 text-xl`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">{table.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{table.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        <i className="bi bi-list-ol me-1"></i>{table.records} registros
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info adicional */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <i className="bi bi-info-circle-fill text-2xl"></i>
          <h3 className="text-lg font-bold">Información del Sistema</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <p className="text-blue-200 text-xs">Motor de BD</p>
            <p className="text-lg font-bold">MySQL 8.0</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <p className="text-blue-200 text-xs">Total de tablas</p>
            <p className="text-lg font-bold">6 tablas</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <p className="text-blue-200 text-xs">Registros totales</p>
            <p className="text-lg font-bold">19 registros</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <p className="text-blue-200 text-xs">Estado</p>
            <p className="text-lg font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Activo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
