const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  // Spodziewamy się nagłówka Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>"

  // Weryfikacja tokenu
  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Failed to authenticate token.' });
    }
    // decoded = { userId, username, role, iat, exp }
    req.user = decoded;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Require admin role.' });
  }
};
