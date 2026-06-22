const User = require('../models/User');

exports.updateMe = async (req, res) => {
  const allowed = ['name','university','program','bio','teach','learn','availability'];
  const update = {};
  for (const k of allowed) if (k in req.body) update[k] = req.body[k];
  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });
  res.json(user);
};

exports.uploadAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file' });
  const url = `/uploads/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(req.user._id, { avatar: url }, { new: true });
  res.json(user);
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json(user);
};

exports.listUsers = async (_req, res) => {
  const users = await User.find().limit(100);
  res.json(users);
};
