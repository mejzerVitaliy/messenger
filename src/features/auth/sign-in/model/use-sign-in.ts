'use client';

import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { useSessionStore } from 'entities';

import { authApi } from 'shared/api';
import { setTokens } from 'shared/lib';
import { SignInRequest } from 'shared/types';

export const useSignIn = () => {
  const router = useRouter();
  const setAuthenticated = useSessionStore(state => state.setAuthenticated);

  return useMutation({
    mutationFn: (data: SignInRequest) => authApi.signIn(data),
    onSuccess: ({ accessToken, refreshToken }) => {
      setTokens(accessToken, refreshToken);
      setAuthenticated(true);
      router.push('/chats');
    },
  });
};
