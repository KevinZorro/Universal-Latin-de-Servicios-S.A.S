// ClienteService.js
const API_URL = 'http://localhost:8080/api/clientes';

class ClienteService {

    /**
     * Obtiene todos los clientes
     */
    async getAllClientes() {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            throw error;
        }
    }

    /**
     * Obtiene un cliente por ID
     */
    async getClienteById(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error al obtener cliente con ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Crea un nuevo cliente
     */
    async createCliente(clienteData) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clienteData),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error al crear cliente:', error);
            throw error;
        }
    }

    /**
     * Elimina un cliente por ID
     */
    async deleteCliente(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error(`Error al eliminar cliente con ID ${id}:`, error);
            throw error;
        }
    }
}

export default new ClienteService();