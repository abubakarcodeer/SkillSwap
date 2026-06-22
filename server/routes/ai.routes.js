const router = require('express').Router();
const { protect } = require('../middleware/auth');
const c = require('../controllers/ai.controller');

router.get('/suggest-skills', protect, c.suggestSkills);
router.post('/roadmap', protect, c.roadmap);
router.post('/session-topics', protect, c.sessionTopics);

module.exports = router;
