import React, { useContext, useEffect, useState } from 'react';
import Conversation from './Conversation';

import { GlobalContext } from '../../../contexts/ConversationState';
import { history } from '../../../configs/browserHistory';
import socket from '../../../configs/socket';
const ListConversation = props => {
  const { conversations, addConversation, getConversation } = useContext(
    GlobalContext
  );

  const myUsername = localStorage.username;
  const myId = localStorage.userId;

  useEffect(() => {
    socket.on('add-new-conversation', ({ conversation, receiveId }) => {
      if (myId === receiveId) {
        addConversation(conversation);
      }
    });
  }, []);

  useEffect(() => {
    if (conversations) {
      conversations.forEach(el => {
        socket.emit('user-join-room', { roomId: el._id });
      });
      if (!props.chatId && conversations.length > 0) {
        history.replace(`/chat/${conversations[0]._id}`);
      }
    }
  }, [conversations.length]);

  return (
    <div className='bg-white flex flex-col items-center overflow-y-auto flex-grow'>
      <div className='w-full px-2 overflow-y-auto'>
        {conversations.map(el => (
          <Conversation
            key={el._id}
            conversation={el}
            otherName={
              myUsername === el.firstUserName
                ? el.secondUserName
                : el.firstUserName
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ListConversation;
