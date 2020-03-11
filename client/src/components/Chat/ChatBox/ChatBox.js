import React, { useContext, useEffect } from 'react';
import TitleBar from './TitleBar';
import MessageList from './MessageList';
import InputPanel from './InputPanel';
import { GlobalContext } from '../../../contexts/ConversationState';
import socket from '../../../configs/socket';
import EmojiPicker from './EmojiPicker';
import { history } from '../../../configs/browserHistory';

const ChatBox = ({ chatId, userId }) => {
  const {
    getConversation,
    updateConversation,
    addConversation,
    addNewMessage,
    isReady
  } = useContext(GlobalContext);
  const cvs = getConversation(chatId);
  const otherUsername =
    (userId === cvs.firstId ? cvs.secondUserName : cvs.firstUserName) || '';
  useEffect(() => {
    if (isReady) {
      socket.on('receive-message', ({ conversation, newMessage }) => {
        const cvs = getConversation(conversation._id);
        if (cvs) {
          if (localStorage.username === conversation.lastSender) return;
          updateConversation(conversation);
          addNewMessage({ conversation: conversation, message: newMessage });
        } else {
          addConversation(conversation);
        }
      });
    }
  }, [isReady]);

  return (
    <div className='flex-grow flex-shrink flex max-h-full border-l-2 border-gray-200 flex-col'>
      <TitleBar name={otherUsername} className='self-start' />
      <MessageList name={otherUsername} conversation={cvs} />

      <div className='w-full px-4 mt-1'>
        <InputPanel cid={chatId} uid={userId} className='w-7/8 self-end' />
      </div>
    </div>
  );
};

export default ChatBox;
