// controllers/photoController.js
const pool = require('../config/db');

exports.createPhoto = async (req, res) => {
  try {
    const userId = req.user.userId;
    // multer przesyła plik w req.file
    // np. req.file.path to ścieżka do zapisanego zdjęcia
    if (!req.file) {
      return res.status(400).json({ error: 'No photo file uploaded.' });
    }

    const { device_id, description } = req.body;
    const photoPath = req.file.path; // np. "uploads/1675266567_photo.jpg"

    // Wstawiamy do bazy
    const sql = `INSERT INTO Photo (user_id, device_id, photo_path, description) VALUES (?,?,?,?)`;
    await pool.query(sql, [userId, device_id || null, photoPath, description || null]);

    return res.status(201).json({ message: 'Photo uploaded successfully.' });
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

exports.deletePhoto = async (req, res) => {
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

    // Usuwamy rekord
    await pool.query('DELETE FROM Photo WHERE photo_id = ?', [photoId]);

    // (Opcjonalnie) Usuwamy plik z dysku, np. fs.unlinkSync(photo.photo_path)
    // ale to już kwestia dodatkowego zaimplementowania

    return res.json({ message: 'Photo deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
