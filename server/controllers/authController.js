const User = require('../models/User');
const Conversation = require('../models/Conversation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const keys = 'secret';

exports.register = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });
  if (user)
    return res.status(400).json({ message: 'Username already existed.' });

  const newUser = User({
    username: username,
    password: password
  });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      newUser.password = hash;
      newUser
        .save()
        .then(user => {
          const id1 = '5e623183cd4be3137cbde01f';
          const username1 = 'administrator';
          const id2 = user._id;
          const username2 = user.username;

          if (id1 > id2) {
            id2 = [id1, (id1 = id2)][0];
            username2 = [username1, (username1 = username2)][0];
          }

          const currentTime = Date.now();
          const welcomeMessage =
            'Welcome to my chat app. To start a new conversation, please use the search bar to search for other people and click on them. If you have any question, please reply to this conversation. Developed by Viet Thanh';

          const defaultConversation = Conversation({
            firstId: id1,
            secondId: id2,
            firstUserName: username1,
            secondUserName: username2,
            messages: [
              {
                content: welcomeMessage,
                ofUser: '5e623183cd4be3137cbde01f',
                time: currentTime
              }
            ],
            lastUpdate: currentTime,
            lastSender: 'administrator',
            lastMessage: welcomeMessage
          });

          defaultConversation.save();
          res.status(200).json({ user: user });
        })
        .catch(err => res.status(500).json({ message: 'Server error' }));
    });
  });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });

  if (!user)
    return res.status(404).json({ message: 'Wrong Username or Password.' });
  const passwordMatch = bcrypt.compareSync(password, user.password);

  if (!passwordMatch)
    return res.status(401).json({ message: 'Wrong Username or Password.' });

  const payload = { id: user._id, username: user.username };
  jwt.sign(payload, keys, { expiresIn: 36000 }, (err, token) =>
    res.status(200).json({
      user: payload,
      token: token
    })
  );
};
