import React from 'react';
import getAvatar from '../../../configs/getAvatar';
const SearchTile = props => {
  return (
    <div
      className='flex h-12 max-w-full hover:bg-gray-300 rounded-lg cursor-pointer'
      onClick={() => {
        props.openConversation(props.id);
      }}
    >
      <img
        src={getAvatar(props.username)}
        className='h-12 w-12 mx-4 p-1 rounded-full'
        alt='avatar'
      />
      <div className='hidden md:flex flex-col h-full justify-center items-center overflow-hidden'>
        <span className='text-base truncate'>{props.username}</span>
      </div>
    </div>
  );
};

export default SearchTile;
