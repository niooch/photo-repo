// src/pages/PublicPhotosPage.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import PhotoGrid from '../components/PhotoGrid'; // reużywalny komponent
import { Typography, Box } from '@mui/material';

function PublicPhotosPage() {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublicPhotos();
  }, []);

  const fetchPublicPhotos = async () => {
    try {
      const res = await axiosInstance.get('/photos/public');
      setPhotos(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load public photos.');
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Public Photos
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <PhotoGrid photos={photos} />
    </Box>
  );
}

export default PublicPhotosPage;
