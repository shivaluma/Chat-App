import io from 'socket.io-client';
import url from './url';

const socket = io(url.LOCAL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity
});

socket.on('disconnect', () => {
  if (localStorage.userId) {
    socket.emit('user-setOffline', localStorage.userId);
  }
});

export default socket;
