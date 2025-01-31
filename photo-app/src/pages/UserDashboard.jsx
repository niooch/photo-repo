import React, { useEffect, useState } from 'react';
import api from '../services/api';

function UserDashboard() {
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // 1) Get user's photos
    api.get('/photos/mine')
       .then(res => setPhotos(res.data))
       .catch(err => console.error(err));

    // 2) Get user's albums
    api.get('/albums')
       .then(res => setAlbums(res.data))
       .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>User Dashboard</h2>

      <section>
        <h3>Your Photos</h3>
        <div className="photo-grid">
          {photos.map(photo => (
            <div key={photo.photo_id} className="photo-item">
              <img src={photo.photo_path} alt={photo.description} />
              <p>{photo.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>Your Albums</h3>
        <ul>
          {albums.map(album => (
            <li key={album.album_id}>{album.album_name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default UserDashboard;
