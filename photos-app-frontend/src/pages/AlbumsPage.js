// src/pages/AlbumsPage.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Card, CardContent } from '@mui/material';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

function AlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const [albumName, setAlbumName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAlbums = async () => {
    try {
      const res = await axiosInstance.get('/albums');
      setAlbums(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch albums.');
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleCreateAlbum = async () => {
    if (!albumName.trim()) return;
    try {
      await axiosInstance.post('/albums', { album_name: albumName });
      setAlbumName('');
      fetchAlbums();
    } catch (err) {
      console.error(err);
      setError('Failed to create album.');
    }
  };

  const handleAlbumClick = (albumId) => {
    navigate(`/albums/${albumId}`);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Albumy</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Nazwa nowego albumu"
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleCreateAlbum}>Utwórz album</Button>
      </Box>
      <Grid container spacing={2}>
        {albums.map(album => (
          <Grid item xs={12} sm={6} md={4} key={album.album_id}>
            <Card sx={{ cursor: 'pointer' }} onClick={() => handleAlbumClick(album.album_id)}>
              <CardContent>
                <Typography variant="h6">{album.album_name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AlbumsPage;
