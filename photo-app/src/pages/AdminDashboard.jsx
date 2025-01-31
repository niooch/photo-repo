import React, { useEffect, useState } from 'react';
import api from '../services/api';

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch all users
    api.get('/admin/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDeleteUser = (userId) => {
    api.delete(`/admin/users/${userId}`)
      .then(() => {
        // Filter out the deleted user from local state
        setUsers(users.filter(user => user.user_id !== userId));
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>User Management</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.user_id}>
              <td>{u.user_id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => handleDeleteUser(u.user_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
