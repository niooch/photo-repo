import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

function PhotoCard({ photo, onDeleteSuccess }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/photos/${photo.photo_id}`);
  };
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/photos/${photo.photo_id}`);
      // powiadom rodzica, że zdjęcie usunięto
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (err) {
      console.error(err);
      alert('Failed to delete photo.');
    }
  };
    const togglePublic = async () => {
      try {
        const newValue = !photo.is_public;
        await axiosInstance.put(`/photos/${photo.photo_id}/public`, {
          isPublic: newValue
        });
        // odśwież komponent lub uaktualnij stan
      } catch (err) {
        console.error(err);
        alert('Failed to update photo visibility');
      }
    };


  return (
    <Card onClick={handleClick} sx={{ cursor: 'pointer' }}>
      <CardMedia
        component="img"
        height="200"
        image={`http://192.168.0.95:4000/${photo.photo_path}`}
        alt={photo.description || 'Photo'}
      />
      <CardContent>
        <Typography variant="body1">
          {photo.description || 'No description'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="error" onClick={handleDelete}>
          Delete
        </Button>
        <Button onClick={togglePublic}>
         {photo.is_public ? 'Make Private' : 'Make Public'}
        </Button>
      </CardActions>
    </Card>
  );
}

export default PhotoCard;
