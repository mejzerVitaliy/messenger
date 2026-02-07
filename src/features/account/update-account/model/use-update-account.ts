import { useMutation } from '@tanstack/react-query';

import { userApi } from 'shared/api';
import { UpdateAccountRequest } from 'shared/types';

export const useUpdateAccount = () => {
  return useMutation({
    mutationFn: (data: UpdateAccountRequest) => userApi.updateAccount(data),
  });
};
