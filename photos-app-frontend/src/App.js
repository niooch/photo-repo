// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axiosInstance from './api/axiosInstance';

// Komponenty Layout / Strony
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PhotosPage from './pages/PhotosPage';
import DevicesPage from './pages/DevicesPage';
import AlbumsPage from './pages/AlbumsPage';
import AdminPanelPage from './pages/AdminPanelPage';
import PublicPhotosPage from './pages/PublicPhotosPage';

function App() {
  // Przechowujemy token + role w stanie
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(null);

  // Sprawdzanie roli z backendu (opcjonalnie) po zalogowaniu
  const fetchUserRole = async () => {
    if (!token) return;
    try {
      // Zakładamy, że mamy endpoint np. /api/users/me zwracający dane usera
      const response = await axiosInstance.get('/users/me');
      setRole(response.data.role);
    } catch (err) {
      console.error(err);
      // jeśli błąd, to może token jest nieprawidłowy
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setRole(null);
  };

  const isLoggedIn = Boolean(token);

  return (
    <BrowserRouter>
      <Routes>
        {/* Layout - dostępny w większości tras */}
        <Route
          path="/"
          element={
            <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout} role={role} />
          }
        >
          {/* Wewnątrz Layoutu wyrenderują się podstrony w <Outlet/> */}
          <Route index element={<Dashboard />} />
          <Route path="public-photos" element={<PublicPhotosPage />} />
          <Route path="photos" element={<PhotosPage />} />
          <Route path="devices" element={<DevicesPage />} />
          <Route path="albums" element={<AlbumsPage />} />
          <Route path="admin" element={<AdminPanelPage role={role} />} />
        </Route>

        {/* Logowanie / Rejestracja mogą być poza Layoutem,
            lub wewnątrz – zależnie od designu */}
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* W razie nieznanej ścieżki */}
        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
