import React from 'react';
import getAvatar from '../../../configs/getAvatar';

const TitleBar = ({ name }) => {
  return (
    <div className='h-20 bg-white flex justify-between border-b-2 border-gray-200'>
      <div className='flex h-full items-center'>
        <img src={getAvatar(name)} className='w-20 h-20 rounded-full p-4 ' />
        <h1 className='font-semibold text-base'>{name}</h1>
      </div>
    </div>
  );
};

export default TitleBar;
