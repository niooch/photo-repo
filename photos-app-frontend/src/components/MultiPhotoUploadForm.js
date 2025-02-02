// src/components/MultiPhotoUploadForm.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axiosInstance from '../api/axiosInstance';

function MultiPhotoUploadForm({ onUploadSuccess }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const handleFilesChange = (e) => {
    // e.target.files to FileList
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one file.');
      return;
    }
    try {
      const formData = new FormData();
      // Dodajemy wszystkie pliki do formData
      selectedFiles.forEach((file) => {
        formData.append('photos', file);
      });
      // Dodatkowe pole (description)
      formData.append('description', description);

      await axiosInstance.post('/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSelectedFiles([]);
      setDescription('');
      setError(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error(err);
      setError('Failed to upload photos.');
    }
  };

  return (
    <Box sx={{ border: '1px solid #ccc', p: 2, borderRadius: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Upload Multiple Photos</Typography>

      {error && <Typography color="error">{error}</Typography>}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        <Button variant="contained" component="label">
          Select Files
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleFilesChange}
          />
        </Button>

        {selectedFiles.length > 0 && (
          <Typography>{selectedFiles.length} files selected</Typography>
        )}

        <TextField
          label="Description"
          multiline
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button variant="contained" onClick={handleUpload}>Upload</Button>
      </Box>
    </Box>
  );
}

export default MultiPhotoUploadForm;
