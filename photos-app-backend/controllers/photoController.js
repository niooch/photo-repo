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

    // Pobranie podstawowych danych zdjęcia
    const [photoRows] = await pool.query(
      'SELECT * FROM Photo WHERE photo_id = ?',
      [photoId]
    );
    if (photoRows.length === 0) {
      return res.status(404).json({ error: 'Photo not found.' });
    }
    const photo = photoRows[0];

    // Sprawdzenie uprawnień – użytkownik musi być właścicielem lub być adminem
    if (role !== 'admin' && photo.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // Pobranie tagów przypisanych do zdjęcia
    const [tagRows] = await pool.query(
      `SELECT t.tag_id, t.tag_name
       FROM PhotoTag pt
       JOIN Tag t ON pt.tag_id = t.tag_id
       WHERE pt.photo_id = ?`,
      [photoId]
    );

    // Pobranie albumów, do których przypisane jest zdjęcie (może być więcej niż jeden)
    const [albumRows] = await pool.query(
      `SELECT a.album_id, a.album_name
       FROM AlbumPhoto ap
       JOIN Album a ON ap.album_id = a.album_id
       WHERE ap.photo_id = ?`,
      [photoId]
    );

    // Pobranie danych urządzenia, jeśli zdjęcie ma ustawione device_id
    let device = null;
    if (photo.device_id) {
      const [deviceRows] = await pool.query(
        'SELECT device_id, device_name, device_type FROM Device WHERE device_id = ?',
        [photo.device_id]
      );
      if (deviceRows.length > 0) {
        device = deviceRows[0];
      }
    }

    // Zwracamy obiekt łączący wszystkie dane
    return res.json({
      ...photo,        // pola zdjęcia (photo_id, photo_path, description, user_id, device_id, itd.)
      tags: tagRows,   // tablica tagów
      albums: albumRows, // tablica albumów (może być pusta, jeśli zdjęcie nie jest przypisane do żadnego albumu)
      device: device   // obiekt urządzenia lub null
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
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
    //zapisz do konsoli zapytanie ze chce ktos public photos
    console.log('GET /photos/public');
    const [rows] = await pool.query('SELECT * FROM Photo WHERE is_public = 1');
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.addTagToPhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { tagName } = req.body;  // Oczekujemy, że w ciele żądania otrzymamy { "tagName": "nazwa" }
    const { userId, role } = req.user;
    // Walidacja – nazwa tagu musi być podana
    if (!tagName || tagName.trim() === '') {
      return res.status(400).json({ error: 'Tag name is required.' });
    }

    // Sprawdzenie, czy zdjęcie istnieje
    const [photoRows] = await pool.query('SELECT * FROM Photo WHERE photo_id = ?', [photoId]);
    if (photoRows.length === 0) {
      return res.status(404).json({ error: 'Photo not found.' });
    }
    const photo = photoRows[0];

    // Sprawdzenie uprawnień – tylko właściciel zdjęcia lub admin może dodać tag
    if (role !== 'admin' && photo.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied. You cannot tag photos that are not yours.' });
    }

    // Sprawdzenie, czy tag już istnieje
    let [tagRows] = await pool.query('SELECT * FROM Tag WHERE tag_name = ?', [tagName]);
    let tagId;
    if (tagRows.length === 0) {
      // Jeśli tag nie istnieje, tworzymy go
      const [insertResult] = await pool.query('INSERT INTO Tag (tag_name) VALUES (?)', [tagName]);
      tagId = insertResult.insertId;
    } else {
      tagId = tagRows[0].tag_id;
    }

    // Dodajemy relację w tabeli PhotoTag
    try {
      await pool.query('INSERT INTO PhotoTag (photo_id, tag_id) VALUES (?, ?)', [photoId, tagId]);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Tag already assigned to this photo.' });
      } else {
        throw error;
      }
    }

    return res.status(201).json({ message: 'Tag added to photo successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.removeTagFromPhoto = async (req, res) => {
  try {
    console.log('removeTagFromPhoto');
    const { photoId, tagId } = req.params;
    const { userId, role } = req.user;

    // Sprawdzenie, czy zdjęcie istnieje
    const [photoRows] = await pool.query('SELECT * FROM Photo WHERE photo_id = ?', [photoId]);
    if (photoRows.length === 0) {
      return res.status(404).json({ error: 'Photo not found.' });
    }
    const photo = photoRows[0];

    // Sprawdzenie uprawnień – tylko właściciel zdjęcia lub admin
    if (role !== 'admin' && photo.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // Usuwamy relację z tabeli PhotoTag
    const [result] = await pool.query('DELETE FROM PhotoTag WHERE photo_id = ? AND tag_id = ?', [photoId, tagId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tag not associated with this photo.' });
    }
    return res.json({ message: 'Tag removed from photo successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.updatePhotoDevice = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { device_id } = req.body;  // oczekujemy np. { device_id: 3 }
    const { userId, role } = req.user;

    // Pobieramy zdjęcie, aby upewnić się, że istnieje
    const [rows] = await pool.query('SELECT * FROM Photo WHERE photo_id = ?', [photoId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Photo not found.' });
    }
    const photo = rows[0];

    // Tylko właściciel zdjęcia lub admin może zmieniać urządzenie
    if (role !== 'admin' && photo.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // Aktualizacja zdjęcia – ustawienie device_id
    await pool.query('UPDATE Photo SET device_id = ? WHERE photo_id = ?', [device_id, photoId]);
    return res.json({ message: 'Photo updated with device successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
