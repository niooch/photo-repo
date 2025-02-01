const pool = require('../config/db');

// CREATE
exports.createDevice = async (req, res) => {
  try {
    // req.user przechowuje dane z tokenu: { userId, username, role }
    const userId = req.user.userId;
    const { device_name, device_type } = req.body;

    if (!device_name) {
      return res.status(400).json({ error: 'Device name is required.' });
    }

    // Wstawiamy nowy rekord do bazy
    const sql = `INSERT INTO Device (user_id, device_name, device_type) VALUES (?,?,?)`;
    await pool.query(sql, [userId, device_name, device_type || 'inny']);

    return res.status(201).json({ message: 'Device created successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// READ: getDevices
// - Admin widzi wszystkie urządzenia
// - Zwykły user widzi tylko swoje
exports.getDevices = async (req, res) => {
  try {
    const { role, userId } = req.user;

    let sql = 'SELECT * FROM Device';
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

// READ: getDeviceById
exports.getDeviceById = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { deviceId } = req.params;

    // Pobierz urządzenie
    const [rows] = await pool.query('SELECT * FROM Device WHERE device_id = ?', [deviceId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Device not found.' });
    }

    const device = rows[0];

    // Jeśli user nie jest adminem i urządzenie nie należy do niego – odrzucamy
    if (role !== 'admin' && device.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    return res.json(device);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// UPDATE
exports.updateDevice = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { deviceId } = req.params;
    const { device_name, device_type } = req.body;

    // Pobierz istniejące urządzenie
    const [existing] = await pool.query('SELECT * FROM Device WHERE device_id = ?', [deviceId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Device not found.' });
    }
    const device = existing[0];

    // Sprawdzamy uprawnienia
    if (role !== 'admin' && device.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // Aktualizujemy
    const sql = `UPDATE Device SET device_name = ?, device_type = ? WHERE device_id = ?`;
    await pool.query(sql, [device_name || device.device_name, device_type || device.device_type, deviceId]);

    return res.json({ message: 'Device updated successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// DELETE
exports.deleteDevice = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { deviceId } = req.params;

    // Pobierz istniejące urządzenie
    const [existing] = await pool.query('SELECT * FROM Device WHERE device_id = ?', [deviceId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Device not found.' });
    }
    const device = existing[0];

    // Sprawdzamy uprawnienia
    if (role !== 'admin' && device.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // Usuwamy rekord
    await pool.query('DELETE FROM Device WHERE device_id = ?', [deviceId]);
    return res.json({ message: 'Device deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
