import React from 'react';
import getAvatar from '../../../configs/getAvatar';

const TypingIndicator = ({ name }) => {
  return (
    <div className='flex mx-3 mt-4 max-w-xs'>
      <img
        src={getAvatar(name)}
        alt='avatar'
        className='h-8 w-8 self-end mr-2'
      />
      <div className='py-2 px-4 bg-gray-300 rounded-xl'>
        <div className='text-black max-w-xs break-words'>
          <div className='ticontainer'>
            <div className='tiblock'>
              <div className='tidot'></div>
              <div className='tidot'></div>
              <div className='tidot'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
