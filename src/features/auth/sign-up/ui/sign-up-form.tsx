'use client';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PasswordInput,
} from 'shared/ui';

import { useSignUp } from '../model/use-sign-up';

const USERNAME_MIN_LENGTH = 3;
const PASSWORD_MIN_LENGTH = 6;

const signUpSchema = z.object({
  email: z.string().email('Invalid email'),
  username: z
    .string()
    .min(USERNAME_MIN_LENGTH, 'Username must be at least 3 characters'),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, 'Password must be at least 6 characters'),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
  const { mutate, isPending, error } = useSignUp();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', username: '', password: '' },
  });

  const onSubmit = (data: SignUpFormValues) => {
    mutate(data);
  };

  const serverError =
    error instanceof AxiosError ? error.response?.data?.message : null;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full max-w-md flex-col gap-5"
      >
        <div className="mb-2 flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
          <p className="text-sm text-slate-500">
            Sign up to start using Messenger
          </p>
        </div>

        {serverError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {serverError}
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
                <Input type="text" placeholder="Choose a username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Create a password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" isLoading={isPending}>
          Create Account
        </Button>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="font-medium text-brand-600 transition-colors hover:text-brand-700"
          >
            Sign In
          </Link>
        </p>
      </form>
    </Form>
  );
};
