import { api } from 'shared/lib';
import {
  UpdateAccountRequest,
  UpdatePasswordRequest,
  User,
} from 'shared/types';

export const userApi = {
  getMe: () => api.get<User>('/user/me').then(res => res.data),

  updateAccount: (data: UpdateAccountRequest) =>
    api.put<User>('/user/update-account', data).then(res => res.data),

  updatePassword: (data: UpdatePasswordRequest) =>
    api.put<User>('/user/update-password', data).then(res => res.data),
};
