import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', // Asumiendo que tu Nest corre en el 3000
});

// Interceptor para inyectar el token en cada petición automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Requisito: Guardar token [cite: 33]
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Requisito: Uso de Authorization Bearer 
    }
    return config;
});

export default api;