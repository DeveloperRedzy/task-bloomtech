import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { UserProfile } from '../auth/UserProfile';
import { SimpleDropdownMenu, DropdownMenuSeparator } from '../ui/dropdown-menu';

const Header: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-14 items-center justify-between max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Logo/Brand */}
        <div className='mr-4 hidden md:flex'>
          <Link to='/' className='mr-6 flex items-center space-x-2'>
            <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
              <span className='text-sm font-bold text-primary-foreground'>
                BT
              </span>
            </div>
            <span className='hidden font-bold sm:inline-block'>
              BloomTeq Tracker
            </span>
          </Link>
        </div>

        {/* Mobile logo */}
        <div className='mr-4 flex md:hidden'>
          <Link to='/' className='flex items-center space-x-2'>
            <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
              <span className='text-sm font-bold text-primary-foreground'>
                BT
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        {isAuthenticated && (
          <nav className='flex items-center space-x-6 text-sm font-medium flex-1'>
            <Link
              to='/dashboard'
              className={`transition-colors hover:text-foreground/80 ${
                isActiveRoute('/dashboard')
                  ? 'text-foreground'
                  : 'text-foreground/60'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to='/work-entries'
              className={`transition-colors hover:text-foreground/80 ${
                isActiveRoute('/work-entries')
                  ? 'text-foreground'
                  : 'text-foreground/60'
              }`}
            >
              Work Entries
            </Link>
          </nav>
        )}

        {/* Right side - Auth actions */}
        <div className='flex items-center justify-between space-x-2 md:justify-end'>
          {isAuthenticated && user ? (
            <div className='flex items-center space-x-2'>
              {/* User menu */}
              <SimpleDropdownMenu
                trigger={
                  <div className='relative h-8 w-8 rounded-full inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer'>
                    <div className='h-8 w-8 rounded-full bg-primary flex items-center justify-center'>
                      <span className='text-xs font-semibold text-primary-foreground'>
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </span>
                    </div>
                  </div>
                }
                align='end'
              >
                <div className='flex items-center justify-start gap-3 p-3'>
                  <div className='h-10 w-10 rounded-full bg-primary flex items-center justify-center'>
                    <span className='text-sm font-semibold text-primary-foreground'>
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className='flex flex-col space-y-1 leading-none'>
                    <p className='font-semibold text-sm'>
                      {user.firstName} {user.lastName}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <UserProfile />
              </SimpleDropdownMenu>
            </div>
          ) : (
            <div className='flex items-center space-x-2'>
              <Button variant='ghost' size='sm' asChild>
                <Link to='/login'>Sign In</Link>
              </Button>
              <Button size='sm' asChild>
                <Link to='/register'>Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
