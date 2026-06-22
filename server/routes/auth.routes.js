const router = require('express').Router();
const passport = require('passport');
const c = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

router.post('/signup', c.signup);
router.post('/login', c.login);
router.post('/forgot', c.forgot);
router.post('/reset', c.reset);
router.get('/me', protect, c.me);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/' }), c.googleCallback);

module.exports = router;
