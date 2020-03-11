export default (state, action) => {
  switch (action.type) {
    case 'update': {
      return { conversations: [...action.conversations], ready: true };
    }

    case 'toggle-emoji': {
      return { ...state, isEmojiShow: action.status };
    }

    case 'refresh': {
      return { ...state, refresh: !state.refresh };
    }

    case 'update-single': {
      const newArray = state.conversations.filter(
        obj => action.conversation._id !== obj._id
      );
      return {
        ...state,
        conversations: [action.conversation, ...newArray],
        refresh: !state.refresh
      };
    }

    case 'add': {
      return { conversations: [action.conversation, ...state.conversations] };
    }

    case 'update-input': {
      return { ...state, inputEvent: action.inputEvent };
    }

    case 'new-message': {
      console.log(action);
      return {
        ...state,
        newMessage: { cid: action.conversation._id, message: action.message }
      };
    }
    default:
      return state;
  }
};
