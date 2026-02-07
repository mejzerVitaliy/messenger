import { useQuery } from '@tanstack/react-query';

import { userApi } from 'shared/api';

export const useMe = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: userApi.getMe,
    retry: false,
    staleTime: Infinity,
  });
};
