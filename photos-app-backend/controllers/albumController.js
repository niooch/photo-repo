// controllers/albumController.js
const pool = require('../config/db');

exports.createAlbum = async (req, res) => {
  try {
    const { album_name } = req.body;
    const { userId } = req.user;
    if (!album_name || album_name.trim() === '') {
      return res.status(400).json({ error: 'Album name is required.' });
    }
    const [result] = await pool.query(
      'INSERT INTO Album (user_id, album_name) VALUES (?, ?)',
      [userId, album_name]
    );
    return res.status(201).json({ message: 'Album created successfully.', album_id: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.getAlbums = async (req, res) => {
  try {
    console.log('getAlbums');
    const { userId, role } = req.user;
    let sql = 'SELECT * FROM Album';
    let params = [];
    // Jeśli użytkownik nie jest adminem, wyświetlamy tylko swoje albumy
    if (role !== 'admin') {
      sql += ' WHERE user_id = ?';
      params.push(userId);
    }
    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.getAlbumDetails = async (req, res) => {
  try {
    console.log('getAlbumDetails');
    const { albumId } = req.params;
    const { userId, role } = req.user;
    // Pobieramy album
    const [albumRows] = await pool.query('SELECT * FROM Album WHERE album_id = ?', [albumId]);
    if (albumRows.length === 0) {
      return res.status(404).json({ error: 'Album not found.' });
    }
    const album = albumRows[0];
    // Jeśli użytkownik nie jest adminem i album nie należy do niego
    if (role !== 'admin' && album.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }
    // Pobieramy zdjęcia z albumu – łączymy tabelę AlbumPhoto z Photo
    const [photoRows] = await pool.query(
      `
      SELECT p.*
      FROM AlbumPhoto ap
      JOIN Photo p ON ap.photo_id = p.photo_id
      WHERE ap.album_id = ?
      `,
      [albumId]
    );
    album.photos = photoRows;
    return res.json(album);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.addPhotoToAlbum = async (req, res) => {
  try {
    const { albumId, photoId } = req.params;
    const { userId, role } = req.user;
    // Sprawdzamy, czy album istnieje
    const [albumRows] = await pool.query('SELECT * FROM Album WHERE album_id = ?', [albumId]);
    if (albumRows.length === 0) {
      return res.status(404).json({ error: 'Album not found.' });
    }
    const album = albumRows[0];
    // Sprawdzamy uprawnienia – tylko właściciel albumu lub admin
    if (role !== 'admin' && album.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }
    // Sprawdzamy, czy zdjęcie istnieje
    const [photoRows] = await pool.query('SELECT * FROM Photo WHERE photo_id = ?', [photoId]);
    if (photoRows.length === 0) {
      return res.status(404).json({ error: 'Photo not found.' });
    }
    // Dodajemy rekord do AlbumPhoto – jeśli już istnieje, zwracamy konflikt
    try {
      await pool.query('INSERT INTO AlbumPhoto (album_id, photo_id) VALUES (?, ?)', [albumId, photoId]);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Photo already in album.' });
      } else {
        throw err;
      }
    }
    return res.status(201).json({ message: 'Photo added to album successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
