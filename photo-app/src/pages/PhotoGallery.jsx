import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // your Axios instance

function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/photos')  // Adjust endpoint to match your API
      .then(response => {
        setPhotos(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching photos:', error);
        setLoading(false);
      });
  }, []);

  const handlePhotoClick = (photoId) => {
    // Navigate to details page with that photo's ID
    navigate(`/photos/${photoId}`);
  };

  if (loading) return <p>Loading photos...</p>;

  return (
    <div>
      <h2>Photo Gallery</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {photos.map(photo => (
          <div
            key={photo.photo_id}
            style={{ cursor: 'pointer' }}
            onClick={() => handlePhotoClick(photo.photo_id)}
          >
            <img
              src={photo.photo_path}
              alt={photo.description || 'photo'}
              style={{ width: '200px', height: 'auto' }}
            />
            <p>{photo.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhotoGallery;
