import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth, UserRole } from '../../context/AuthContext';
import { DBUser } from '../../services/database';

interface FormState {
  cedula: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

const emptyForm: FormState = { cedula: '', name: '', email: '', phone: '', password: '', role: 'cliente' };

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Administrador' },
  { value: 'asociado', label: 'Asociado' },
  { value: 'cliente', label: 'Cliente' },
];

const roleStyle = (role: UserRole) =>
  role === 'admin' ? 'bg-red-100 text-red-700 border-red-200' :
  role === 'asociado' ? 'bg-amber-100 text-amber-700 border-amber-200' :
  'bg-blue-100 text-blue-700 border-blue-200';

export default function UsuariosPage() {
  const { allUsers, addUser, updateUser, deleteUser } = useData();
  const { user: currentUser } = useAuth();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'todos' | UserRole>('todos');
  const [editing, setEditing] = useState<DBUser | null>(null); // usuario en edición
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState('');
  const [toDelete, setToDelete] = useState<DBUser | null>(null);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const flash = (type: 'ok' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const filtered = allUsers.filter(u => {
    const q = search.trim().toLowerCase();
    const matches = !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.cedula ?? '').includes(q);
    return matches && (roleFilter === 'todos' || u.role === roleFilter);
  });

  const openCreate = () => {
    setForm(emptyForm);
    setFormError('');
    setEditing(null);
    setCreating(true);
  };

  const openEdit = (u: DBUser) => {
    setForm({
      cedula: u.cedula ?? '',
      name: u.name,
      email: u.email,
      phone: u.phone ?? '',
      password: '',
      role: u.role,
    });
    setFormError('');
    setCreating(false);
    setEditing(u);
  };

  const closeForm = () => {
    setCreating(false);
    setEditing(null);
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cedula = form.cedula.trim();
    const name = form.name.trim();
    const email = form.email.trim();

    if (!cedula || !name || !email) {
      setFormError('Cédula, nombre y correo son obligatorios');
      return;
    }
    if (!/^\d{5,12}$/.test(cedula)) {
      setFormError('La cédula debe tener solo números (entre 5 y 12 dígitos)');
      return;
    }

    if (editing) {
      const changes: Partial<DBUser> = { cedula, name, email, phone: form.phone.trim() || undefined, role: form.role };
      if (form.password) changes.password = form.password;
      const result = updateUser(editing.id, changes);
      if (!result.ok) { setFormError(result.error ?? 'No se pudo guardar'); return; }
      flash('ok', `Usuario "${name}" actualizado`);
    } else {
      if (!form.password) { setFormError('La contraseña es obligatoria para un usuario nuevo'); return; }
      const result = addUser({ cedula, name, email, phone: form.phone.trim() || undefined, password: form.password, role: form.role });
      if (!result.ok) { setFormError(result.error ?? 'No se pudo crear'); return; }
      flash('ok', `Usuario "${name}" creado`);
    }
    closeForm();
  };

  const handleRoleChange = (u: DBUser, role: UserRole) => {
    const result = updateUser(u.id, { role });
    if (result.ok) flash('ok', `Rol de ${u.name} cambiado a ${ROLES.find(r => r.value === role)?.label}`);
    else flash('error', result.error ?? 'No se pudo cambiar el rol');
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    const result = deleteUser(toDelete.id);
    if (result.ok) flash('ok', `Usuario "${toDelete.name}" eliminado`);
    else flash('error', result.error ?? 'No se pudo eliminar');
    setToDelete(null);
  };

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none';
  const showForm = creating || editing !== null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <i className="bi bi-people-fill text-2xl text-green-700"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-900">Gestión de Usuarios</h1>
            <p className="text-gray-500 text-sm">Administra cédula, datos y rol de cada persona</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-md transition-all"
        >
          <i className="bi bi-person-plus-fill"></i> Nuevo usuario
        </button>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm flex items-center gap-2 border ${
          message.type === 'ok' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <i className={`bi ${message.type === 'ok' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
          {message.text}
        </div>
      )}

      {/* Formulario crear / editar */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-green-100">
          <h3 className="text-lg font-bold text-green-800 mb-4">
            <i className={`bi ${editing ? 'bi-pencil-square' : 'bi-person-plus-fill'} me-2`}></i>
            {editing ? `Editar a ${editing.name}` : 'Nuevo usuario'}
          </h3>
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl mb-4 text-sm flex items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill"></i>{formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1"><i className="bi bi-card-text me-1"></i>ID (cédula)</label>
              <input className={inputClass} value={form.cedula} inputMode="numeric"
                onChange={e => setForm({ ...form, cedula: e.target.value.replace(/\D/g, '') })} placeholder="Ej: 1002345678" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1"><i className="bi bi-person me-1"></i>Nombre completo</label>
              <input className={inputClass} value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nombre y apellido" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1"><i className="bi bi-envelope me-1"></i>Correo</label>
              <input type="email" className={inputClass} value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} placeholder="correo@ejemplo.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1"><i className="bi bi-telephone me-1"></i>Teléfono (opcional)</label>
              <input className={inputClass} value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+57 300 000 0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1"><i className="bi bi-shield-check me-1"></i>Rol</label>
              <select className={inputClass} value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value as UserRole })}
                disabled={editing?.id === currentUser?.id}>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-key me-1"></i>Contraseña {editing && <span className="text-gray-400">(vacío = no cambiar)</span>}
              </label>
              <input type="password" className={inputClass} value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex gap-3">
              <button type="submit" className="bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-green-800 transition-all flex items-center gap-2">
                <i className="bi bi-save-fill"></i> {editing ? 'Guardar cambios' : 'Crear usuario'}
              </button>
              <button type="button" onClick={closeForm} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center gap-2">
                <i className="bi bi-x-lg"></i> Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
            placeholder="Buscar por nombre, correo o cédula..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none"
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value as 'todos' | UserRole)}
        >
          <option value="todos">Todos los roles</option>
          {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-green-800">
            <i className="bi bi-list-ul me-2 text-green-600"></i>Personas registradas
          </h3>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            {filtered.length} de {allUsers.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-sm font-medium text-gray-500">
                <th className="py-3 px-2">ID (cédula)</th>
                <th className="py-3 px-2">Nombre</th>
                <th className="py-3 px-2">Correo</th>
                <th className="py-3 px-2">Rol</th>
                <th className="py-3 px-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const isSelf = u.id === currentUser?.id;
                return (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-green-50/50 transition-colors">
                    <td className="py-3 px-2 text-sm font-mono text-gray-700">{u.cedula || <span className="text-gray-300">—</span>}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-700">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-medium text-gray-800 text-sm">{u.name}</span>
                          {isSelf && <span className="ml-2 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">tú</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-600">{u.email}</td>
                    <td className="py-3 px-2">
                      <select
                        value={u.role}
                        disabled={isSelf}
                        title={isSelf ? 'No puedes cambiar tu propio rol' : 'Cambiar rol'}
                        onChange={e => handleRoleChange(u, e.target.value as UserRole)}
                        className={`text-xs font-medium px-2 py-1.5 rounded-full border outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${roleStyle(u.role)}`}
                      >
                        {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(u)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium flex items-center gap-1 transition-colors"
                        >
                          <i className="bi bi-pencil-fill"></i> Editar
                        </button>
                        <button
                          onClick={() => setToDelete(u)}
                          disabled={isSelf}
                          title={isSelf ? 'No puedes eliminarte a ti mismo' : 'Eliminar'}
                          className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm font-medium flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <i className="bi bi-trash-fill"></i> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400">No se encontraron usuarios</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmación de eliminación */}
      {toDelete && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setToDelete(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="bi bi-exclamation-triangle-fill text-red-600 text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-center text-gray-800">¿Eliminar usuario?</h3>
            <p className="text-sm text-gray-600 text-center mt-2">
              Se eliminará a <strong>{toDelete.name}</strong>{toDelete.cedula ? ` (CC ${toDelete.cedula})` : ''}. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setToDelete(null)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200">Cancelar</button>
              <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-medium hover:bg-red-700">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
