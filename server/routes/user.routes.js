const router = require('express').Router();
const c = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', protect, c.listUsers);
router.patch('/me', protect, c.updateMe);
router.post('/me/avatar', protect, upload.single('avatar'), c.uploadAvatar);
router.get('/:id', protect, c.getUser);

module.exports = router;
