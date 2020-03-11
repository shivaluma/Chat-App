const User = require('../models/User');
const Conversation = require('../models/Conversation');

exports.findPeople = async (req, res) => {
  const { s } = req.query;
  if (s === undefined) s = '';
  const result = await User.find({ username: new RegExp(s, 'i') })
    .select('-password')
    .lean()
    .catch(err =>
      res.status(500).json({ message: 'Server error when searching user' })
    );
  return res.status(200).json({ result: result });
};

exports.getConversation = async (req, res) => {
  let { id1, id2 } = req.query;
  if (!id1 || !id2) res.status(404).json({ message: 'No userId found' });
  if (id1 > id2) id2 = [id1, (id1 = id2)][0];
  const cvs = await Conversation.findOne({
    firstId: id1,
    secondId: id2
  }).lean();
  if (cvs) return res.status(200).json({ conversation: cvs });
  const firstUser = await User.findById(id1).lean();
  const secondUser = await User.findById(id2).lean();
  const newCvs = Conversation({
    firstId: id1,
    secondId: id2,
    firstUserName: firstUser.username,
    secondUserName: secondUser.username
  });
  newCvs.save((err, conversation) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: 'Server error when creating new conversation' });
    }
    return res.status(200).json({ conversation: conversation.toObject() });
  });
};

exports.getConversationList = async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(404).json({ message: 'No user found' });
  const listConversation = await Conversation.find({
    $or: [{ firstId: id }, { secondId: id }],
    $and: [{ lastMessage: { $ne: '' } }]
  })
    .select('-messages')
    .sort({ lastUpdate: -1 })
    .lean();
  if (listConversation) return res.status(200).json({ list: listConversation });
  return res.status(200).json({ list: [] });
};

exports.getMessages = async (req, res) => {
  const { cid, page, last } = req.query;
  if (!cid) return res.status(400).json({ message: 'Missing conversation id' });
  const conversation = await Conversation.findById(cid)
    .select('messages')
    .lean();

  if (!conversation)
    res.status(404).json({ message: 'Cannot find conversation' });
  return res.status(200).json({ messageList: conversation.messages });
};

exports.sendMessage = async (req, res) => {
  const { cid, content, uid, username } = req.body;
  if (!cid || !content || !uid)
    return res.status(400).json({ message: 'Missing some data' });
  const conversation = await Conversation.findById(cid);
  if (!conversation)
    res.status(404).json({ message: 'Cannot find conversation' });
  const currentTime = Date.now();

  conversation.messages.push({
    ofUser: uid,
    content: content,
    time: currentTime
  });
  conversation.lastMessage = content;
  conversation.lastSender = username;
  conversation.lastUpdate = currentTime;
  conversation.save((err, cv) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: 'Server error when add new message' });
    }
    const newMessage = cv.messages[conversation.messages.length - 1];
    conversation.messages = undefined;
    return res.status(200).json({
      message: 'Add new message successfully',
      newMessage: newMessage,
      conversation: conversation.toObject()
    });
  });
};
