/**
 * Authentication Hooks Export Index
 *
 * Central export point for all authentication-related hooks.
 * Provides easy imports for components.
 */

// Core authentication hooks
export { useLogin } from './useLogin';
export { useRegister } from './useRegister';
export { useProfile } from './useProfile';
export { useLogout } from './useLogout';
export { useRefresh } from './useRefresh';

// Context hooks (re-exported for convenience)
export {
  useAuth,
  useAuthActions,
  useAuthContext,
} from '../../contexts/AuthContext';
