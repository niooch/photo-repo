import axios from 'axios';

// Podmień na URL swojego backendu (Node.js) – np.:
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const axiosInstance = axios.create({
  baseURL: BASE_URL + '/api',
  // Możesz tu dodać inne ustawienia, np. timeout, nagłówki domyślne, itp.
});

// Interceptor – jeśli token jest w localStorage, dodajemy go do nagłówka Authorization
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
