import { useState } from 'react';
import { MYSQL_CONFIG, SQLSERVER_CONFIG, MYSQL_SCHEMA, SQLSERVER_SCHEMA } from '../../services/database';

export default function BaseDatosPage() {
  const [showMySQL, setShowMySQL] = useState(false);
  const [showSQLServer, setShowSQLServer] = useState(false);
  const [activeTab, setActiveTab] = useState<'mysql' | 'sqlserver'>('mysql');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <i className="bi bi-database-fill-gear text-2xl text-indigo-600"></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-green-900">Configuración de Base de Datos</h1>
          <p className="text-gray-500 text-sm">MySQL y SQL Server - Configuración y esquemas</p>
        </div>
      </div>

      {/* Estado de conexiones */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* MySQL */}
        <div className={`border-2 rounded-2xl p-6 transition-all ${
          activeTab === 'mysql' ? 'border-blue-500 bg-blue-50/50 shadow-lg' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <i className="bi bi-database-fill text-white text-2xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-blue-800 text-lg">MySQL</h3>
                <p className="text-xs text-blue-600">Base de datos principal</p>
              </div>
            </div>
            <span className="db-status connected">
              <span className="pulse"></span>
              <i className="bi bi-check-circle-fill"></i> Online
            </span>
          </div>

          <div className="space-y-3 bg-white rounded-xl p-4 border border-blue-100">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <i className="bi bi-hdd-network"></i> Host
              </span>
              <code className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">{MYSQL_CONFIG.host}:{MYSQL_CONFIG.port}</code>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <i className="bi bi-person-badge"></i> Usuario
              </span>
              <code className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">{MYSQL_CONFIG.user}</code>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <i className="bi bi-folder2-open"></i> Base de datos
              </span>
              <code className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">{MYSQL_CONFIG.database}</code>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <i className="bi bi-fonts"></i> Charset
              </span>
              <code className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">{MYSQL_CONFIG.charset}</code>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <i className="bi bi-diagram-3"></i> Conexiones
              </span>
              <code className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">{MYSQL_CONFIG.connectionLimit} máx</code>
            </div>
          </div>

          <button
            onClick={() => setShowMySQL(!showMySQL)}
            className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <i className={`bi bi-chevron-${showMySQL ? 'up' : 'down'}`}></i>
            {showMySQL ? 'Ocultar Schema' : 'Ver Schema SQL'}
          </button>
        </div>

        {/* SQL Server */}
        <div className={`border-2 rounded-2xl p-6 transition-all ${
          activeTab === 'sqlserver' ? 'border-red-500 bg-red-50/50 shadow-lg' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <i className="bi bi-server text-white text-2xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-red-800 text-lg">SQL Server</h3>
                <p className="text-xs text-red-600">Base de datos secundaria</p>
              </div>
            </div>
            <span className="db-status connected">
              <span className="pulse"></span>
              <i className="bi bi-check-circle-fill"></i> Online
            </span>
          </div>

          <div className="space-y-3 bg-white rounded-xl p-4 border border-red-100">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <i className="bi bi-hdd-network"></i> Server
              </span>
              <code className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">{SQLSERVER_CONFIG.server}</code>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <i className="bi bi-ethernet"></i> Puerto
              </span>
              <code className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">{SQLSERVER_CONFIG.port}</code>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <i className="bi bi-person-badge"></i> Usuario
              </span>
              <code className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">{SQLSERVER_CONFIG.user}</code>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <i className="bi bi-folder2-open"></i> Base de datos
              </span>
              <code className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">{SQLSERVER_CONFIG.database}</code>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <i className="bi bi-shield-lock"></i> Encriptación
              </span>
              <code className="text-sm font-mono bg-green-100 text-green-700 px-2 py-0.5 rounded">
                <i className="bi bi-check-lg"></i> Activa
              </code>
            </div>
          </div>

          <button
            onClick={() => setShowSQLServer(!showSQLServer)}
            className="mt-4 w-full bg-red-600 text-white py-2.5 rounded-xl font-medium hover:bg-red-700 transition-all flex items-center justify-center gap-2"
          >
            <i className={`bi bi-chevron-${showSQLServer ? 'up' : 'down'}`}></i>
            {showSQLServer ? 'Ocultar Schema' : 'Ver Schema SQL'}
          </button>
        </div>
      </div>

      {/* Schemas SQL */}
      {showMySQL && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-200">
          <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
            <i className="bi bi-file-code-fill"></i> Schema MySQL
          </h3>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs overflow-x-auto max-h-96 overflow-y-auto">
            {MYSQL_SCHEMA}
          </pre>
        </div>
      )}

      {showSQLServer && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-red-200">
          <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
            <i className="bi bi-file-code-fill"></i> Schema SQL Server
          </h3>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs overflow-x-auto max-h-96 overflow-y-auto">
            {SQLSERVER_SCHEMA}
          </pre>
        </div>
      )}

      {/* Tablas disponibles */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-green-800 mb-4">
          <i className="bi bi-table me-2"></i>Tablas Disponibles
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'usuarios', icon: 'bi-people-fill', color: 'blue', records: 5 },
            { name: 'canastas', icon: 'bi-basket3-fill', color: 'amber', records: 8 },
            { name: 'registros_produccion', icon: 'bi-clipboard-data-fill', color: 'green', records: 3 },
            { name: 'pedidos', icon: 'bi-bag-fill', color: 'purple', records: 2 },
            { name: 'mensajes_chat', icon: 'bi-chat-dots-fill', color: 'rose', records: 0 },
            { name: 'precios', icon: 'bi-tag-fill', color: 'indigo', records: 1 },
          ].map((table, i) => (
            <div key={i} className={`p-4 rounded-xl border bg-${table.color}-50 border-${table.color}-200`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-${table.color}-100 rounded-lg flex items-center justify-center`}>
                  <i className={`bi ${table.icon} text-${table.color}-600 text-lg`}></i>
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{table.name}</p>
                  <p className="text-xs text-gray-500">{table.records} registros</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
