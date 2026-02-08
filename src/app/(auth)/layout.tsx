import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <main className="flex items-center justify-center bg-gradient-dark px-3 py-6 min-h-full-screen sm:p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-card sm:p-8">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
