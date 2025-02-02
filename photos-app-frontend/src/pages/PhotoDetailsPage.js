// src/pages/PhotoDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

function PhotoDetailsPage() {
  // Używamy parametru id – upewnij się, że trasa jest zdefiniowana jako "/photos/:id"
  const { id } = useParams();
  const [photoData, setPhotoData] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState(null);

  // Listy potrzebne do przypisania zdjęcia do albumu oraz ustawienia urządzenia
  const [userAlbums, setUserAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');

  // Pobieramy dane zdjęcia, urządzenia i albumy przy zmianie id
  useEffect(() => {
    fetchPhotoDetails();
    fetchDevices();
    fetchUserAlbums();
  }, [id]);

  const fetchPhotoDetails = async () => {
    try {
      const res = await axiosInstance.get(`/photos/${id}`);
      setPhotoData(res.data);
      console.log('Fetched photoData:', res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load photo details.');
    }
  };

  const fetchDevices = async () => {
    try {
      const res = await axiosInstance.get('/devices');
      setDevices(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load devices.');
    }
  };

  const fetchUserAlbums = async () => {
    try {
      const res = await axiosInstance.get('/albums');
      setUserAlbums(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load albums.');
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    try {
      await axiosInstance.post(`/photos/${id}/tags`, { tagName: newTag.trim() });
      setNewTag('');
      fetchPhotoDetails(); // Odświeżamy szczegóły zdjęcia, by zobaczyć nowo dodany tag
    } catch (err) {
      console.error(err);
      setError('Failed to add tag.');
    }
  };

  const handleAddPhotoToAlbum = async () => {
    if (!selectedAlbum) return;
    try {
      await axiosInstance.post(`/albums/${selectedAlbum}/photos/${id}`);
      alert('Photo added to album!');
      fetchPhotoDetails();
    } catch (err) {
      console.error(err);
      setError('Failed to add photo to album.');
    }
  };

  const handleUpdateDevice = async () => {
    if (!selectedDevice) return;
    try {
      await axiosInstance.put(`/photos/${id}/device`, { device_id: selectedDevice });
      alert('Device updated for photo!');
      fetchPhotoDetails();
    } catch (err) {
      console.error(err);
      setError('Failed to update device for photo.');
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  if (!photoData) {
    return <Typography>Loading photo details...</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Photo Details</Typography>
      <Box sx={{ my: 2 }}>
        <img
          src={`http://192.168.0.95:4000/${photoData.photo_path}`}
          alt={photoData.description || 'Photo'}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </Box>
      <Typography variant="body1" gutterBottom>
        Description: {photoData.description || 'No description'}
      </Typography>

      {/* Tagi */}
      <Box sx={{ my: 2 }}>
        <Typography variant="h6">Tags:</Typography>
        {photoData.tags && photoData.tags.length > 0 ? (
          photoData.tags.map(tag => (
            <Chip
              key={tag.tag_id}
              label={tag.tag_name}
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
            />
          ))
        ) : (
          <Typography variant="body2">No tags</Typography>
        )}
      </Box>
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Add a new tag"
          variant="outlined"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleAddTag}>Add Tag</Button>
      </Box>

      {/* Wyświetlanie albumu, do którego należy zdjęcie */}
      <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Albumy:</Typography>
          {photoData.albums && photoData.albums.length > 0 ? (
            photoData.albums.map(album => (
              <Typography key={album.album_id} variant="body1">
                {album.album_name}
              </Typography>
            ))
          ) : (
            <Typography variant="body2">Nie przypisano do żadnego albumu</Typography>
          )}
      </Box>

      {/* Sekcja dodania zdjęcia do albumu */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Add photo to album:</Typography>
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
          Add to Album
        </Button>
      </Box>

      {/* Wyświetlanie informacji o urządzeniu */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Device used:</Typography>
        {photoData.device ? (
          <Typography variant="body1">
            {photoData.device.device_name} ({photoData.device.device_type})
          </Typography>
        ) : (
          <Typography variant="body2">No device assigned</Typography>
        )}
      </Box>

      {/* Sekcja ustawienia urządzenia dla zdjęcia */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Set Device for Photo:</Typography>
        <FormControl sx={{ minWidth: 200, mr: 2 }}>
          <InputLabel id="device-select-label">Device</InputLabel>
          <Select
            labelId="device-select-label"
            value={selectedDevice}
            label="Device"
            onChange={(e) => setSelectedDevice(e.target.value)}
          >
            {devices.map(device => (
              <MenuItem key={device.device_id} value={device.device_id}>
                {device.device_name} ({device.device_type})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleUpdateDevice}>Set Device</Button>
      </Box>
    </Box>
  );
}

export default PhotoDetailsPage;
