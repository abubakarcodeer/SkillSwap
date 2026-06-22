const User = require('../models/User');
const Report = require('../models/Report');
const Session = require('../models/Session');

exports.stats = async (_req, res) => {
  const [users, sessions, reports] = await Promise.all([
    User.countDocuments(),
    Session.countDocuments(),
    Report.countDocuments({ resolved: false }),
  ]);
  res.json({ users, sessions, openReports: reports });
};

exports.listUsers = async (_req, res) => res.json(await User.find().sort('-createdAt').limit(200));
exports.deleteUser = async (req, res) => { await User.findByIdAndDelete(req.params.id); res.json({ ok: true }); };

exports.listReports = async (_req, res) =>
  res.json(await Report.find().populate('reporter target', 'name email').sort('-createdAt'));

exports.resolveReport = async (req, res) => {
  const r = await Report.findByIdAndUpdate(req.params.id, { resolved: true }, { new: true });
  res.json(r);
};

exports.createReport = async (req, res) => {
  const r = await Report.create({ reporter: req.user._id, target: req.body.target, reason: req.body.reason });
  res.json(r);
};
