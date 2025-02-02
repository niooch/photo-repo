import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

function NavBar({ isLoggedIn, onLogout, role }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          PhotoApp
        </Typography>

        {/* Linki / przyciski nawigacyjne */}
        {isLoggedIn ? (
          <>
            <Button color="inherit" component={Link} to="/">Dashboard</Button>
            <Button color="inherit" component={Link} to="/public-photos">Public Photos</Button>
            <Button color="inherit" component={Link} to="/photos">Photos</Button>
            <Button color="inherit" component={Link} to="/devices">Devices</Button>
            <Button color="inherit" component={Link} to="/albums">Albums</Button>
            {role === 'admin' && (
              <Button color="inherit" component={Link} to="/admin">Admin Panel</Button>
            )}
            <Button color="inherit" onClick={onLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
