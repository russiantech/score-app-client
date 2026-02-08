
// v2
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NotificationService } from '@/services/local/NotificationService';
import { useAuth } from '@/hooks/useAuth';
import AuthHeader from './AuthHeader';

const MIN_PASSWORD_LENGTH = 3;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
const CODE_LENGTH = 6;

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required';

    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }

    if (!PASSWORD_PATTERN.test(password)) {
      return 'Password must contain uppercase, lowercase, and a number';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetCode || resetCode.length !== CODE_LENGTH) {
      return NotificationService.showToast(
        `Reset code must be ${CODE_LENGTH} characters`,
        'error'
      );
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return NotificationService.showToast(passwordError, 'error');
    }

    if (newPassword !== confirmPassword) {
      return NotificationService.showToast('Passwords do not match', 'error');
    }

    setLoading(true);

    try {
      await resetPassword({
        reset_code: resetCode.trim().toUpperCase(),
        new_password: newPassword,
      });

      NotificationService.showToast(
        'Password reset successful! Redirecting to sign in...',
        'success'
      );

      setTimeout(() => navigate('/auth/signin'), 1500);
    } catch (err: any) {
      NotificationService.showToast(
        err?.message || 'Invalid or expired reset code. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-content">
      <div className="container">
        <div className="dz-authentication-area">
          <AuthHeader />

          <div className="section-head">
            <h3 className="title">Reset Password</h3>
            <p>Enter the reset code you received and choose a new password.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label">Reset Code</label>
              <input
                type="text"
                className="form-control text-center"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-digit code"
                maxLength={CODE_LENGTH}
                required
                style={{ letterSpacing: '0.5em', fontSize: '1.2rem' }}
              />
              <small className="form-text text-muted">
                Enter the {CODE_LENGTH}-digit code sent to your email
              </small>
            </div>

            <div className="mb-4">
              <label className="form-label">New Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  autoComplete="new-password"
                />
                <span
                  className="input-group-text"
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ cursor: 'pointer' }}
                >
                  {showPassword ? '👁' : '👁‍🗨'}
                </span>
              </div>
              <small className="form-text text-muted">
                Minimum {MIN_PASSWORD_LENGTH} characters with uppercase, lowercase, and number
              </small>
            </div>

            <div className="mb-4">
              <label className="form-label">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>

            <div className="text-center mt-3">
              <Link to="/auth/forgot-password" className="text-primary">
                Didn’t receive a code? Request a new one
              </Link>
            </div>

            <div className="text-center mt-2">
              <Link to="/auth/signin" className="text-muted">
                Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
