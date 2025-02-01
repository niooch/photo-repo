// controllers/albumController.js
const pool = require('../config/db');

// CREATE
exports.createAlbum = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { album_name } = req.body;
    if (!album_name) {
      return res.status(400).json({ error: 'Album name is required.' });
    }
    await pool.query('INSERT INTO Album (user_id, album_name) VALUES (?, ?)', [userId, album_name]);
    return res.status(201).json({ message: 'Album created.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// READ
exports.getAlbums = async (req, res) => {
  try {
    const { role, userId } = req.user;
    let sql = 'SELECT * FROM Album';
    let params = [];
    if (role !== 'admin') {
      sql += ' WHERE user_id = ?';
      params.push(userId);
    }
    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.getAlbumById = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { albumId } = req.params;
    const [rows] = await pool.query('SELECT * FROM Album WHERE album_id = ?', [albumId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Album not found.' });
    }
    const album = rows[0];
    if (role !== 'admin' && album.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }
    return res.json(album);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// UPDATE
exports.updateAlbum = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { albumId } = req.params;
    const { album_name } = req.body;

    // Sprawdź, czy album istnieje
    const [rows] = await pool.query('SELECT * FROM Album WHERE album_id = ?', [albumId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Album not found.' });
    }
    const album = rows[0];
    if (role !== 'admin' && album.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    await pool.query('UPDATE Album SET album_name = ? WHERE album_id = ?', [
      album_name || album.album_name, albumId
    ]);
    return res.json({ message: 'Album updated.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// DELETE
exports.deleteAlbum = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { albumId } = req.params;
    const [rows] = await pool.query('SELECT * FROM Album WHERE album_id = ?', [albumId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Album not found.' });
    }
    const album = rows[0];
    if (role !== 'admin' && album.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    await pool.query('DELETE FROM Album WHERE album_id = ?', [albumId]);
    return res.json({ message: 'Album deleted.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Dodanie zdjęcia do albumu
exports.addPhotoToAlbum = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { albumId, photoId } = req.params;

    // Sprawdzamy, czy album należy do usera (chyba że admin)
    const [albumRows] = await pool.query('SELECT * FROM Album WHERE album_id = ?', [albumId]);
    if (albumRows.length === 0) {
      return res.status(404).json({ error: 'Album not found.' });
    }
    const album = albumRows[0];
    if (role !== 'admin' && album.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied (album).' });
    }

    // Sprawdzamy, czy zdjęcie istnieje i należy do usera (chyba że admin)
    const [photoRows] = await pool.query('SELECT * FROM Photo WHERE photo_id = ?', [photoId]);
    if (photoRows.length === 0) {
      return res.status(404).json({ error: 'Photo not found.' });
    }
    const photo = photoRows[0];
    if (role !== 'admin' && photo.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied (photo).' });
    }

    // Wstawiamy do tabeli pośredniej AlbumPhoto
    await pool.query('INSERT INTO AlbumPhoto (album_id, photo_id) VALUES (?,?)', [albumId, photoId]);
    return res.json({ message: 'Photo added to album.' });
  } catch (error) {
    // Możliwe, że duplikat (album_id, photo_id) już istnieje -> handle error 1062
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Photo already in this album.' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Usunięcie zdjęcia z albumu
exports.removePhotoFromAlbum = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { albumId, photoId } = req.params;

    // Sprawdzamy album
    const [albumRows] = await pool.query('SELECT * FROM Album WHERE album_id = ?', [albumId]);
    if (albumRows.length === 0) {
      return res.status(404).json({ error: 'Album not found.' });
    }
    const album = albumRows[0];
    if (role !== 'admin' && album.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied (album).' });
    }

    // Sprawdzamy zdjęcie
    const [photoRows] = await pool.query('SELECT * FROM Photo WHERE photo_id = ?', [photoId]);
    if (photoRows.length === 0) {
      return res.status(404).json({ error: 'Photo not found.' });
    }
    const photo = photoRows[0];
    if (role !== 'admin' && photo.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied (photo).' });
    }

    // Usuwamy z tabeli AlbumPhoto
    await pool.query('DELETE FROM AlbumPhoto WHERE album_id = ? AND photo_id = ?', [albumId, photoId]);
    return res.json({ message: 'Photo removed from album.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
