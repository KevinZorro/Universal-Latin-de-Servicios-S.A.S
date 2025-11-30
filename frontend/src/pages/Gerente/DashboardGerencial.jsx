import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Filter, Calendar, User, Briefcase, FileText, FileSpreadsheet } from 'lucide-react';

const DashboardGerencial = () => {
    const [dataOriginal, setDataOriginal] = useState(null);
    const [dataFiltrada, setDataFiltrada] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState({
        fechaInicio: '',
        fechaFin: '',
        cliente: '',
        servicio: ''
    });

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const url = `http://localhost:8080/api/dashboard/filtros`;
            console.log('🔍 Cargando todos los datos...');

            const response = await fetch(url);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error del servidor:', errorText);
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const resultado = await response.json();
            console.log('✅ Datos cargados:', resultado);

            if (!resultado.detalles || !Array.isArray(resultado.detalles)) {
                console.error('⚠️ Respuesta sin estructura válida:', resultado);
                throw new Error('La respuesta del servidor no tiene el formato esperado');
            }

            setDataOriginal(resultado);
            setDataFiltrada(resultado);
        } catch (error) {
            console.error('💥 Error al cargar datos:', error);
            alert(`Error al cargar los datos del dashboard:\n${error.message}\n\nRevisa la consola para más detalles.`);
        } finally {
            setLoading(false);
        }
    };

    const aplicarFiltrosFrontend = () => {
        if (!dataOriginal) return;

        console.log('🔄 Aplicando filtros en frontend:', filtros);

        // Filtrar los detalles
        let detallesFiltrados = [...dataOriginal.detalles];

        // Filtro por cliente
        if (filtros.cliente) {
            detallesFiltrados = detallesFiltrados.filter(d =>
                d.cliente.toLowerCase().includes(filtros.cliente.toLowerCase())
            );
            console.log(`📌 Después de filtrar por cliente "${filtros.cliente}":`, detallesFiltrados.length);
        }

        // Filtro por servicio
        if (filtros.servicio) {
            detallesFiltrados = detallesFiltrados.filter(d =>
                d.servicio.toLowerCase().includes(filtros.servicio.toLowerCase())
            );
            console.log(`📌 Después de filtrar por servicio "${filtros.servicio}":`, detallesFiltrados.length);
        }

        // Filtro por fecha inicio
        if (filtros.fechaInicio) {
            const fechaInicio = new Date(filtros.fechaInicio);
            detallesFiltrados = detallesFiltrados.filter(d => {
                const fechaRegistro = new Date(d.fechaRegistro);
                return fechaRegistro >= fechaInicio;
            });
            console.log(`📌 Después de filtrar por fecha inicio:`, detallesFiltrados.length);
        }

        // Filtro por fecha fin
        if (filtros.fechaFin) {
            const fechaFin = new Date(filtros.fechaFin);
            fechaFin.setHours(23, 59, 59, 999); // Incluir todo el día
            detallesFiltrados = detallesFiltrados.filter(d => {
                const fechaRegistro = new Date(d.fechaRegistro);
                return fechaRegistro <= fechaFin;
            });
            console.log(`📌 Después de filtrar por fecha fin:`, detallesFiltrados.length);
        }

        // Recalcular estadísticas basadas en los detalles filtrados
        const evidenciasPorEstado = {};
        const evidenciasPorServicio = {};
        const evidenciasPorEmpleado = {};
        let totalHoras = 0;

        detallesFiltrados.forEach(detalle => {
            // Por estado
            evidenciasPorEstado[detalle.estado] = (evidenciasPorEstado[detalle.estado] || 0) + 1;

            // Por servicio
            evidenciasPorServicio[detalle.servicio] = (evidenciasPorServicio[detalle.servicio] || 0) + 1;

            // Por empleado
            evidenciasPorEmpleado[detalle.empleado] = (evidenciasPorEmpleado[detalle.empleado] || 0) + 1;

            // Calcular horas
            if (detalle.horaInicio && detalle.horaFin) {
                const inicio = new Date(detalle.horaInicio);
                const fin = new Date(detalle.horaFin);
                const horas = (fin - inicio) / (1000 * 60 * 60); // Convertir ms a horas
                totalHoras += horas;
            }
        });

        const nuevosDatos = {
            totalEvidencias: detallesFiltrados.length,
            totalHoras: Math.round(totalHoras * 100) / 100, // Redondear a 2 decimales
            evidenciasPorEstado,
            evidenciasPorServicio,
            evidenciasPorEmpleado,
            detalles: detallesFiltrados
        };

        console.log('✅ Datos filtrados:', nuevosDatos);
        setDataFiltrada(nuevosDatos);
    };

    const handleFiltroChange = (campo, valor) => {
        setFiltros(prev => {
            const nuevosFiltros = { ...prev, [campo]: valor };
            console.log('🔄 Filtros actualizados:', nuevosFiltros);
            return nuevosFiltros;
        });
    };

    const aplicarFiltros = () => {
        console.log('🚀 Aplicando filtros...');
        aplicarFiltrosFrontend();
    };

    const limpiarFiltros = () => {
        console.log('🧹 Limpiando filtros...');
        setFiltros({
            fechaInicio: '',
            fechaFin: '',
            cliente: '',
            servicio: ''
        });
        setDataFiltrada(dataOriginal);
    };

    const exportarPDF = () => {
        if (!dataFiltrada) return;

        const contenido = `
REPORTE GERENCIAL - DASHBOARD
================================

Fecha de generación: ${new Date().toLocaleString('es-CO')}

FILTROS APLICADOS
-----------------
${filtros.fechaInicio ? `Fecha Inicio: ${filtros.fechaInicio}` : ''}
${filtros.fechaFin ? `Fecha Fin: ${filtros.fechaFin}` : ''}
${filtros.cliente ? `Cliente: ${filtros.cliente}` : ''}
${filtros.servicio ? `Servicio: ${filtros.servicio}` : ''}

RESUMEN GENERAL
---------------
Total de Evidencias: ${dataFiltrada.totalEvidencias}
Total de Horas: ${dataFiltrada.totalHoras}
Servicios Activos: ${Object.keys(dataFiltrada.evidenciasPorServicio || {}).length}

EVIDENCIAS POR ESTADO
---------------------
${Object.entries(dataFiltrada.evidenciasPorEstado || {}).map(([estado, count]) =>
            `${estado}: ${count}`
        ).join('\n')}

EVIDENCIAS POR SERVICIO
-----------------------
${Object.entries(dataFiltrada.evidenciasPorServicio || {}).map(([servicio, count]) =>
            `${servicio}: ${count}`
        ).join('\n')}

EVIDENCIAS POR EMPLEADO
-----------------------
${Object.entries(dataFiltrada.evidenciasPorEmpleado || {}).map(([empleado, count]) =>
            `${empleado}: ${count}`
        ).join('\n')}

DETALLE DE EVIDENCIAS
---------------------
${dataFiltrada.detalles.map((det, idx) => `
${idx + 1}. Cliente: ${det.cliente}
   Servicio: ${det.servicio}
   Empleado: ${det.empleado}
   Estado: ${det.estado}
   Fecha: ${new Date(det.fechaRegistro).toLocaleDateString('es-CO')}
   Horario: ${new Date(det.horaInicio).toLocaleTimeString('es-CO')} - ${new Date(det.horaFin).toLocaleTimeString('es-CO')}
   Descripción: ${det.descripcion}
`).join('\n')}
`;

        const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte_gerencial_${new Date().toISOString().split('T')[0]}.txt`;
        link.click();
        URL.revokeObjectURL(url);

        alert('✅ Reporte PDF exportado exitosamente (formato texto)');
    };

    const exportarExcel = () => {
        if (!dataFiltrada) return;

        let csv = 'ID,Cliente,Servicio,Empleado,Estado,Fecha Registro,Hora Inicio,Hora Fin,Descripción\n';

        dataFiltrada.detalles.forEach(det => {
            csv += `${det.idEvidencia},"${det.cliente}","${det.servicio}","${det.empleado}","${det.estado}",`;
            csv += `"${new Date(det.fechaRegistro).toLocaleString('es-CO')}",`;
            csv += `"${new Date(det.horaInicio).toLocaleTimeString('es-CO')}",`;
            csv += `"${new Date(det.horaFin).toLocaleTimeString('es-CO')}",`;
            csv += `"${det.descripcion.replace(/"/g, '""')}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte_evidencias_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);

        alert('✅ Reporte Excel exportado exitosamente');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Cargando dashboard...</p>
                </div>
            </div>
        );
    }

    if (!dataFiltrada) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <p className="text-red-600 font-medium">No se pudieron cargar los datos</p>
                    <button
                        onClick={cargarDatos}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    const dataEstados = Object.entries(dataFiltrada.evidenciasPorEstado || {}).map(([name, value]) => ({ name, value }));
    const dataServicios = Object.entries(dataFiltrada.evidenciasPorServicio || {}).map(([name, value]) => ({ name, value }));
    const dataEmpleados = Object.entries(dataFiltrada.evidenciasPorEmpleado || {}).map(([name, value]) => ({ name, value }));

    const clientesUnicos = [...new Set(dataOriginal.detalles.map(d => d.cliente))].sort();
    const serviciosUnicos = [...new Set(dataOriginal.detalles.map(d => d.servicio))].sort();

    const hayFiltrosActivos = filtros.fechaInicio || filtros.fechaFin || filtros.cliente || filtros.servicio;

    return (
        <div className="min-h-screen bg-gray-50 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto pb-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Dashboard Gerencial</h1>
                            <p className="text-gray-600 mt-1">Análisis y reportes de evidencias de servicio</p>
                            {hayFiltrosActivos && (
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        🔍 Filtros activos
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        Mostrando {dataFiltrada.totalEvidencias} de {dataOriginal.totalEvidencias} evidencias
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={exportarPDF}
                                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                <FileText size={20} />
                                <span>Exportar PDF</span>
                            </button>
                            <button
                                onClick={exportarExcel}
                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                <FileSpreadsheet size={20} />
                                <span>Exportar Excel</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="text-blue-600" size={24} />
                        <h2 className="text-xl font-bold text-gray-800">Filtros de Búsqueda</h2>
                        <span className="ml-2 text-sm text-gray-500">(Filtrado en tiempo real)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar size={16} className="inline mr-1" />
                                Fecha Inicio
                            </label>
                            <input
                                type="date"
                                value={filtros.fechaInicio}
                                onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar size={16} className="inline mr-1" />
                                Fecha Fin
                            </label>
                            <input
                                type="date"
                                value={filtros.fechaFin}
                                onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <User size={16} className="inline mr-1" />
                                Cliente
                            </label>
                            <select
                                value={filtros.cliente}
                                onChange={(e) => handleFiltroChange('cliente', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Todos los clientes</option>
                                {clientesUnicos.map(cliente => (
                                    <option key={cliente} value={cliente}>{cliente}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Briefcase size={16} className="inline mr-1" />
                                Servicio
                            </label>
                            <select
                                value={filtros.servicio}
                                onChange={(e) => handleFiltroChange('servicio', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Todos los servicios</option>
                                {serviciosUnicos.map(servicio => (
                                    <option key={servicio} value={servicio}>{servicio}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={aplicarFiltros}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            Aplicar Filtros
                        </button>
                        <button
                            onClick={limpiarFiltros}
                            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition font-medium"
                        >
                            Limpiar
                        </button>
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                        <h3 className="text-lg font-semibold mb-2">Total Evidencias</h3>
                        <p className="text-4xl font-bold">{dataFiltrada.totalEvidencias}</p>
                        <p className="text-sm opacity-90 mt-2">
                            {hayFiltrosActivos ? `de ${dataOriginal.totalEvidencias} totales` : '(Todas)'}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                        <h3 className="text-lg font-semibold mb-2">Total Horas</h3>
                        <p className="text-4xl font-bold">{dataFiltrada.totalHoras}</p>
                        <p className="text-sm opacity-90 mt-2">
                            {hayFiltrosActivos ? '(Filtrado)' : '(Todas)'}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                        <h3 className="text-lg font-semibold mb-2">Servicios Activos</h3>
                        <p className="text-4xl font-bold">{Object.keys(dataFiltrada.evidenciasPorServicio || {}).length}</p>
                        <p className="text-sm opacity-90 mt-2">
                            {hayFiltrosActivos ? '(Filtrado)' : '(Todos)'}
                        </p>
                    </div>
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Evidencias por Servicio</h3>
                        {dataServicios.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={dataServicios}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#3b82f6" name="Cantidad" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-gray-400">
                                No hay datos disponibles
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Evidencias por Estado</h3>
                        {dataEstados.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={dataEstados}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(entry) => `${entry.name}: ${entry.value}`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {dataEstados.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-gray-400">
                                No hay datos disponibles
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabla de Empleados */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Desempeño por Empleado</h3>
                    {dataEmpleados.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dataEmpleados} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={150} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#10b981" name="Evidencias" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[300px] text-gray-400">
                            No hay datos disponibles
                        </div>
                    )}
                </div>

                {/* Tabla de Detalles */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Detalle de Evidencias ({dataFiltrada.detalles.length})
                    </h3>
                    {dataFiltrada.detalles.length > 0 ? (
                        <div className="overflow-x-auto max-h-96 overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">ID</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Cliente</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Servicio</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Empleado</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Estado</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {dataFiltrada.detalles.map((detalle) => (
                                        <tr key={detalle.idEvidencia} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900">{detalle.idEvidencia}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{detalle.cliente}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{detalle.servicio}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{detalle.empleado}</td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                    {detalle.estado}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {new Date(detalle.fechaRegistro).toLocaleDateString('es-CO')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <p className="text-lg">No se encontraron evidencias con los filtros aplicados</p>
                            <button
                                onClick={limpiarFiltros}
                                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardGerencial;