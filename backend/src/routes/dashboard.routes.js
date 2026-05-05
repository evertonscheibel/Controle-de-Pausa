const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Protect all dashboard routes
router.use(authenticate);

router.get('/resumo', dashboardController.getResumo);
router.get('/equipes-agora', dashboardController.getEquipesAgora);

module.exports = router;
