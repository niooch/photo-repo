// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Typography, Box, Card, CardContent } from '@mui/material';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

    useEffect(() => {
        fetchMe();
    }, []);

  useEffect(() => {
      if (userId) {
        fetchStats();
      }
  }, [userId]);

    const fetchMe = async () => {
        try {
            const res = await axiosInstance.get('/users/me');
            setUserId(res.data.user_id);
        } catch (err) {
            console.error(err);
            setError('Failed to load user');
        }
    }

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get(`/users/${userId}/stats`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load stats');
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      {error && <Typography color="error">{error}</Typography>}

      {stats && (
        <Card sx={{ width: 300 }}>
          <CardContent>
            <Typography variant="h6">Your Stats</Typography>
            <Typography>Total Photos: {stats.totalPhotos}</Typography>
            <Typography>Total Albums: {stats.totalAlbums}</Typography>
            <Typography>Public Photos: {stats.totalPublicPhotos}</Typography>
          </CardContent>
        </Card>
      )}

      {/* Możesz dodać więcej rzeczy: np. linki do /photos, /albums, itp. */}
    </Box>
  );
}

export default Dashboard;
