const User = require('../models/User');

module.exports = io => {
  io.on('connection', socket => {
    console.log('User has connect');
    socket.on('disconnect', _ => {
      console.log('User disconnected');
      socket.emit('user-disconnect');
      socket.disconnect();
    });

    socket.on('user-login', uid => {
      console.log('user-login : ', uid);
      User.findById(uid).exec((err, user) => {
        if (user) {
          user.isOnline = true;
          user.save();
        }
      });
    });

    socket.on('user-setOffline', uid => {
      console.log('user-offline : ', uid);
      User.findById(uid).exec((err, user) => {
        if (user) {
          user.isOnline = false;
          user.save();
        }
      });
    });

    socket.on('user-join-room', ({ roomId }) => {
      console.log(`A user joined chat-${roomId}`);
      socket.join(`chat-${roomId}`);
    });

    socket.on('user-send-message', ({ conversation, newMessage }) => {
      socket
        .to(`chat-${conversation._id}`)
        .emit('receive-message', {
          conversation: conversation,
          newMessage: newMessage
        });
    });

    socket.on('user-typing-message', ({ cid, uid, isTyping, name }) => {
      socket
        .to(`chat-${cid}`)
        .emit('user-typing', { cid, uid, isTyping, name });
    });

    socket.on('new-conversation', ({ conversation, createId }) => {
      console.log('a client create a new conversation');
      const otherId =
        conversation.firstId === createId
          ? conversation.secondId
          : conversation.firstId;
      socket.broadcast.emit('add-new-conversation', {
        conversation: conversation,
        receiveId: otherId
      });
    });
  });
};
