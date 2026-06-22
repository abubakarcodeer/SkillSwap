const Review = require('../models/Review');
const User = require('../models/User');

exports.create = async (req, res) => {
  const { to, session, rating, comment } = req.body;
  const r = await Review.create({ to, from: req.user._id, session, rating, comment });
  const agg = await Review.aggregate([
    { $match: { to: r.to } },
    { $group: { _id: '$to', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (agg[0]) await User.findByIdAndUpdate(to, { ratingAvg: agg[0].avg, ratingCount: agg[0].count });
  res.json(r);
};

exports.forUser = async (req, res) => {
  const list = await Review.find({ to: req.params.userId }).populate('from', 'name avatar').sort({ createdAt: -1 });
  res.json(list);
};
