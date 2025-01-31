import React, { useState } from 'react';
import api from '../services/api';

function UploadPhotoPage() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) return;

    // Usually you'd use FormData for file uploads
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('description', description);

    api.post('/photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(response => {
        alert('Photo uploaded successfully!');
        // Optionally, redirect or clear form
      })
      .catch(error => {
        console.error('Error uploading photo:', error);
      });
  };

  return (
    <div>
      <h2>Upload New Photo</h2>
      <form onSubmit={handleUpload}>
        <div>
          <label>Choose file:</label>
          <input type="file" onChange={handleFileChange} accept="image/*" />
        </div>
        <div>
          <label>Description: </label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        {/* You could add device, tags, album selection, etc. here */}

        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default UploadPhotoPage;
