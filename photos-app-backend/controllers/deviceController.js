const pool = require('../config/db');

exports.createDevice = async (req, res) => {
  try {
    const { device_name, device_type } = req.body;
    const { userId } = req.user;  // pobierane z tokena przez middleware
    if (!device_name || device_name.trim() === '') {
      return res.status(400).json({ error: 'Device name is required.' });
    }
    const [result] = await pool.query(
      'INSERT INTO Device (user_id, device_name, device_type) VALUES (?, ?, ?)',
      [userId, device_name, device_type || 'inny']
    );
    return res.status(201).json({ message: 'Device created successfully.', device_id: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.getDevices = async (req, res) => {
  try {
    const { userId, role } = req.user;
    let sql = 'SELECT * FROM Device';
    let params = [];
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
