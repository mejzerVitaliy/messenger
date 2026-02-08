import { api } from 'shared/lib';
import { Chat, CreateChatRequest, Message } from 'shared/types';

export const chatApi = {
  getChats: () => api.get<Chat[]>('/chat').then(res => res.data),

  getChatById: (chatId: string) =>
    api.get<Chat>(`/chat/${chatId}`).then(res => res.data),

  createChat: (data: CreateChatRequest) =>
    api.post<Chat>('/chat', data).then(res => res.data),

  uploadFiles: (chatId: string, formData: FormData) =>
    api
      .post<Message>(`/chat/${chatId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(res => res.data),
};
