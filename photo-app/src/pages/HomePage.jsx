import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Welcome to PhotoApp</h1>
      <p>Manage and explore user photos with ease!</p>
      <nav>
        <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link> |{" "}
        <Link to="/gallery">Photo Gallery</Link>
      </nav>
    </div>
  );
}

export default HomePage;
