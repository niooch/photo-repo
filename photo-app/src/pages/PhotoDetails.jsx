import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function PhotoDetails() {
  const { photoId } = useParams();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/photos/${photoId}`)
      .then(response => {
        setPhoto(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching photo details:', error);
        setLoading(false);
      });
  }, [photoId]);

  if (loading) return <p>Loading details...</p>;
  if (!photo) return <p>Photo not found.</p>;

  return (
    <div>
      <h2>Photo Details</h2>
      <img
        src={photo.photo_path}
        alt={photo.description || 'photo'}
        style={{ maxWidth: '600px', height: 'auto' }}
      />
      <p><strong>Description:</strong> {photo.description}</p>
      {photo.device && (
        <p><strong>Device Used:</strong> {photo.device.device_name}</p>
      )}
      <p><strong>Uploaded By:</strong> {photo.user_id}</p>
      <p><strong>Tags:</strong> {photo.tags?.join(', ')}</p>
      {/* If you have comments, you can list them here */}
    </div>
  );
}

export default PhotoDetails;
