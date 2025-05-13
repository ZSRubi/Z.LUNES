const express = require('express');
const router = express.Router();
const visitaController = require('../controllers/visitaControllers');
const auth = require('../middlewares/userLogin');

router.post('/', auth, visitaController.crearVisita);

module.exports = router;