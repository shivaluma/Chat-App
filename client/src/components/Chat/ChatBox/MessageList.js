import React, { useContext, useEffect, useState } from 'react';
import SingleMessage from './SingleMessage';
import { animateScroll } from 'react-scroll';
import { GlobalContext } from '../../../contexts/ConversationState';
import socket from '../../../configs/socket';
import TypingIndicator from './TypingIndicator';
import url from '../../../configs/url';
import request from 'request';

const MessageList = props => {
  const { isReady, newMessage } = useContext(GlobalContext);

  const cvs = props.conversation;
  const userId = localStorage.userId;
  const [messages, setMessages] = useState([]);
  const [otherTyping, setOtherTyping] = useState(false);
  const [otherName, setOtherName] = useState('');
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setMessages([]);
    if (cvs._id) {
      const options = {
        uri: `${url.LOCAL}/api/get-messages?cid=${cvs._id}`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.chattoken}`
        }
      };

      request.get(options, function(err, httpResponse, body) {
        if (httpResponse.statusCode === 200) {
          const { messageList } = JSON.parse(body);
          setMessages(messageList);
          setLoading(false);
        }
      });
      socket.on('user-typing', ({ cid, uid, isTyping, name }) => {
        if (cid === cvs._id && uid !== userId) {
          setOtherName(name);
          if (isTyping !== otherTyping) {
            setOtherTyping(isTyping);
          } else {
            setOtherTyping(false);
          }
        }
      });
    }
  }, [isReady, cvs._id]);

  useEffect(() => {
    if (cvs._id && newMessage) {
      if (cvs._id === newMessage.cid) {
        setMessages([...messages, newMessage.message]);
      }
    }
  }, [newMessage]);

  // useEffect(() => {
  //   if (messages.length > 0) {
  //     setLastMessageId(messages[0]._id);
  //   }
  // }, [messages]);

  useEffect(() => {
    animateScroll.scrollToBottom({
      containerId: 'messages',
      smooth: false,
      duration: 0
    });
  }, [messages, otherTyping, isLoading]);

  return (
    <div
      className='bg-white flex-grow flex flex-col overflow-y-auto'
      id='messages'
    >
      {isLoading ? (
        <div className='spinner-md flex-grow'>A</div>
      ) : (
        messages.map(el => (
          <SingleMessage
            key={el._id || Date.now()}
            name={props.name}
            message={el}
            myId={userId}
          />
        ))
      )}

      {otherTyping ? <TypingIndicator name={otherName} /> : null}
    </div>
  );
};

export default MessageList;
