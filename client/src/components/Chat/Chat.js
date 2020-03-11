import React, { useEffect } from 'react';

import { GlobalProvider } from '../../contexts/ConversationState';
import ChatList from './ChatList/ChatList';
import ChatBox from './ChatBox/ChatBox';

const Chat = props => {
  const userId = localStorage.userId;
  const chatId = props.match.params.id;

  useEffect(() => {
    document.title = 'Chat';
  }, []);

  return (
    <GlobalProvider>
      <div className='h-screen flex'>
        <ChatList chatId={chatId} />
        <ChatBox chatId={chatId} userId={userId} />
      </div>
    </GlobalProvider>
  );
};

export default Chat;
