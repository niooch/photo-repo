import axios from 'axios';

const api = axios.create({
  baseURL: 'http://your-domain-or-ip/api',  // or local dev: 'http://localhost:3000/api'
});

// Add a request interceptor to attach the token if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
