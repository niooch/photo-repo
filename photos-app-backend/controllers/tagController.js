const pool = require('../config/db');

exports.createTag = async (req, res) => {
  try {
    const { tag_name } = req.body;
    if (!tag_name) {
      return res.status(400).json({ error: 'Tag name is required.' });
    }
    await pool.query('INSERT INTO Tag (tag_name) VALUES (?)', [tag_name]);
    return res.status(201).json({ message: 'Tag created.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Tag');
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.getTagById = async (req, res) => {
  try {
    const { tagId } = req.params;
    const [rows] = await pool.query('SELECT * FROM Tag WHERE tag_id = ?', [tagId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tag not found.' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.updateTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const { tag_name } = req.body;

    // sprawdź, czy tag istnieje
    const [existing] = await pool.query('SELECT * FROM Tag WHERE tag_id = ?', [tagId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Tag not found.' });
    }

    await pool.query('UPDATE Tag SET tag_name = ? WHERE tag_id = ?', [tag_name || existing[0].tag_name, tagId]);
    return res.json({ message: 'Tag updated.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    // sprawdź, czy tag istnieje
    const [existing] = await pool.query('SELECT * FROM Tag WHERE tag_id = ?', [tagId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Tag not found.' });
    }
    // usuwamy
    await pool.query('DELETE FROM Tag WHERE tag_id = ?', [tagId]);
    return res.json({ message: 'Tag deleted.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
