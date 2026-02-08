'use client';

import { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { chatApi, userApi } from 'shared/api';
import { User } from 'shared/types';
import { Button, Input } from 'shared/ui';

type Props = {
  open: boolean;
  onClose: () => void;
};

export const CreateChatDialog = ({ open, onClose }: Props) => {
  const [search, setSearch] = useState('');
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const queryClient = useQueryClient();

  const createChat = useMutation({
    mutationFn: chatApi.createChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      handleClose();
    },
  });

  const handleSearch = async () => {
    const trimmed = search.trim();

    if (!trimmed) {
      return;
    }

    setError('');
    setFoundUser(null);
    setIsSearching(true);

    try {
      const user = await userApi.searchUser({
        email: trimmed,
        username: trimmed,
      });

      setFoundUser(user);
    } catch {
      setError('User not found');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClose = () => {
    setSearch('');
    setFoundUser(null);
    setError('');
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative z-50 mx-3 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:mx-0 sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-900">New Chat</h2>

        <div className="flex gap-2">
          <Input
            placeholder="Email or username"
            value={search}
            onChange={event => setSearch(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <Button onClick={handleSearch} isLoading={isSearching}>
            Search
          </Button>
        </div>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        {foundUser && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-sm font-semibold text-white">
                {foundUser.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {foundUser.username}
                </p>
                <p className="text-xs text-slate-500">{foundUser.email}</p>
              </div>
            </div>
            <Button
              onClick={() => createChat.mutate({ participantId: foundUser.id })}
              isLoading={createChat.isPending}
            >
              Create
            </Button>
          </div>
        )}

        {createChat.isError && (
          <p className="mt-3 text-sm text-red-500">
            {(createChat.error as Error).message ===
            'Request failed with status code 409'
              ? 'Chat already exists'
              : 'Failed to create chat'}
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
