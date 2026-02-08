'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { getSocket } from 'shared/lib';
import { Message } from 'shared/types';

export const useChatSocket = (chatId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(getSocket());

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onMessages = (data: { chatId: string; messages: Message[] }) => {
      if (data.chatId === chatId) {
        setMessages(data.messages.reverse());
      }
    };

    const onNewMessage = (message: Message) => {
      if (message.chatId === chatId) {
        setMessages(prev => [...prev, message]);
      }
    };

    const onMessageEdited = (message: Message) => {
      if (message.chatId === chatId) {
        setMessages(prev => prev.map(m => (m.id === message.id ? message : m)));
      }
    };

    const onMessageDeleted = (data: { messageId: string; chatId: string }) => {
      if (data.chatId === chatId) {
        setMessages(prev => prev.filter(m => m.id !== data.messageId));
      }
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('messages', onMessages);
    socket.on('new_message', onNewMessage);
    socket.on('message_edited', onMessageEdited);
    socket.on('message_deleted', onMessageDeleted);

    socket.emit('join_chat', { chatId });
    socket.emit('get_messages', { chatId });

    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('messages', onMessages);
      socket.off('new_message', onNewMessage);
      socket.off('message_edited', onMessageEdited);
      socket.off('message_deleted', onMessageDeleted);
    };
  }, [chatId]);

  const sendMessage = useCallback(
    (text: string) => {
      socketRef.current.emit('send_message', { chatId, text });
    },
    [chatId],
  );

  const editMessage = useCallback((messageId: string, text: string) => {
    socketRef.current.emit('edit_message', { messageId, text });
  }, []);

  const deleteMessage = useCallback((messageId: string) => {
    socketRef.current.emit('delete_message', { messageId });
  }, []);

  return { messages, isConnected, sendMessage, editMessage, deleteMessage };
};
