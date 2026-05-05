const express = require('express');
const router = express.Router();
const operacaoController = require('../controllers/operacao.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/minhas-equipes', operacaoController.getMinhasEquipes);
router.post('/iniciar-pausa', operacaoController.iniciarPausa);
router.post('/encerrar-pausa/:id', operacaoController.encerrarPausa);

module.exports = router;
