import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import PhotoGallery from './pages/PhotoGallery';
import PhotoDetails from './pages/PhotoDetails';
import AlbumsPage from './pages/AlbumsPage';
import UploadPhotoPage from './pages/UploadPhotoPage';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/gallery" element={<PhotoGallery />} />
        <Route path="/photos/:photoId" element={<PhotoDetails />} />

        {/* Could be protected by role-based logic */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user" element={<UserDashboard />} />

        {/* Authenticated user routes */}
        <Route path="/albums" element={<AlbumsPage />} />
        <Route path="/upload" element={<UploadPhotoPage />} />

        {/* Catch-all */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
