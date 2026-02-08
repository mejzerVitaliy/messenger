import { User } from './user';

export interface Attachment {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  messageId: string;
}

export interface Message {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  chatId: string;
  author?: User;
  attachments?: Attachment[];
}

export interface Chat {
  id: string;
  createdAt: string;
  updatedAt: string;
  members: User[];
  messages: Message[];
}

export interface CreateChatRequest {
  participantId: string;
}

export interface SearchUserParams {
  email?: string;
  username?: string;
}
