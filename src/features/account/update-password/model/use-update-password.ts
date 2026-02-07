import { useMutation } from '@tanstack/react-query';

import { userApi } from 'shared/api';
import { UpdatePasswordRequest } from 'shared/types';

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data: UpdatePasswordRequest) => userApi.updatePassword(data),
  });
};
