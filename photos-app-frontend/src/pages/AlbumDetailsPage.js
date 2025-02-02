// src/pages/AlbumDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';
import axiosInstance from '../api/axiosInstance';

function AlbumDetailsPage() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('AlbumDetailsPage: useEffect, albumId:', albumId);
    fetchAlbumDetails();
  }, [albumId]);

  const fetchAlbumDetails = async () => {
    try {
      const res = await axiosInstance.get(`/albums/${albumId}`);
      console.log('AlbumDetailsPage: fetchAlbumDetails, res.data:', res.data);
      setAlbum(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load album details.');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {error && <Typography color="error">{error}</Typography>}
      {album ? (
        <>
          <Typography variant="h4" gutterBottom>Album: {album.album_name}</Typography>
          {album.photos && album.photos.length > 0 ? (
            <Grid container spacing={2}>
              {album.photos.map(photo => (
                <Grid item xs={12} sm={6} md={4} key={photo.photo_id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={`http://192.168.0.95:4000/${photo.photo_path}`}
                      alt={photo.description || 'Zdjęcie'}
                    />
                    <CardContent>
                      <Typography variant="body2">
                        {photo.description || 'Brak opisu'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>Brak zdjęć w tym albumie.</Typography>
          )}
        </>
      ) : (
        <Typography>Ładowanie szczegółów albumu...</Typography>
      )}
    </Box>
  );
}

export default AlbumDetailsPage;
