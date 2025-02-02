// src/pages/RegisterPage.js
import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axiosInstance.post('/users/register', formData);
      // Jeśli rejestracja OK, przekierujmy do /login
      navigate('/login');
    } catch (err) {
      console.error(err);
      console.log('dupa');
      if (err.response) {
        setError(err.response.data.error || 'Registration failed');
      } else {
        setError('Something went wrong.');
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
