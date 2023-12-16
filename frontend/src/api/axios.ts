import axios from 'axios';
import { API_URL } from '../configs/config';

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Registrar el middleware
instance.interceptors.request.use(
  function (config) {
    // Obtener el token desde algún lugar (por ejemplo, desde localStorage)
    const token = localStorage.getItem('token');

    // Verificar si el token existe
    if (token) {
      // Agregar el token al encabezado de autorización
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
