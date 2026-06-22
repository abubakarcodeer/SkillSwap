const Session = require('../models/Session');

exports.create = async (req, res) => {
  const { host, skill, startsAt, durationMin, notes } = req.body;
  const s = await Session.create({ host, guest: req.user._id, skill, startsAt, durationMin, notes });
  res.json(s);
};

exports.respond = async (req, res) => {
  const { status, meetingLink } = req.body; // accepted | rejected | completed | cancelled
  const s = await Session.findById(req.params.id);
  if (!s) return res.status(404).json({ message: 'Not found' });

  // Only host can accept/reject/complete/setLink
  const isHost = String(s.host) === String(req.user._id);
  const isGuest = String(s.guest) === String(req.user._id);

  if (status && ['accepted', 'rejected', 'completed'].includes(status) && !isHost) {
    return res.status(403).json({ message: 'Only host can change to this status' });
  }

  if (meetingLink && !isHost) {
    return res.status(403).json({ message: 'Only host can create meeting' });
  }

  if (status === 'cancelled' && !isHost && !isGuest) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (status) s.status = status;
  if (meetingLink) s.meetingLink = meetingLink;

  await s.save();
  res.json(s);
};

exports.mine = async (req, res) => {
  const list = await Session.find({
    $or: [{ host: req.user._id }, { guest: req.user._id }],
  }).sort({ startsAt: 1 }).populate('host guest', 'name avatar');
  res.json(list);
};
