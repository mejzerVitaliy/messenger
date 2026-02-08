'use client';

import { useMe } from 'entities';

import { UpdateAccountForm, UpdatePasswordForm } from 'features';

const AccountPage = () => {
  const { data: user } = useMe();

  const initial = user?.username?.charAt(0).toUpperCase() ?? '?';

  return (
    <main className="mx-auto max-w-2xl px-3 py-6 sm:px-6 sm:py-10">
      <h1 className="mb-6 text-xl font-bold text-slate-900 sm:mb-8 sm:text-2xl">
        Account Settings
      </h1>

      <div className="flex flex-col gap-6 sm:gap-8">
        <section className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:gap-4 sm:p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-lg font-bold text-white sm:h-14 sm:w-14 sm:text-xl">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-900 sm:text-lg">
              {user?.username ?? '...'}
            </p>
            <p className="truncate text-xs text-slate-500 sm:text-sm">
              {user?.email ?? '...'}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-900 sm:mb-5 sm:text-lg">
            Profile
          </h2>
          <UpdateAccountForm user={user} />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-900 sm:mb-5 sm:text-lg">
            Change Password
          </h2>
          <UpdatePasswordForm />
        </section>
      </div>
    </main>
  );
};

export default AccountPage;
