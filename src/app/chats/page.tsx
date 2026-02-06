'use client';

import { useRouter } from 'next/navigation';

import { useSessionStore } from 'entities';

import { removeTokens } from 'shared/lib';
import { Button } from 'shared/ui';

const ChatsPage = () => {
  const router = useRouter();
  const setAuthenticated = useSessionStore(state => state.setAuthenticated);

  const handleLogout = () => {
    removeTokens();
    setAuthenticated(false);
    router.push('/sign-in');
  };

  return (
    <main className="flex flex-col items-center justify-center gap-6 bg-slate-50 p-4 min-h-full-screen">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Messenger</h1>
        <p className="text-sm text-slate-500">
          You are authenticated. Chat list will be here.
        </p>
      </div>
      <Button variant="danger" onClick={handleLogout}>
        Logout
      </Button>
    </main>
  );
};

export default ChatsPage;
