const router = require('express').Router();
const { protect } = require('../middleware/auth');
const c = require('../controllers/session.controller');

router.get('/', protect, c.mine);
router.post('/', protect, c.create);
router.patch('/:id/respond', protect, c.respond);

module.exports = router;
