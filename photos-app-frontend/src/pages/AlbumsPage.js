// src/pages/AlbumsPage.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Button, TextField, Card, CardContent, Typography, Grid } from '@mui/material';

function AlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const [albumName, setAlbumName] = useState('');

  const fetchAlbums = async () => {
    try {
      const response = await axiosInstance.get('/albums');
      setAlbums(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAlbum = async () => {
    try {
      await axiosInstance.post('/albums', {
        album_name: albumName
      });
      setAlbumName('');
      fetchAlbums(); // odśwież listę
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Albums
      </Typography>

      <div style={{ marginBottom: 20 }}>
        <TextField
          label="Album Name"
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <Button variant="contained" onClick={handleCreateAlbum}>
          Create Album
        </Button>
      </div>

      <Grid container spacing={2}>
        {albums.map(album => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={album.album_id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {album.album_name}
                </Typography>
                {/* przyciski do edycji, usuwania,
                    wyświetlania zdjęć w albumie itp. */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default AlbumsPage;
