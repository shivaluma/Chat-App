const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  firstId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  secondId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  firstUserName: {
    type: String,
    required: true
  },
  secondUserName: {
    type: String,
    required: true
  },
  messages: [
    {
      content: String,
      ofUser: Schema.Types.ObjectId,
      time: {
        type: Date,
        default: Date.now
      }
    }
  ],
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  lastMessage: {
    type: String,
    default: ''
  },
  lastSender: {
    type: String,
    default: ''
  }
});

const Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;
