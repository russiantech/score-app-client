// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import { NotificationService } from '../../services/local/NotificationService';

// const Signup: React.FC = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     username: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//     role: 'student' as 'student' | 'tutor' | 'parent',
//   });
//   const [loading, setLoading] = useState(false);
//   const { signup } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (formData.password !== formData.confirmPassword) {
//       NotificationService.showToast('Passwords do not match', 'error');
//       return;
//     }

//     setLoading(true);
    
//     try {
//       //
//       await signup(formData);
//       navigate('/');
//     } catch (error: any) {
//       NotificationService.showToast(error.message || 'Registration failed', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <div className="row justify-content-center">
//         <div className="col-md-8 col-lg-6">
//           <div className="card mt-5">
//             <div className="card-body p-5">
//               <div className="text-center mb-4">
//                 <img 
//                   src="/static/images/app-logo/logo.x.png" 
//                   alt="Dunistech Academy" 
//                   className="mb-3"
//                   style={{ height: '40px' }}
//                 />
//                 <h3 className="card-title mb-1">Create Account</h3>
//                 <p className="text-muted">Sign up to get started with Score App</p>
//               </div>

//               <form onSubmit={handleSubmit}>
//                 <div className="row">
//                   <div className="col-md-12 mb-3">
//                     <label htmlFor="name" className="form-label">Full Name</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="name"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       placeholder="Enter your full name"
//                       required
//                     />
//                   </div>

//                   <div className="col-md-12 mb-3">
//                     <label htmlFor="email" className="form-label">Email Address</label>
//                     <input
//                       type="email"
//                       className="form-control"
//                       id="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       placeholder="Enter your email"
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label htmlFor="password" className="form-label">Password</label>
//                     <input
//                       type="password"
//                       className="form-control"
//                       id="password"
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       placeholder="Create a password"
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
//                     <input
//                       type="password"
//                       className="form-control"
//                       id="confirmPassword"
//                       name="confirmPassword"
//                       value={formData.confirmPassword}
//                       onChange={handleChange}
//                       placeholder="Confirm your password"
//                       required
//                     />
//                   </div>

//                   <div className="col-md-12 mb-4">
//                     <label htmlFor="role" className="form-label">I am a</label>
//                     <select
//                       className="form-select"
//                       id="role"
//                       name="role"
//                       value={formData.role}
//                       onChange={handleChange}
//                       required
//                     >
//                       <option value="student">Student</option>
//                       <option value="tutor">Tutor</option>
//                       <option value="parent">Parent</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="d-grid mb-3">
//                   <button 
//                     type="submit" 
//                     className="btn btn-primary" 
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                         Creating Account...
//                       </>
//                     ) : 'Create Account'}
//                   </button>
//                 </div>

//                 <div className="text-center">
//                   <p className="mb-0">
//                     Already have an account?{' '}
//                     <Link to="/auth/login" className="text-decoration-none">
//                       Sign in
//                     </Link>
//                   </p>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;

// v2

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// // import AuthHeader from '../../components/auth/AuthHeader';
// // import SocialAuthButtons from '../../components/auth/SocialAuthButtons';
// import { useAuth } from '../../hooks/useAuth';
// import { NotificationService } from '../../services/local/NotificationService';
// import AuthHeader from './AuthHeader';
// import SocialAuthButtons from './SocialAuthButtons';

// const Signup: React.FC = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const [loading, setLoading] = useState(false);
//   const { signup } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       NotificationService.showToast('Passwords do not match', 'error');
//       return;
//     }

//     setLoading(true);
//     try {
//       await signup(formData);
//       navigate('/');
//     } catch (err: any) {
//       NotificationService.showToast(err.message || 'Signup failed', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="page account-area page-current">
//       <div className="page-content">
//         <div className="container">

//           <AuthHeader />

//           <form className="auth-form" onSubmit={handleSubmit}>
//             <h2 className="form-title">Create an account</h2>

//             <input
//               type="text"
//               name="name"
//               placeholder="Full name"
//               onChange={handleChange}
//               required
//             />

//             <input
//               type="email"
//               name="email"
//               placeholder="Email address"
//               onChange={handleChange}
//               required
//             />

//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               onChange={handleChange}
//               required
//             />

//             <input
//               type="password"
//               name="confirmPassword"
//               placeholder="Confirm password"
//               onChange={handleChange}
//               required
//             />

//             <button className="btn-primary w-100" disabled={loading}>
//               {loading ? 'Creating account…' : 'Sign up'}
//             </button>

//             <p className="auth-terms">
//               By signing up you agree to our <a href="#">Terms</a> & <a href="#">Privacy Policy</a>
//             </p>

//             <SocialAuthButtons />

//             <p className="auth-switch">
//               Already have an account?{' '}
//               <Link to="/auth/signin">Sign in</Link>
//             </p>
//           </form>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;



