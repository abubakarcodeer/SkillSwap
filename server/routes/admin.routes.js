const router = require('express').Router();
const { protect, admin } = require('../middleware/auth');
const c = require('../controllers/admin.controller');

router.post('/reports', protect, c.createReport);

router.use(protect, admin);
router.get('/stats', c.stats);
router.get('/users', c.listUsers);
router.delete('/users/:id', c.deleteUser);
router.get('/reports', c.listReports);
router.patch('/reports/:id/resolve', c.resolveReport);

module.exports = router;
