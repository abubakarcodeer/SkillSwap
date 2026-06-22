const Message = require('../models/Message');

exports.history = async (req, res) => {
  const otherId = req.params.userId;
  const msgs = await Message.find({
    $or: [
      { from: req.user._id, to: otherId },
      { from: otherId, to: req.user._id },
    ],
  }).sort({ createdAt: 1 }).limit(500);
  res.json(msgs);
};

exports.recent = async (req, res) => {
  try {
    const userId = req.user._id;
    const recentMessages = await Message.aggregate([
      {
        $match: {
          $or: [{ from: userId }, { to: userId }]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$from", userId] },
              "$to",
              "$from"
            ]
          },
          lastMessage: { $first: "$$ROOT" }
        }
      },
      { $replaceRoot: { newRoot: "$lastMessage" } },
      { $sort: { createdAt: -1 } }
    ]);

    const populated = await Message.populate(recentMessages, { path: 'from to', select: 'name avatar online' });
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file' });
  res.json({ url: `/uploads/${req.file.filename}` });
};
