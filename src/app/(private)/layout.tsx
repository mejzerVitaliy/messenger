import { ReactNode } from 'react';

import { Navbar } from 'widgets';

type Props = {
  children: ReactNode;
};

const PrivateLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col bg-slate-50 min-h-full-screen">
      <Navbar />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default PrivateLayout;
