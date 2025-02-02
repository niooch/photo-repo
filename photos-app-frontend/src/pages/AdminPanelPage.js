// src/pages/AdminPanelPage.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AdminPanelPage({ role }) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Jeśli nie admin, wróć do dashboard
    if (role !== 'admin') {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [role]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/users'); // tu endpoint do pobierania wszystkich userów
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId) => {
    // np. DELETE /users/:id
    try {
      await axiosInstance.delete(`/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Admin Panel</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(u => (
            <TableRow key={u.user_id}>
              <TableCell>{u.user_id}</TableCell>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell>
                {u.role !== 'admin' && (
                  <Button color="error" onClick={() => handleDeleteUser(u.user_id)}>
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default AdminPanelPage;
