// config/multerConfig.js
const multer = require('multer');
const path = require('path');

// Konfiguracja "storage" - gdzie zapisać i jak nazwać plik
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder, w którym zapisywane są pliki
  },
  filename: function (req, file, cb) {
    // np. dodajemy timestamp + rozszerzenie
    const ext = path.extname(file.originalname);
    const fileName = Date.now() + '_' + file.fieldname + ext;
    cb(null, fileName);
  }
});

// Filtr plików (opcjonalnie) - np. dopuszczamy tylko obrazy
function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
}

const upload = multer({ storage, fileFilter });

module.exports = upload;
