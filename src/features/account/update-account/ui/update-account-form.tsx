'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { User } from 'shared/types';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from 'shared/ui';

import { useUpdateAccount } from '../model/use-update-account';

const USERNAME_MIN_LENGTH = 3;

const updateAccountSchema = z.object({
  email: z.string().email('Invalid email'),
  username: z
    .string()
    .min(USERNAME_MIN_LENGTH, 'Username must be at least 3 characters'),
});

type UpdateAccountFormValues = z.infer<typeof updateAccountSchema>;

type Props = {
  user?: User;
};

export const UpdateAccountForm = ({ user }: Props) => {
  const { mutate, isPending, error, isSuccess } = useUpdateAccount();

  const form = useForm<UpdateAccountFormValues>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: { email: '', username: '' },
  });

  useEffect(() => {
    if (user) {
      form.reset({ email: user.email, username: user.username });
    }
  }, [user, form]);

  const onSubmit = (data: UpdateAccountFormValues) => {
    mutate(data);
  };

  const serverError =
    error instanceof AxiosError ? error.response?.data?.message : null;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {serverError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        {isSuccess && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
            Account updated successfully
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" isLoading={isPending}>
          Save Changes
        </Button>
      </form>
    </Form>
  );
};
