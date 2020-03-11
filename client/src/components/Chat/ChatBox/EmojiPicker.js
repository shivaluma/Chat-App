import React, { useContext } from 'react';
import Picker from 'emoji-picker-react';
import { GlobalContext } from '../../../contexts/ConversationState';

const EmojiPicker = () => {
  const { inputEvent } = useContext(GlobalContext);
  return (
    <Picker
      onEmojiClick={(event, emoji) => {
        console.log(emoji.emoji);
        console.log(inputEvent);
      }}
    />
  );
};

export default EmojiPicker;
