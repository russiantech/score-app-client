
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthHeader from './AuthHeader';
import ZoomSpinner from '@/components/shared/LoadingSpinner';

const Signin: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signin(formData.username, formData.password);
      // navigate('/me');
      navigate('/');
    } catch (err: any) {
      console.error('Error during sign in:', JSON.stringify(err));
      // NotificationService.showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            <h3 className="title">Welcome back</h3>
            <p>
              Sign in to your account to continue enjoying our services
            </p>
          </div>
          
          <div className="account-section">
            <form className="m-b20" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label" htmlFor="username">
                  Username
                </label>
                <div className="input-group input-mini input-lg">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    placeholder="Enter your username . phone . or email"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="m-b30">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <Link to="/auth/forgot-password" className="text-underline link">
                    Forgot Password?
                  </Link>
                </div>
                <div className="input-group input-mini input-lg">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="form-control dz-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span 
                    className="input-group-text show-pass" 
                    onClick={togglePasswordVisibility}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className={`icon feather ${showPassword ? 'icon-eye eye-open' : 'icon-eye-off eye-close'}`} />
                  </span>
                </div>
              </div>
              
              <button
                type="submit"
                className="btn btn-thin btn-lg w-100 btn-primary rounded-xl"
                disabled={loading}
              >
                {loading ? (
                 <ZoomSpinner size="sm"  text="Signing in..." />
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
            
            <div className="text-center">
              <p className="form-text">
                Don't have an account?{' '}
                <Link to="/auth/signup" className="link">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signin;
