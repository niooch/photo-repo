// src/pages/PhotoDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Box, Typography, TextField, Button, Chip } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function PhotoDetailsPage() {
  const { id } = useParams(); // Teraz id jest poprawnie ustawione
  const [photoData, setPhotoData] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState(null);
  const [userAlbums, setUserAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('');

  useEffect(() => {
    fetchPhotoDetails();
  }, [id]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await axiosInstance.get('/albums');
        setUserAlbums(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAlbums();
  }, []);

  const fetchPhotoDetails = async () => {
    try {
      const res = await axiosInstance.get(`/photos/${id}`);
      setPhotoData(res.data);
    } catch (err) {
      console.error(err);
      setError('Nie udało się pobrać szczegółów zdjęcia.');
    }
  };


  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  if (!photoData) {
    return <Typography>Ładowanie szczegółów zdjęcia...</Typography>;
  }

  const handleAddPhotoToAlbum = async () => {
    if (!selectedAlbum) return;
    try {
      await axiosInstance.post(`/albums/${selectedAlbum}/photos/${id}`);
      alert('Zdjęcie dodane do albumu!');
    } catch (err) {
      console.error(err);
      setError('Nie udało się dodać zdjęcia do albumu.');
    }
  };
  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    try {
      console.log('newTag', newTag);
      await axiosInstance.post(`/photos/${id}/tags`, { tagName: newTag.trim() });
      console.log('Tag dodany');
      setNewTag('');
      fetchPhotoDetails();
    } catch (err) {
      console.error(err);
      setError('Nie udało się dodać tagu.');
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  if (!photoData) {
    return <Typography>Ładowanie szczegółów zdjęcia...</Typography>;
  }
return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Szczegóły zdjęcia</Typography>
      <Box sx={{ my: 2 }}>
        <img
          src={`http://192.168.0.95:4000/${photoData.photo_path}`}
          alt={photoData.description || 'Zdjęcie'}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </Box>
      <Typography variant="body1" gutterBottom>
        Opis: {photoData.description || 'Brak opisu'}
      </Typography>
      <Box sx={{ my: 2 }}>
        <Typography variant="h6">Tagi:</Typography>
        {photoData.tags && photoData.tags.length > 0 ? (
          photoData.tags.map(tag => (
            <Chip key={tag.tag_id} label={tag.tag_name} variant="outlined" sx={{ mr: 1, mb: 1 }} />
          ))
        ) : (
          <Typography variant="body2">Brak tagów</Typography>
        )}
      </Box>
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Dodaj nowy tag"
          variant="outlined"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleAddTag}>
          Dodaj tag
        </Button>
      </Box>
      {/* Sekcja dodania zdjęcia do albumu */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Dodaj zdjęcie do albumu:</Typography>
        <FormControl sx={{ minWidth: 200, mr: 2 }}>
          <InputLabel id="album-select-label">Album</InputLabel>
          <Select
            labelId="album-select-label"
            value={selectedAlbum}
            label="Album"
            onChange={(e) => setSelectedAlbum(e.target.value)}
          >
            {userAlbums.map(album => (
              <MenuItem key={album.album_id} value={album.album_id}>
                {album.album_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleAddPhotoToAlbum}>
          Dodaj do albumu
        </Button>
      </Box>
    </Box>
  );
}

export default PhotoDetailsPage;
