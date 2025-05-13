//El router sirve para manejar grupos de rutas separadas del app.js principal.
//Es como un mini-servidor dentro de tu servidor Express.

const express = require('express');
const router = express.Router();
const { registrar, login } = require('../controllers/userControllers');

router.post('/register', registrar);
router.post('/login', login);

module.exports = router;



