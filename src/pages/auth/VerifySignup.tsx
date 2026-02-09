// VerifySignup.tsx - Step 2: Verify codes using AuthService
// pages/auth/VerifySignup.tsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AuthService } from '../../services/auth/AuthService';
import { NotificationService } from '../../services/local/NotificationService';
import AuthHeader from './AuthHeader';
// import OTPInput from '../../components/OTPInput';
import type { SignupResponse, VerifySignupData } from '../../types/auth';
import OTPInput from '@/components/auth/OTPInput';

type Session = SignupResponse['data'];

const VerifySignup: React.FC = () => {
  const navigate = useNavigate();
  const { verifySignup } = useAuth();

  const [session, setSession] = useState<Session | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    const raw = sessionStorage.getItem('verification_data');
    if (!raw) {
      navigate('/auth/signup');
      return;
    }
    const parsed = JSON.parse(raw);
    setSession(parsed);
    setTimeLeft(parsed.expires_in_seconds ?? 600);
  }, [navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      sessionStorage.removeItem('verification_data');
      NotificationService.showToast('Verification expired. Please sign up again.', 'error');
      navigate('/auth/signup');
      return;
    }

    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || code.length !== 6) return;

    setLoading(true);
    try {
      const payload: VerifySignupData = {
        token: session.token,
        email_code: code,
      };

      await verifySignup(payload);
      NotificationService.showToast('Account verified successfully', 'success');
      navigate('/auth/signin');
    } finally {
      setLoading(false);
    }
  };
  /*
  const resend = async () => {
    if (!session) return;
    await AuthService.resendVerificationCode({
      token: session.token,
      type: 'email',
    });
    setTimeLeft(600);
    setCode('');
  };*/
  const resend = async () => {
  if (!session || resending) return;

  setResending(true);

  try {
    NotificationService.showToast(
      'Resending verification code…',
      'info'
    );

    await AuthService.resendVerificationCode({
      token: session.token,
      type: 'email',
    });

    setTimeLeft(600);
    setCode('');

    NotificationService.showToast(
      'Verification code resent successfully',
      'success'
    );
  } catch (err: any) {
    NotificationService.showToast(
      err?.message || 'Failed to resend code. Please try again.',
      'error'
    );
  } finally {
    setResending(false);
  }
};

  if (!session) return null;

  return (
    <main className="page-content">
      <div className="container">
        <div className="dz-authentication-area">
          <AuthHeader />

          <div className="text-center mb-4">
            <h3>Verify your account</h3>
            <p className="text-muted">
              Enter the 6-digit code sent to <strong>{session.email}</strong>
            </p>
            <small className="text-warning">
              Expires in {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, '0')}
            </small>
          </div>

          <form onSubmit={submit}>
            <OTPInput value={code} onChange={setCode} disabled={loading} />

            <button
              type="submit"
              className="btn btn-primary w-100 mt-4"
              disabled={loading || code.length !== 6}
            >
              {loading ? 'Verifying…' : 'Verify'}
            </button>

            <div className="text-center mt-3">

              {/* <button
                type="button"
                onClick={resend}
                className="btn btn-link p-0"
              >
                Didn’t receive a code? Resend
              </button> */}
              <button
                type="button"
                onClick={resend}
                className="btn btn-link p-0"
                disabled={resending || timeLeft > 540}
              >
                {resending ? 'Resending…' : 'Didn’t receive a code? Resend'}
              </button>

            </div>

            <div className="text-center mt-3">
              <Link to="/auth/signup" className="text-muted border border-secondary  p-1 rounded-2">
                Back to Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default VerifySignup;
