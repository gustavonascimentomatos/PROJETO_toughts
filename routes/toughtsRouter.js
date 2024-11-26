import express from 'express';
import ToughtController from '../controllers/ToughtController.js';
import checkAuth from '../helpers/auth.js'; // Importação usando ES6

const router = express.Router();

router.get('/add', checkAuth, checkAuth, ToughtController.createTought);
router.post('/add', checkAuth, checkAuth, ToughtController.createToughtSave);
router.get('/edit/:id', checkAuth, ToughtController.updateTouht);
router.post('/edit/', checkAuth, ToughtController.updateTouhtSave);
router.get('/dashboard', checkAuth, ToughtController.dashboard);
router.post('/remove', checkAuth, ToughtController.removeTought)
router.get('/', ToughtController.showToughts);

export default router;
