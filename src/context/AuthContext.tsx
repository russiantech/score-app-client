import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { AuthService } from '../services/auth/AuthService';
import { NotificationService } from '../services/local/NotificationService';
import { UserStorageService } from '../services/local/UserStorageService';

import type {
  AuthPayload,
  ResetPasswordData,
  User,
  VerifySignupData,
} from '../types/auth';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
interface AuthContextType {
  auth: AuthPayload | null;
  loading: boolean;

  signin(email: string, password: string): Promise<void>;
  signout(): Promise<void>;

  signup(data: Partial<User>): Promise<void>;
  verifySignup(payload: VerifySignupData): Promise<void>;

  forgotPassword(email: string): Promise<void>;
  resetPassword(data: ResetPasswordData): Promise<void>;

  updateUser(data: Partial<User>): Promise<void>;
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

/* -------------------------------------------------------------------------- */
/* Provider                                                                   */
/* -------------------------------------------------------------------------- */

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthPayload | null>(null);
  const [loading, setLoading] = useState(true);

  /* ------------------------------------------------------------------------ */
  /* Helpers                                                                  */
  /* ------------------------------------------------------------------------ */

  const withLoading = async (fn: () => Promise<void>) => {
    try {
      setLoading(true);
      await fn();
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: any, fallback: string) => {
    NotificationService.showNotification(
      error?.message || fallback,
      '',
      'error'
    );
    throw error;
  };

  /* ------------------------------------------------------------------------ */
  /* Init                                                                     */
  /* ------------------------------------------------------------------------ */

  // useEffect(() => {
  //   const stored = UserStorageService.getCurrentUser();
  //   if (stored) setAuth(stored);
  //   setLoading(false);
  // }, []);

  useEffect(() => {
  const stored = UserStorageService.getCurrentUser();
  if (stored) setAuth(stored);
  setLoading(false);

  const onStorageChange = () => {
    const updated = UserStorageService.getCurrentUser();
    setAuth(updated);
  };

  window.addEventListener('auth:updated', onStorageChange);
  window.addEventListener('auth:logout', onStorageChange);

  return () => {
    window.removeEventListener('auth:updated', onStorageChange);
    window.removeEventListener('auth:logout', onStorageChange);
  };
}, []);


  /* ------------------------------------------------------------------------ */
  /* Auth Actions                                                             */
  /* ------------------------------------------------------------------------ */

  const signin = async (email: string, password: string) =>
    withLoading(async () => {
      try {
        const response = await AuthService.signin(email, password);
        if (response.success && response.data) {
          UserStorageService.authenticate(response.data);
          setAuth(response.data);

          NotificationService.showNotification(
            response.message || 'Signin successful',
            '',
            'success'
          );
        }
      } catch (error) {
        handleError(error, 'Signin failed');
      }
    });

  const signout = async () =>
    withLoading(async () => {
      try {
        await AuthService.signout();
      } catch {
        // Ignore backend logout errors
      } finally {
        UserStorageService.signout();
        setAuth(null);
        NotificationService.showNotification(
          'Signed out successfully',
          '',
          'info'
        );
      }
    });

  const signup = async (data: Partial<User>) =>
    withLoading(async () => {
      try {
        const response = await AuthService.signup(data);
        if (response.success && response.data) {
          sessionStorage.setItem(
            'verification_data',
            JSON.stringify(response.data)
          );
          NotificationService.showToast(
            response.message || 'Verification codes sent!',
            'success'
          );
        }
      } catch (error) {
        handleError(error, 'Signup failed');
      }
    });

  const verifySignup = async (payload: VerifySignupData) =>
    withLoading(async () => {
      try {
        const response = await AuthService.verifySignup(payload);
        if (response.success) {
          sessionStorage.removeItem('verification_data');
          NotificationService.showToast(
            response.message || 'Account verified successfully!',
            'success'
          );
        }
      } catch (error) {
        handleError(error, 'Verification failed');
      }
    });

  const forgotPassword = async (email: string) =>
    withLoading(async () => {
      try {
        const response = await AuthService.forgotPassword({ email });
        if (response.success) {
          sessionStorage.setItem('reset_email', email);
          NotificationService.showToast(
            response.message || 'Reset code sent to your email',
            'success'
          );
        }
      } catch (error) {
        handleError(error, 'Failed to send reset code');
      }
    });

  const resetPassword = async (data: ResetPasswordData) =>
    withLoading(async () => {
      try {
        const response = await AuthService.resetPassword(data);
        if (response.success) {
          sessionStorage.removeItem('reset_email');
          NotificationService.showToast(
            response.message || 'Password reset successfully',
            'success'
          );
        }
      } catch (error) {
        handleError(error, 'Failed to reset password');
      }
    });

  const updateUser = async (data: Partial<User>) =>
    withLoading(async () => {
      try {
        if (!auth) throw new Error('No user logged in');

        const updatedUser = { ...auth.user, ...data };
        const updatedAuth: AuthPayload = { ...auth, user: updatedUser };

        UserStorageService.authenticate(updatedAuth);
        setAuth(updatedAuth);

        NotificationService.showNotification(
          'Profile updated successfully',
          '',
          'success'
        );
      } catch (error) {
        handleError(error, 'Failed to update profile');
      }
    });

  /* ------------------------------------------------------------------------ */
  /* Provider                                                                 */
  /* ------------------------------------------------------------------------ */

  return (
    <AuthContext.Provider
      value={{
        auth,
        loading,
        signin,
        signout,
        signup,
        verifySignup,
        forgotPassword,
        resetPassword,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
