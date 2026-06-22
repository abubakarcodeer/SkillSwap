const router = require('express').Router();
const { protect } = require('../middleware/auth');
const c = require('../controllers/match.controller');
router.get('/', protect, c.recommend);
module.exports = router;
