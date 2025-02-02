// controllers/photoController.js
const pool = require('../config/db');

exports.createPhotos = async (req, res) => {
  try {
    const userId = req.user.userId;

    // req.files – tablica plików
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No photo files uploaded.' });
    }

    // Jeżeli masz jedno wspólne pole "description"
    // (zależy, czy wysyłasz w formData np. formData.append('description', opis))
    const { description } = req.body;

    // Wstawianie do bazy w pętli
    for (const file of req.files) {
      const photoPath = file.path;
      // Zapis do bazy – prosty przykład
      await pool.query(
        `INSERT INTO Photo (user_id, photo_path, description) VALUES (?, ?, ?)`,
        [userId, photoPath, description || null]
      );
    }

    return res.status(201).json({ message: 'Photos uploaded successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.getPhotos = async (req, res) => {
  try {
    const { role, userId } = req.user;

    // Załóżmy, że admin widzi wszystkie zdjęcia, user – tylko swoje
    let sql = 'SELECT * FROM Photo';
    let params = [];

    if (role !== 'admin') {
      sql += ' WHERE user_id = ?';
      params.push(userId);
    }

    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.getPhotoById = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { photoId } = req.params;

    const [rows] = await pool.query('SELECT * FROM Photo WHERE photo_id = ?', [photoId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Photo not found.' });
    }
    const photo = rows[0];

    // Sprawdzamy dostęp
    if (role !== 'admin' && photo.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    return res.json(photo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.updatePhoto = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { photoId } = req.params;
    const { device_id, description } = req.body;

    // Pobieramy zdjęcie
    const [rows] = await pool.query('SELECT * FROM Photo WHERE photo_id = ?', [photoId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Photo not found.' });
    }
    const photo = rows[0];

    // Sprawdzamy dostęp
    if (role !== 'admin' && photo.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // Aktualizujemy
    const sql = `UPDATE Photo SET device_id = ?, description = ? WHERE photo_id = ?`;
    await pool.query(sql, [device_id || photo.device_id, description || photo.description, photoId]);

    return res.json({ message: 'Photo updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const fs = require('fs');
const path = require('path');

exports.deletePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { role, userId } = req.user;

    // Szukamy zdjęcia
    const [rows] = await pool.query('SELECT * FROM Photo WHERE photo_id = ?', [photoId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Photo not found.' });
    }
    const photo = rows[0];

    // Sprawdzamy, czy user to admin lub właściciel zdjęcia
    if (role !== 'admin' && photo.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // Usuwamy rekord z bazy
    await pool.query('DELETE FROM Photo WHERE photo_id = ?', [photoId]);

    // Usuwamy fizyczny plik z dysku
    // Ścieżka zapisana w photo.photo_path, np. "uploads/..."
    const filePath = path.join(__dirname, '..', photo.photo_path);
    // __dirname -> katalog controllers/, więc '..' wychodzi poziom wyżej
    // Uwaga: sprawdź, czy musisz użyć innego łączenia ścieżek

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Failed to remove file from disk:', err);
        // Możesz nadal zwrócić 200, bo sam rekord w bazie został usunięty
      }
    });

    return res.json({ message: 'Photo deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.setPhotoPublic = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { isPublic } = req.body; // np. { isPublic: true }
    const { userId, role } = req.user;

    const [rows] = await pool.query('SELECT * FROM Photo WHERE photo_id = ?', [photoId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Photo not found.' });
    }
    const photo = rows[0];

    if (role !== 'admin' && photo.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // zmiana 1/0
    await pool.query('UPDATE Photo SET is_public = ? WHERE photo_id = ?', [isPublic ? 1 : 0, photoId]);

    return res.json({ message: 'Photo visibility updated.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.getPublicPhotos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Photo WHERE is_public = 1');
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
