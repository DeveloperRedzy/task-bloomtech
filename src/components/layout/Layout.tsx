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
      <main className={className || 'container mx-auto px-4 py-6'}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
