import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Typography, Box } from '@mui/material';
import PhotoGrid from '../components/PhotoGrid';
import MultiPhotoUploadForm from '../components/MultiPhotoUploadForm';

function PhotosPage() {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);

  // Pobierz zdjęcia po zamontowaniu
  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await axiosInstance.get('/photos');
      setPhotos(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch photos.');
    }
  };

  // Po pomyślnym uploadzie, odświeżamy listę
  const handleUploadSuccess = () => {
    fetchPhotos();
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Your Photos
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <MultiPhotoUploadForm onUploadSuccess={handleUploadSuccess} />

      <Box sx={{ mt: 4 }}>
        <PhotoGrid photos={photos} />
      </Box>
    </Box>
  );
}

export default PhotosPage;
