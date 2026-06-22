const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sign } = require('../utils/jwt');
const sendEmail = require('../utils/sendEmail');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  if (await User.findOne({ email })) return res.status(409).json({ message: 'Email already used' });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  res.json({ token: sign(user._id), user: sanitize(user) });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ token: sign(user._id), user: sanitize(user) });
};

exports.me = async (req, res) => res.json(sanitize(req.user));

exports.forgot = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ ok: true }); // do not leak
  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = crypto.createHash('sha256').update(token).digest('hex');
  user.resetTokenExp = Date.now() + 1000 * 60 * 30;
  await user.save();
  const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  await sendEmail({ to: email, subject: 'Reset your password', html: `<a href="${url}">Reset password</a>` });
  res.json({ ok: true });
};

exports.reset = async (req, res) => {
  const { token, password } = req.body;
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ resetToken: hashed, resetTokenExp: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: 'Token invalid or expired' });
  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined; user.resetTokenExp = undefined;
  await user.save();
  res.json({ ok: true });
};

exports.googleCallback = (req, res) => {
  const token = sign(req.user._id);
  res.redirect(`${process.env.CLIENT_URL}/oauth?token=${token}`);
};

function sanitize(u) {
  const o = u.toObject ? u.toObject() : u;
  delete o.password; delete o.resetToken; delete o.resetTokenExp;
  return o;
}
