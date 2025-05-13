const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propiedadControllers');
const multer = require('multer');
const auth = require('../middlewares/userLogin'); // Middleware de autenticación

const upload = multer({ dest: 'uploads/' });

router.post('/', auth, upload.array('photos', 10), propertyController.createProperty);

module.exports = router;