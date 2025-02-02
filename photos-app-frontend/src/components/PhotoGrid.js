// src/components/PhotoGrid.js
import React from 'react';
import { Grid } from '@mui/material';
import PhotoCard from './PhotoCard';

function PhotoGrid({ photos }) {
  return (
    <Grid container spacing={2}>
      {photos.map((photo) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={photo.photo_id}>
          <PhotoCard photo={photo} />
        </Grid>
      ))}
    </Grid>
  );
}

export default PhotoGrid;
