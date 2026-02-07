'use client';

import { useMe } from 'entities';

import { UpdateAccountForm, UpdatePasswordForm } from 'features';

const AccountPage = () => {
  const { data: user } = useMe();

  const initial = user?.username?.charAt(0).toUpperCase() ?? '?';

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold text-slate-900">
        Account Settings
      </h1>

      <div className="flex flex-col gap-8">
        <section className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-xl font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-slate-900">
              {user?.username ?? '...'}
            </p>
            <p className="truncate text-sm text-slate-500">
              {user?.email ?? '...'}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">Profile</h2>
          <UpdateAccountForm user={user} />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            Change Password
          </h2>
          <UpdatePasswordForm />
        </section>
      </div>
    </main>
  );
};

export default AccountPage;