// // v3 - improved consistent component with verification steps

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
// import { NotificationService } from '../../services/local/NotificationService';
import AuthHeader from './AuthHeader';

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
/*
    const handleSubmit2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await AxiosService.json.post('/auth/signup', formData);
      
      if (response.data.success) {
        // Store token and user info for verification step
        const verificationData = {
          token: response.data.data.token,
          email: response.data.data.email,
          phone: response.data.data.phone,
          email_sent: response.data.data.email_sent,
          sms_sent: response.data.data.sms_sent,
          expires_in: response.data.data.expires_in_seconds
        };
        
        // Store in sessionStorage for verification page
        sessionStorage.setItem('verification_data', JSON.stringify(verificationData));
        
        NotificationService.showToast(
          response.data.message || 'Verification codes sent!', 
          'success'
        );
        
        // Navigate to verification page
        navigate('/auth/verify-signup');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Registration failed';
      NotificationService.showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };
*/

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


// v4 - supports verification steps before concluding signup

// Updated Signup.tsx - Step 1: Initiate signup and send verification codes

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { NotificationService } from '../../services/local/NotificationService';
// import { AxiosService } from '../../services/base/AxiosService';
// // import { AxiosService } from '../../services/api/AxiosService';

// /* 
// // import AuthHeader from '../../components/auth/AuthHeader';
// // import SocialAuthButtons from '../../components/auth/SocialAuthButtons';
// import { useAuth } from '../../hooks/useAuth';
// import { NotificationService } from '../../services/local/NotificationService';
// import AuthHeader from './AuthHeader';
// import SocialAuthButtons from './SocialAuthButtons';

// */

// const Signup: React.FC = () => {
//   const [formData, setFormData] = useState({ 
//     username: '', 
//     email: '', 
//     phone: '',
//     names: '',
//     password: '' 
//   });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       const response = await AxiosService.json.post('/auth/signup', formData);
      
//       if (response.data.success) {
//         // Store token and user info for verification step
//         const verificationData = {
//           token: response.data.data.token,
//           email: response.data.data.email,
//           phone: response.data.data.phone,
//           email_sent: response.data.data.email_sent,
//           sms_sent: response.data.data.sms_sent,
//           expires_in: response.data.data.expires_in_seconds
//         };
        
//         // Store in sessionStorage for verification page
//         sessionStorage.setItem('verification_data', JSON.stringify(verificationData));
        
//         NotificationService.showToast(
//           response.data.message || 'Verification codes sent!', 
//           'success'
//         );
        
//         // Navigate to verification page
//         navigate('/auth/verify-signup');
//       }
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.detail || err.message || 'Registration failed';
//       NotificationService.showToast(errorMessage, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <main className="page-content">
//       <div className="container py-0">
//         <div className="dz-authentication-area">
//           <div className="main-logo">
//             <Link to="/" className="back-btn">
//               <i className="feather icon-arrow-left" />
//             </Link>
//             <div className="logo">
//               <img src="images/logo.png" alt="logo" />
//             </div>
//           </div>
          
//           <div className="section-head">
//             <h3 className="title">Create an account</h3>
//             <p>
//               Join us today and start your journey with our amazing platform
//             </p>
//           </div>
          
//           <div className="account-section">
//             <form className="m-b20" onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="form-label" htmlFor="username">
//                   Username
//                 </label>
//                 <div className="input-group input-mini input-lg">
//                   <input
//                     type="text"
//                     id="username"
//                     name="username"
//                     className="form-control"
//                     placeholder="Choose a username"
//                     value={formData.username}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="form-label" htmlFor="names">
//                   Full Name
//                 </label>
//                 <div className="input-group input-mini input-lg">
//                   <input
//                     type="text"
//                     id="names"
//                     name="names"
//                     className="form-control"
//                     placeholder="Enter your full name"
//                     value={formData.names}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div className="mb-4">
//                 <label className="form-label" htmlFor="email">
//                   Email
//                 </label>
//                 <div className="input-group input-mini input-lg">
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     className="form-control"
//                     placeholder="Enter your email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="form-label" htmlFor="phone">
//                   Phone Number
//                 </label>
//                 <div className="input-group input-mini input-lg">
//                   <input
//                     type="tel"
//                     id="phone"
//                     name="phone"
//                     className="form-control"
//                     placeholder="+1234567890"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div className="m-b30">
//                 <label className="form-label" htmlFor="password">
//                   Password
//                 </label>
//                 <div className="input-group input-mini input-lg">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     id="password"
//                     name="password"
//                     className="form-control dz-password"
//                     placeholder="Create a password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                     minLength={8}
//                   />
//                   <span 
//                     className="input-group-text show-pass" 
//                     onClick={togglePasswordVisibility}
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <i className={`icon feather ${showPassword ? 'icon-eye eye-open' : 'icon-eye-off eye-close'}`} />
//                   </span>
//                 </div>
//               </div>
              
//               <button
//                 type="submit"
//                 className="btn btn-thin btn-lg w-100 btn-primary rounded-xl"
//                 disabled={loading}
//               >
//                 {loading ? 'Creating account...' : 'Sign up'}
//               </button>
//             </form>
            
//             <div className="text-center">
//               <p className="form-text">
//                 By tapping "Sign Up" you accept our{' '}
//                 <Link to="/terms" className="link">
//                   terms
//                 </Link>{' '}
//                 and{' '}
//                 <Link to="/privacy" className="link">
//                   condition
//                 </Link>
//               </p>
//               <p className="form-text mt-3">
//                 Already have an account?{' '}
//                 <Link to="/auth/signin" className="link">
//                   Sign in
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default Signup;
