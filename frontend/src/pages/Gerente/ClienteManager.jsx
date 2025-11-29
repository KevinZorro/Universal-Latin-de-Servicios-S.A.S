import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Search, User } from 'lucide-react';
import ClienteService from './ClienteService';
// Simulación del servicio (reemplaza con import de ClienteService.js)

export default function ClienteManager() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [modoEdicion, setModoEdicion] = useState(false);
    const [idEditando, setIdEditando] = useState(null);


    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        direccion: '',
        nit: '',
        email: '',
        ciudad: ''
    });

    useEffect(() => {
        loadClientes();
    }, []);

    const loadClientes = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ClienteService.getAllClientes();
            setClientes(data);
        } catch (err) {
            setError('Error al cargar los clientes');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = (cliente) => {
    setFormData({
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        nit: cliente.nit,
        email: cliente.email,
        ciudad: cliente.ciudad
    });

    setIdEditando(cliente.id);
    setModoEdicion(true);
    setShowForm(true);
};


    const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
        if (modoEdicion) {
            await ClienteService.updateCliente(idEditando, formData);
        } else {
            await ClienteService.createCliente(formData);
        }

        setFormData({
            nombre: '',
            telefono: '',
            direccion: '',
            nit: '',
            email: '',
            ciudad: ''
        });

        setShowForm(false);
        setModoEdicion(false);
        setIdEditando(null);

        await loadClientes();
    } catch (err) {
        setError(modoEdicion ? 'Error al actualizar el cliente' : 'Error al crear el cliente');
    } finally {
        setLoading(false);
    }
};


    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
            setLoading(true);
            try {
                await ClienteService.deleteCliente(id);
                await loadClientes();
            } catch (err) {
                setError('Error al eliminar el cliente');
            } finally {
                setLoading(false);
            }
        }
    };

    const filteredClientes = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.nit.includes(searchTerm)
    );

    return (
        <div className="h-auto min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <User className="w-8 h-8 text-indigo-600" />
                            <h1 className="text-3xl font-bold text-gray-800">Gestión de Clientes</h1>
                        </div>
                        <button
    onClick={() => {
        setShowForm(true);
        setModoEdicion(false);     // ✅ Vuelve a modo CREAR
        setIdEditando(null);      // ✅ Limpia ID
        setFormData({             // ✅ Limpia el formulario
            nombre: '',
            telefono: '',
            direccion: '',
            nit: '',
            email: '',
            ciudad: ''
        });
    }}
    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
>

                            <Plus className="w-5 h-5" />
                            Nuevo Cliente
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    {showForm && (
                        <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                {modoEdicion ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">NIT</label>
                                    <input
                                        type="text"
                                        name="nit"
                                        value={formData.nit}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                                    <input
                                        type="text"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                                    <input
                                        type="text"
                                        name="ciudad"
                                        value={formData.ciudad}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="md:col-span-2 flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Guardando...' : modoEdicion ? 'Actualizar' : 'Guardar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search */}
                    <div className="mb-6 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o NIT..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            <p className="mt-4 text-gray-600">Cargando...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto overflow-y-auto max-h-[500px] rounded-lg border border-gray-200 pb-10">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIT</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredClientes.map((cliente) => (
                                        <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cliente.nombre}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cliente.telefono}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cliente.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cliente.nit}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cliente.ciudad}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 flex gap-4">
    <button
        onClick={() => handleEdit(cliente)}
        className="text-indigo-600 hover:text-indigo-800 transition-colors"
        title="Editar"
    >
        <Edit className="w-5 h-5" />
    </button>

    <button
        onClick={() => handleDelete(cliente.id)}
        className="text-red-600 hover:text-red-800 transition-colors"
        title="Eliminar"
    >
        <Trash2 className="w-5 h-5" />
    </button>
</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredClientes.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    No se encontraron clientes
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}