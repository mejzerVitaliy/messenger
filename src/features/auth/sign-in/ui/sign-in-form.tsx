'use client';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Input, PasswordInput } from 'shared/ui';

import { useSignIn } from '../model/use-sign-in';

const PASSWORD_MIN_LENGTH = 6;

const signInSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, 'Password must be at least 6 characters'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export const SignInForm = () => {
  const { mutate, isPending, error } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignInFormValues) => {
    mutate(data);
  };

  const serverError =
    error instanceof AxiosError ? error.response?.data?.message : null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-md flex-col gap-5"
    >
      <div className="mb-2 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">
          Sign in to continue to Messenger
        </p>
      </div>

      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <Input
        {...register('email')}
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
      />

      <PasswordInput
        {...register('password')}
        label="Password"
        placeholder="Enter your password"
        error={errors.password?.message}
      />

      <Button type="submit" isLoading={isPending}>
        Sign In
      </Button>

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link
          href="/sign-up"
          className="font-medium text-brand-600 transition-colors hover:text-brand-700"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
};
