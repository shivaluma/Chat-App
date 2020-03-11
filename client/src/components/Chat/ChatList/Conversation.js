import React from 'react';
import getAvatar from '../../../configs/getAvatar';
import { NavLink } from 'react-router-dom';
const Conversation = ({ conversation, otherName }) => {
  return (
    <NavLink
      to={`/chat/${conversation._id}`}
      className='flex h-16 max-w-full rounded-lg cursor-pointer'
      activeClassName='bg-gray-300'
    >
      <img
        src={getAvatar(otherName)}
        className='h-16 w-16 mx-4 p-1 rounded-full'
        alt='avatar'
      />

      <div className='hidden md:flex flex-col h-full justify-center overflow-hidden'>
        <span className='font-semibold truncate'>{otherName}</span>
        {conversation.lastSender ? (
          <div className='flex mr-2'>
            <p className='text-sm  text-gray-700 truncate max-w-full'>
              {conversation.lastSender}: {conversation.lastMessage}
            </p>
            {/* <span className='text-gray-600 ml-2 text-sm'>• 8:56</span> */}
          </div>
        ) : null}
      </div>
    </NavLink>
  );
};

export default Conversation;
