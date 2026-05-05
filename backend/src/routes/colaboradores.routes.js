const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/colaboradores.controller');

router.get('/', ctrl.listar);
router.get('/:id', ctrl.buscarPorId);
router.post('/', ctrl.criar);
router.put('/:id', ctrl.atualizar);
router.delete('/:id', ctrl.remover);
router.post('/importar', ctrl.importar);
router.patch('/:id/biometria', ctrl.vincularBiometria);
router.patch('/:id/pin', ctrl.gerarPin);
router.post('/validar-pin', ctrl.validarPin);
router.post('/validar-biometria', ctrl.validarBiometria);

module.exports = router;
