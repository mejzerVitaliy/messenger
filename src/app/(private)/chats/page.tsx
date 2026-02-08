'use client';

import { useState } from 'react';

import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import { useMe } from 'entities';

import { CreateChatDialog } from 'features';
import { chatApi } from 'shared/api';
import { ChatBubbleIcon } from 'shared/icons';
import { Chat } from 'shared/types';
import { Button } from 'shared/ui';

const ChatsPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: me } = useMe();
  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: chatApi.getChats,
  });

  const getCompanion = (chat: Chat) =>
    chat.members.find(member => member.id !== me?.id);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-3 py-4 sm:px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Chats</h1>
        <Button onClick={() => setDialogOpen(true)}>New Chat</Button>
      </div>

      {isLoading && (
        <p className="text-center text-sm text-slate-500">Loading...</p>
      )}

      {!isLoading && (!chats || chats.length === 0) && (
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand">
            <ChatBubbleIcon className="h-7 w-7 stroke-white" />
          </div>
          <p className="text-sm text-slate-500">
            No chats yet. Start a new conversation!
          </p>
        </div>
      )}

      {chats && chats.length > 0 && (
        <div className="flex flex-col gap-2">
          {chats.map(chat => {
            const companion = getCompanion(chat);
            const lastMessage = chat.messages[0];

            return (
              <Link
                key={chat.id}
                href={`/chats/${chat.id}`}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:bg-slate-50 sm:p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-sm font-semibold text-white">
                  {companion?.username.charAt(0).toUpperCase() ?? '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {companion?.username ?? 'Unknown'}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {lastMessage?.text ?? 'No messages yet'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <CreateChatDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </main>
  );
};

export default ChatsPage;
