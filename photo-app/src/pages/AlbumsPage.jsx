import React, { useEffect, useState } from 'react';
import api from '../services/api';

function AlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const [albumName, setAlbumName] = useState('');

  useEffect(() => {
    // Fetch user’s albums
    api.get('/albums')  // e.g., GET /albums for current user
      .then(response => setAlbums(response.data))
      .catch(error => console.error('Error fetching albums:', error));
  }, []);

  const handleCreateAlbum = () => {
    if (!albumName.trim()) return;
    api.post('/albums', { name: albumName })
      .then(response => {
        setAlbums([...albums, response.data]); // response.data is the newly created album
        setAlbumName('');
      })
      .catch(error => console.error('Error creating album:', error));
  };

  const handleDeleteAlbum = (albumId) => {
    api.delete(`/albums/${albumId}`)
      .then(() => {
        setAlbums(albums.filter(a => a.album_id !== albumId));
      })
      .catch(error => console.error('Error deleting album:', error));
  };

  return (
    <div>
      <h2>My Albums</h2>

      <div>
        <input
          type="text"
          placeholder="New album name"
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
        />
        <button onClick={handleCreateAlbum}>Create Album</button>
      </div>

      <ul>
        {albums.map(album => (
          <li key={album.album_id}>
            {album.album_name}
            <button onClick={() => handleDeleteAlbum(album.album_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlbumsPage;
