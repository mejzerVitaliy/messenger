import { api } from 'shared/lib';
import {
  AuthTokens,
  RefreshRequest,
  SignInRequest,
  SignUpRequest,
} from 'shared/types';

export const authApi = {
  signUp: (data: SignUpRequest) =>
    api.post<AuthTokens>('/auth/sign-up', data).then(res => res.data),

  signIn: (data: SignInRequest) =>
    api.post<AuthTokens>('/auth/sign-in', data).then(res => res.data),

  refresh: (data: RefreshRequest) =>
    api.post<AuthTokens>('/auth/refresh', data).then(res => res.data),

  logout: () => api.post('/auth/logout'),
};
