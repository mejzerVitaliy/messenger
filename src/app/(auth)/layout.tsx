import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <main className="flex items-center justify-center bg-gradient-dark p-4 min-h-full-screen">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-card">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
