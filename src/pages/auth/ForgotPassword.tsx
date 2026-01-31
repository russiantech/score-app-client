import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NotificationService } from '../../services/local/NotificationService';
import AuthHeader from './AuthHeader';
import { useAuth } from '../../hooks/useAuth';


const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      NotificationService.showToast('Please enter your email address', 'error');
      return;
    }

    setLoading(true);

    try {

        await forgotPassword(email);
        navigate('/auth/reset-password');
        
    } catch (error: any) {
      NotificationService.showToast(
        error.message || 'Failed to send reset instructions',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-content">
      <div className="container py-0">
        <div className="dz-authentication-area">
          
          <div className="main-logo">
            <Link to="/auth/signin" className="back-btn">
              <i className="feather icon-arrow-left" />
            </Link>
          </div>
          
          <AuthHeader />
          
          <div className="section-head">
            <h3 className="title">Forgot Password</h3>
            <p>
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>
          
          <div className="account-section">
            <form className="m-b20" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label" htmlFor="email">
                  Email Address
                </label>
                <div className="input-group input-mini input-lg">
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="btn btn-thin btn-lg w-100 btn-primary rounded-xl"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sending...
                  </>
                ) : (
                  'Send Reset Instructions'
                )}
              </button>
            </form>
            
            <div className="text-center">
              <p className="form-text">
                Remember your password?{' '}
                <Link to="/auth/signin" className="link">
                  Sign in
                </Link>
              </p>
              <p className="form-text mt-3">
                Don't have an account?{' '}
                <Link to="/auth/signup" className="link">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;

