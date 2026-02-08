'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useMe, useSessionStore } from 'entities';

import { ChatBubbleIcon, LogOutIcon, UserIcon } from 'shared/icons';
import { removeTokens } from 'shared/lib';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'shared/ui';

export const Navbar = () => {
  const router = useRouter();
  const { data: user } = useMe();
  const setAuthenticated = useSessionStore(state => state.setAuthenticated);
  const initial = user?.username?.charAt(0).toUpperCase() ?? '?';

  const handleLogout = () => {
    removeTokens();
    setAuthenticated(false);
    router.push('/sign-in');
  };

  return (
    <div className="h-[72px] w-full sm:h-[100px]">
      <header className="absolute left-1/2 top-2 z-40 w-[95%] -translate-x-1/2 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-lg sm:top-4 sm:w-4/5">
        <nav className="flex h-14 items-center justify-between px-3 sm:h-16 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/chats" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
                <ChatBubbleIcon className="h-4 w-4 stroke-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                Messenger
              </span>
            </Link>

            <Link
              href="/chats"
              className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 sm:inline"
            >
              Chats
            </Link>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand text-sm font-semibold text-white outline-none ring-offset-2 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                {initial}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push('/account')}>
                  <UserIcon />
                  Profile
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>
    </div>
  );
};
