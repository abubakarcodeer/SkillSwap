const router = require('express').Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const c = require('../controllers/chat.controller');

router.get('/recent', protect, c.recent);
router.get('/:userId', protect, c.history);
router.post('/upload', protect, upload.single('file'), c.uploadFile);

module.exports = router;
