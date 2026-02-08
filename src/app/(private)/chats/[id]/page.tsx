'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { useMe } from 'entities';
import { env } from 'env';

import { chatApi } from 'shared/api';
import { useChatSocket } from 'shared/hooks';
import {
  ArrowLeftIcon,
  EditIcon,
  FileIcon,
  PaperclipIcon,
  TrashIcon,
} from 'shared/icons';
import { Attachment, Message } from 'shared/types';
import { Button, Input } from 'shared/ui';

const MAX_FILES = 5;

const ChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: me } = useMe();
  const { data: chat, isLoading: isChatLoading } = useQuery({
    queryKey: ['chat', id],
    queryFn: () => chatApi.getChatById(id),
  });

  const { messages, sendMessage, editMessage, deleteMessage } =
    useChatSocket(id);

  const [text, setText] = useState('');
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const companion = chat?.members.find(member => member.id !== me?.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (!files) {
      return;
    }

    const fileArray = Array.from(files).slice(0, MAX_FILES);

    setSelectedFiles(prev => [...prev, ...fileArray].slice(0, MAX_FILES));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSend = async () => {
    const trimmed = text.trim();

    if (!trimmed && selectedFiles.length === 0) {
      return;
    }

    if (editingMessage) {
      if (trimmed) {
        editMessage(editingMessage.id, trimmed);
      }

      setEditingMessage(null);
      setText('');

      return;
    }

    if (selectedFiles.length > 0) {
      setIsUploading(true);

      try {
        const formData = new FormData();

        formData.append('text', trimmed);
        selectedFiles.forEach(file => formData.append('files', file));

        await chatApi.uploadFiles(id, formData);

        setText('');
        setSelectedFiles([]);
      } finally {
        setIsUploading(false);
      }
    } else {
      sendMessage(trimmed);
      setText('');
    }
  };

  const handleStartEdit = (message: Message) => {
    setEditingMessage(message);
    setText(message.text);
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setText('');
  };

  if (isChatLoading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-sm text-slate-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-[calc(100vh-72px)] w-full max-w-2xl flex-col sm:h-[calc(100vh-100px)]">
      <ChatHeader username={companion?.username} />

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-4 sm:px-4">
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">
            No messages yet. Say hello!
          </p>
        )}

        {messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.authorId === me?.id}
            onEdit={handleStartEdit}
            onDelete={deleteMessage}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        text={text}
        editingMessage={editingMessage}
        selectedFiles={selectedFiles}
        isUploading={isUploading}
        fileInputRef={fileInputRef}
        onTextChange={setText}
        onSend={handleSend}
        onFileSelect={handleFileSelect}
        onRemoveFile={handleRemoveFile}
        onCancelEdit={handleCancelEdit}
      />
    </main>
  );
};

export default ChatPage;

type ChatHeaderProps = {
  username?: string;
};

const ChatHeader = ({ username }: ChatHeaderProps) => (
  <div className="flex items-center gap-3 border-b border-slate-200 px-3 py-3 sm:px-4">
    <Link
      href="/chats"
      aria-label="Back to chats"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
    >
      <ArrowLeftIcon />
    </Link>
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand text-sm font-semibold text-white">
      {username?.charAt(0).toUpperCase() ?? '?'}
    </div>
    <p className="text-sm font-medium text-slate-900">
      {username ?? 'Unknown'}
    </p>
  </div>
);

type MessageBubbleProps = {
  message: Message;
  isOwn: boolean;
  onEdit: (message: Message) => void;
  onDelete: (messageId: string) => void;
};

