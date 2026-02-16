// v3 - improved consistent component with verification steps

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthHeader from './AuthHeader';
import "@/styles/components/auth/Signup.css"

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({ 
    names: '', 
    username: '', 
    email: '', 
    phone: '', 
    password: '' 
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {

      await signup(formData);
      navigate('/auth/verify-signup');
      
    } catch (err: any) {
      console.warn(err.message || 'Registration failed', 'error');
      // NotificationService.showToast(err.message || 'Registration failed', 'error');
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
            <Link to="/" className="back-btn">
              <i className="feather icon-arrow-left" />
            </Link>
            {/* <div className="logo">
              <img src="images/logo.png" alt="logo" />
            </div> */}
          </div>
          <AuthHeader />
          <div className="section-head">
            {/* <h3 className="title">Create an account</h3> */}
            <p>
              Create An Account - Track Learning Progress & Performance.
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
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label" htmlFor="name">
                  Names(Full)
                </label>
                <div className="input-group input-mini input-lg">
                  <input
                    type="text"
                    id="names"
                    name="names"
                    className="form-control"
                    placeholder="Enter your full name"
                    value={formData.names}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <div className="input-group input-mini input-lg">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6 mb-4">
                  <label className="form-label" htmlFor="phone">
                    Phone
                  </label>
                  <div className="input-group input-mini input-lg">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="form-control"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
            </div>

              <div className="m-b30">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <div className="input-group input-mini input-lg">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="form-control dz-password"
                    placeholder="Create a password"
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
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </form>
            
            <div className="text-center">
              <p className="form-text">
                By tapping "Sign Up" you accept our{' '}
                <Link to="/terms" className="link">
                  terms
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="link">
                  condition
                </Link>
              </p>
              <p className="form-text mt-3">
                Already have an account?{' '}
                <Link to="/auth/signin" className="link">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Signup;
