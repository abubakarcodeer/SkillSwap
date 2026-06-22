const User = require('../models/User');
const matchScore = require('../utils/matchScore');

exports.recommend = async (req, res) => {
  const me = req.user;
  const others = await User.find({ _id: { $ne: me._id } }).limit(200);
  const scored = others
    .map(u => ({ user: u, ...matchScore(me, u) }))
    .filter(x => x.percent > 0)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 24);
  res.json(scored);
};
