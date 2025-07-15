import React from 'react';
import Header from './Header';

export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <main
        className={
          className || 'container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6'
        }
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
