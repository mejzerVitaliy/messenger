import { env } from 'env';
import { io, Socket } from 'socket.io-client';

import { getAccessToken } from './cookies';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(env.NEXT_PUBLIC_API_URL, {
      auth: { token: getAccessToken() },
      autoConnect: false,
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
