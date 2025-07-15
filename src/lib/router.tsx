/**
 * Router Configuration
 *
 * React Router v6 setup with authentication guards and route definitions
 * for the BloomTeq Work Tracker application.
 */

import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load components for code splitting
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage.js'));
const DashboardPage = lazy(() => import('../pages/DashboardPage.js'));
const WorkEntriesPage = lazy(() => import('../pages/WorkEntriesPage.js'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.js'));

// Layout components (to be created later)
const Layout = lazy(() => import('../components/layout/Layout'));
const AuthGuard = lazy(() => import('../components/auth/AuthGuard'));

// Loading component for Suspense
const PageLoader = () => (
  <div className='flex items-center justify-center min-h-screen'>
    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
  </div>
);

// Wrapper component for lazy-loaded pages
const LazyPageWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

// Protected route wrapper - requires authentication
const ProtectedRoute = () => (
  <LazyPageWrapper>
    <AuthGuard>
      <Layout>
        <Outlet />
      </Layout>
    </AuthGuard>
  </LazyPageWrapper>
);

// Public route wrapper - for login/register pages
const PublicRoute = () => (
  <LazyPageWrapper>
    <Outlet />
  </LazyPageWrapper>
);

// Router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/dashboard' replace />,
  },
  {
    path: '/auth',
    element: <PublicRoute />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        index: true,
        element: <Navigate to='/auth/login' replace />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: '/work-entries',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <WorkEntriesPage />,
      },
    ],
  },
  {
    path: '/404',
    element: (
      <LazyPageWrapper>
        <NotFoundPage />
      </LazyPageWrapper>
    ),
  },
  {
    path: '*',
    element: <Navigate to='/404' replace />,
  },
]);

// Route paths as constants for type safety
export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  DASHBOARD: '/dashboard',
  WORK_ENTRIES: '/work-entries',
  NOT_FOUND: '/404',
} as const;

// Navigation helpers
export const isAuthRoute = (pathname: string): boolean => {
  return pathname.startsWith('/auth');
};

export const isProtectedRoute = (pathname: string): boolean => {
  return pathname.startsWith('/dashboard');
};

// Route metadata for navigation and breadcrumbs
export const routeMetadata = {
  [ROUTES.AUTH.LOGIN]: {
    title: 'Sign In',
    description: 'Sign in to your work tracker account',
    requiresAuth: false,
  },
  [ROUTES.AUTH.REGISTER]: {
    title: 'Create Account',
    description: 'Create a new work tracker account',
    requiresAuth: false,
  },
  [ROUTES.DASHBOARD]: {
    title: 'Dashboard',
    description: 'Manage your work time entries',
    requiresAuth: true,
  },
  [ROUTES.WORK_ENTRIES]: {
    title: 'Work Entries',
    description: 'Track and manage your work time entries',
    requiresAuth: true,
  },
  [ROUTES.NOT_FOUND]: {
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist',
    requiresAuth: false,
  },
} as const;

// Type for route metadata
export type RouteMetadata = (typeof routeMetadata)[keyof typeof routeMetadata];

// Get route metadata by pathname
export const getRouteMetadata = (pathname: string): RouteMetadata | null => {
  return routeMetadata[pathname as keyof typeof routeMetadata] || null;
};

// Navigation items for the main navigation
export const navigationItems = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'LayoutDashboard', // Lucide icon name
    requiresAuth: true,
  },
  {
    label: 'Work Entries',
    path: ROUTES.WORK_ENTRIES,
    icon: 'Clock', // Lucide icon name
    requiresAuth: true,
  },
] as const;

// Auth navigation items
export const authNavigationItems = [
  {
    label: 'Sign In',
    path: ROUTES.AUTH.LOGIN,
    icon: 'LogIn',
  },
  {
    label: 'Create Account',
    path: ROUTES.AUTH.REGISTER,
    icon: 'UserPlus',
  },
] as const;