const MessageBubble = ({
  message,
  isOwn,
  onEdit,
  onDelete,
}: MessageBubbleProps) => {
  const isEdited = message.updatedAt !== message.createdAt;

  return (
    <div className={`group flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-[85%] rounded-2xl px-3 py-2 sm:max-w-[70%] sm:px-4 ${
          isOwn
            ? 'bg-gradient-brand text-white'
            : 'border border-slate-200 bg-white text-slate-900'
        }`}
      >
        {!isOwn && message.author && (
          <p className="mb-1 text-xs font-medium text-slate-500">
            {message.author.username}
          </p>
        )}

        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-2 flex flex-col gap-1">
            {message.attachments.map(attachment => (
              <AttachmentPreview
                key={attachment.id}
                attachment={attachment}
                isOwn={isOwn}
              />
            ))}
          </div>
        )}

        {message.text && <p className="text-sm">{message.text}</p>}

        <div
          className={`mt-1 flex items-center gap-1 text-[10px] ${
            isOwn ? 'text-white/70' : 'text-slate-400'
          }`}
        >
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {isEdited && <span>edited</span>}
        </div>

        {isOwn && (
          <div className="absolute -left-16 top-1/2 hidden -translate-y-1/2 gap-1 group-hover:flex">
            <button
              type="button"
              aria-label="Edit message"
              onClick={() => onEdit(message)}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <EditIcon />
            </button>
            <button
              type="button"
              aria-label="Delete message"
              onClick={() => onDelete(message.id)}
              className="rounded-md p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
            >
              <TrashIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

type AttachmentPreviewProps = {
  attachment: Attachment;
  isOwn: boolean;
};

const AttachmentPreview = ({ attachment, isOwn }: AttachmentPreviewProps) => {
  const fileUrl = `${env.NEXT_PUBLIC_API_URL}/uploads/${attachment.fileName}`;
  const isImage = attachment.mimeType.startsWith('image/');

  if (isImage) {
    return (
      <Link href={fileUrl} target="_blank" rel="noopener noreferrer">
        <Image
          src={fileUrl}
          alt={attachment.originalName}
          width={300}
          height={200}
          className="max-h-48 w-auto rounded-lg object-cover"
          unoptimized
        />
      </Link>
    );
  }

  return (
    <Link
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
        isOwn ? 'bg-white/20' : 'bg-slate-100'
      }`}
    >
      <FileIcon />
      <span className="max-w-[140px] truncate sm:max-w-[180px]">
        {attachment.originalName}
      </span>
    </Link>
  );
};

type MessageInputProps = {
  text: string;
  editingMessage: Message | null;
  selectedFiles: File[];
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onTextChange: (value: string) => void;
  onSend: () => void;
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onCancelEdit: () => void;
};

const MessageInput = ({
  text,
  editingMessage,
  selectedFiles,
  isUploading,
  fileInputRef,
  onTextChange,
  onSend,
  onFileSelect,
  onRemoveFile,
  onCancelEdit,
}: MessageInputProps) => (
  <div className="border-t border-slate-200 px-3 py-3 sm:px-4">
    {editingMessage && (
      <div className="mb-2 flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2">
        <p className="truncate text-xs text-slate-500">
          Editing: {editingMessage.text}
        </p>
        <button
          type="button"
          onClick={onCancelEdit}
          className="ml-2 text-xs text-slate-400 hover:text-slate-600"
        >
          Cancel
        </button>
      </div>
    )}

    {selectedFiles.length > 0 && (
      <div className="mb-2 flex flex-wrap gap-2">
        {selectedFiles.map((file, index) => (
          <div
            key={file.name}
            className="flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600"
          >
            <span className="max-w-[100px] truncate sm:max-w-[120px]">
              {file.name}
            </span>
            <button
              type="button"
              aria-label={`Remove ${file.name}`}
              onClick={() => onRemoveFile(index)}
              className="text-slate-400 hover:text-red-500"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    )}

    <div className="flex gap-2">
      {!editingMessage && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={onFileSelect}
            className="hidden"
          />
          <button
            type="button"
            aria-label="Attach files"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 sm:h-[46px] sm:w-[46px]"
          >
            <PaperclipIcon />
          </button>
        </>
      )}
      <Input
        placeholder="Type a message..."
        value={text}
        onChange={event => onTextChange(event.target.value)}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            onSend();
          }
        }}
      />
      <Button onClick={onSend} isLoading={isUploading}>
        {editingMessage ? 'Save' : 'Send'}
      </Button>
    </div>
  </div>
);
