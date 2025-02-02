import React from 'react';
import NavBar from './NavBar';
import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';

function Layout({ isLoggedIn, onLogout, role }) {
  return (
    <>
      <NavBar isLoggedIn={isLoggedIn} onLogout={onLogout} role={role} />
      <Container sx={{ marginTop: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}

export default Layout;
