import { useState } from 'react';

const SolicitudForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    correo: '',
    telefono: '',
    posicion: '',
    anosExperiencia: '',
    hojaVida: null,
    comentarios: ''
  });

  const [errors, setErrors] = useState({});

  const posiciones = [
    'Selecciona una posición',
    'Jardinería',
    'Celaduría',
    'Limpieza',
    'Conserjería',
    'Mantenimiento',
    'Cafetería',
    'Recepción',
    'Piscinero',
    'Oficios Varios'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          hojaVida: 'El archivo no debe superar los 5MB'
        }));
        return;
      }
      
      // Validar tipo de archivo
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          hojaVida: 'Solo se permiten archivos PDF y DOC/DOCX'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        hojaVida: file
      }));
      
      setErrors(prev => ({
        ...prev,
        hojaVida: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombreCompleto.trim()) {
      newErrors.nombreCompleto = 'El nombre completo es requerido';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo electrónico es requerido';
    } else if (!emailRegex.test(formData.correo)) {
      newErrors.correo = 'Ingresa un correo electrónico válido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (!formData.posicion || formData.posicion === 'Selecciona una posición') {
      newErrors.posicion = 'Selecciona una posición';
    }

    if (!formData.anosExperiencia.trim()) {
      newErrors.anosExperiencia = 'Los años de experiencia son requeridos';
    }

    if (!formData.hojaVida) {
      newErrors.hojaVida = 'La hoja de vida es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Formulario válido:', formData);
      // Aquí iría la lógica para enviar el formulario
      // Por ejemplo: enviar a una API
      
      // Resetear formulario
      setFormData({
        nombreCompleto: '',
        correo: '',
        telefono: '',
        posicion: '',
        anosExperiencia: '',
        hojaVida: null,
        comentarios: ''
      });
      
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      nombreCompleto: '',
      correo: '',
      telefono: '',
      posicion: '',
      anosExperiencia: '',
      hojaVida: null,
      comentarios: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre completo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo *
            </label>
            <input
              type="text"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              placeholder="Juan Pérez"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nombreCompleto ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.nombreCompleto && (
              <p className="text-red-500 text-xs mt-1">{errors.nombreCompleto}</p>
            )}
          </div>

          {/* Correo electrónico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico *
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="juan@ejemplo.com"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.correo ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.correo && (
              <p className="text-red-500 text-xs mt-1">{errors.correo}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono *
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+57 300 123 4567"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.telefono ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.telefono && (
              <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
            )}
          </div>

          {/* Posición de interés */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Posición de interés *
            </label>
            <select
              name="posicion"
              value={formData.posicion}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                errors.posicion ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {posiciones.map((pos, index) => (
                <option key={index} value={pos} disabled={index === 0}>
                  {pos}
                </option>
              ))}
            </select>
            {errors.posicion && (
              <p className="text-red-500 text-xs mt-1">{errors.posicion}</p>
            )}
          </div>

          {/* Años de experiencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Años de experiencia *
            </label>
            <input
              type="text"
              name="anosExperiencia"
              value={formData.anosExperiencia}
              onChange={handleChange}
              placeholder="Ej: 3 años"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.anosExperiencia ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.anosExperiencia && (
              <p className="text-red-500 text-xs mt-1">{errors.anosExperiencia}</p>
            )}
          </div>

          {/* Hoja de vida */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hoja de vida *
            </label>
            <div className={`border-2 border-dashed rounded-md p-6 text-center ${
              errors.hojaVida ? 'border-red-500' : 'border-gray-300'
            }`}>
              <input
                type="file"
                id="hojaVida"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              <label
                htmlFor="hojaVida"
                className="cursor-pointer flex flex-col items-center"
              >
                <svg
                  className="w-8 h-8 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  {formData.hojaVida ? formData.hojaVida.name : 'Haz clic para subir tu hoja de vida'}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PDF, DOC, DOCX (máx. 5MB)
                </span>
              </label>
            </div>
            {errors.hojaVida && (
              <p className="text-red-500 text-xs mt-1">{errors.hojaVida}</p>
            )}
          </div>

          {/* Cuéntanos sobre ti */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cuéntanos sobre ti (opcional)
            </label>
            <textarea
              name="comentarios"
              value={formData.comentarios}
              onChange={handleChange}
              placeholder="Experiencia, habilidades, disponibilidad..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Enviar Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SolicitudForm;