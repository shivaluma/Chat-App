import React, { useRef, useContext, useState, useEffect } from 'react';
import request from 'request';
import url from '../../../configs/url';
import { GlobalContext } from '../../../contexts/ConversationState';
import socket from '../../../configs/socket';

const InputPanel = ({ cid, uid }) => {
  const chatFieldRef = useRef(null);
  const { updateConversation, addNewMessage } = useContext(GlobalContext);
  const [isSending, setSending] = useState(false);

  let timeout = null;
  const myUsername = localStorage.username;
  const sendMessage = () => {
    const content = chatFieldRef.current.value;
    chatFieldRef.current.value = '';
    if (!content || content === '') return;
    setSending(true);
    const options = {
      uri: `${url.LOCAL}/api/send-message`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.chattoken}`
      },
      body: JSON.stringify({
        cid: cid,
        uid: uid,
        content: content,
        username: myUsername
      })
    };

    request.post(options, function(err, httpResponse, body) {
      if (httpResponse.statusCode !== 200) {
      } else {
        const obj = JSON.parse(body);
        addNewMessage({
          conversation: obj.conversation,
          message: obj.newMessage
        });

        updateConversation(obj.conversation);
        if (timeout) clearTimeout(timeout);
        stoppedTyping();
        socket.emit('user-send-message', {
          conversation: obj.conversation,
          newMessage: obj.newMessage
        });
      }
      setSending(false);
    });
  };

  const stoppedTyping = () => {
    socket.emit('user-typing-message', {
      cid: cid,
      uid: uid,
      isTyping: false
    });
  };

  return (
    <div className='w-full h-16 bg-white flex p-2'>
      <div className='flex-grow flex-shrink flex items-center'>
        <input
          type='search'
          ref={chatFieldRef}
          className='px-4 py-2 w-full bg-gray-300 text-gray-900 rounded-full outline-none truncate'
          onChange={() => {
            socket.emit('user-typing-message', {
              cid: cid,
              uid: uid,
              isTyping: true,
              name: myUsername
            });
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(stoppedTyping, 1500);
          }}
          onKeyPress={event => {
            if (event.key === 'Enter' || event.keyCode === 13) {
              sendMessage();
            }
          }}
          placeholder='Input your message...'
        />

        <button className='focus:outline-none -ml-8'>
          <svg height='24px' width='24px' viewBox='0 0 26 26'>
            <g fill='none' fillRule='evenodd'>
              <polygon points='0,26 26,26 26,0 0,0 '></polygon>
              <path
                d='m19.1311,16.73095c-0.4325,-0.3545 -1.0775,-0.302 -1.441,0.122c-1.171,1.3615 -2.883,2.142 -4.697,2.142c-1.8135,0 -3.526,-0.7805 -4.697,-2.142c-0.363,-0.4225 -1.008,-0.4765 -1.441,-0.122c-0.432,0.355 -0.488,0.986 -0.1245,1.408c1.5605,1.8145 3.8435,2.855 6.2625,2.855c2.4195,0 4.702,-1.0405 6.2625,-2.855c0.3635,-0.422 0.3075,-1.053 -0.1245,-1.408m-2.1355,-7.731c-0.9375,0 -1.5,0.75 -1.5,2c0,1.25 0.5625,2 1.5,2c0.9375,0 1.5,-0.75 1.5,-2c0,-1.25 -0.5625,-2 -1.5,-2m-8,0c-0.9375,0 -1.5,0.75 -1.5,2c0,1.25 0.5625,2 1.5,2c0.9375,0 1.5,-0.75 1.5,-2c0,-1.25 -0.5625,-2 -1.5,-2m4.0045,16c-6.6275,0 -12,-5.3725 -12,-12c0,-6.6275 5.3725,-12 12,-12c6.6275,0 12,5.3725 12,12c0,6.6275 -5.3725,12 -12,12'
                fill='#4299e1'
              ></path>
            </g>
          </svg>
        </button>
      </div>

      <button
        className='flex-shrink-0 my-1 mx-2 bg-blue-500 rounded-full  focus:outline-none'
        style={{ flexBasis: 100 }}
        onClick={sendMessage}
        disabled={isSending}
      >
        {isSending ? (
          <div className='spinner'>A</div>
        ) : (
          <div className='flex items-center justify-center text-white '>
            <span className='font-semibold mr-1 '>Send</span>
            <svg
              className='h-4 w-4 fill-current'
              viewBox='0 0 1000 1000'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M10,991.1l980-493.2L10,8.9l101.1,415.7l532.7,73.4l-532.7,70.5L10,991.1z' />
            </svg>
          </div>
        )}
      </button>
    </div>
  );
};

export default InputPanel;
