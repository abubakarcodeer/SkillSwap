const router = require('express').Router();
const { protect } = require('../middleware/auth');
const c = require('../controllers/review.controller');

router.post('/', protect, c.create);
router.get('/user/:userId', protect, c.forUser);

module.exports = router;
