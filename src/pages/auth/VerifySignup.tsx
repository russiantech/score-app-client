// VerifySignup.tsx - Step 2: Verify codes using AuthService

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { NotificationService } from '../../services/local/NotificationService';
// import { AuthService } from '../../services/auth/AuthService';
// import { VerifySignupData } from '../../types/auth';

// const VerifySignup: React.FC = () => {
//   const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
//   const [emailCode, setEmailCode] = useState('');
//   const [phoneCode, setPhoneCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState<'email' | 'phone' | null>(null);
//   const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Get verification data from sessionStorage
//     const storedData = sessionStorage.getItem('verification_data');
    
//     if (!storedData) {
//       NotificationService.showToast('No verification session found. Please sign up again.', 'error');
//       navigate('/auth/signup');
//       return;
//     }

//     const data: VerificationData = JSON.parse(storedData);
//     setVerificationData(data);
//     setTimeRemaining(data.expires_in || 600);
//   }, [navigate]);

//   useEffect(() => {
//     // Countdown timer
//     if (timeRemaining <= 0) return;

//     const timer = setInterval(() => {
//       setTimeRemaining((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           NotificationService.showToast('Verification session expired. Please sign up again.', 'error');
//           sessionStorage.removeItem('verification_data');
//           navigate('/auth/signup');
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeRemaining, navigate]);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!verificationData) return;

//     // Validate at least one code is provided
//     if (!emailCode && !phoneCode) {
//       NotificationService.showToast('Please enter at least one verification code', 'error');
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload: any = {
//         token: verificationData.token
//       };

//       // Only include codes that are provided
//       if (emailCode) payload.email_code = emailCode;
//       if (phoneCode) payload.phone_code = phoneCode;

//       const response = await AuthService.verifySignup(payload);

//       if (response.success) {
//         NotificationService.showToast(
//           response.message || 'Account created successfully!',
//           'success'
//         );

//         // Clear verification data
//         sessionStorage.removeItem('verification_data');

//         // Navigate to signin
//         navigate('/auth/signin');
//       }
//     } catch (error: any) {
//       NotificationService.showToast(error.message, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResend = async (type: 'email' | 'phone') => {
//     if (!verificationData) return;

//     setResendLoading(type);

//     try {
//       const response = await AuthService.resendVerificationCode({
//         token: verificationData.token,
//         type
//       });

//       if (response.success) {
//         NotificationService.showToast(
//           response.message || `New ${type} verification code sent!`,
//           'success'
//         );
        
//         // Reset timer
//         setTimeRemaining(600);
//       }
//     } catch (error: any) {
//       NotificationService.showToast(error.message, 'error');
//     } finally {
//       setResendLoading(null);
//     }
//   };

//   if (!verificationData) {
//     return null;
//   }

//   return (
//     <main className="page-content">
//       <div className="container py-0">
//         <div className="dz-authentication-area">
//           <div className="main-logo">
//             <Link to="/auth/signup" className="back-btn">
//               <i className="feather icon-arrow-left" />
//             </Link>
//             <div className="logo">
//               <img src="images/logo.png" alt="logo" />
//             </div>
//           </div>

//           <div className="section-head">
//             <h3 className="title">Verify Your Account</h3>
//             <p>
//               We've sent verification codes to your email and phone. 
//               Enter at least one code to complete registration.
//             </p>
//           </div>

//           <div className="account-section">
//             {/* Timer Display */}
//             <div className="text-center mb-4">
//               <div className="alert alert-info" style={{ 
//                 padding: '10px', 
//                 borderRadius: '8px', 
//                 backgroundColor: '#e7f3ff',
//                 border: '1px solid #b3d9ff'
//               }}>
//                 <i className="feather icon-clock" style={{ marginRight: '8px' }} />
//                 Time remaining: <strong>{formatTime(timeRemaining)}</strong>
//               </div>
//             </div>

//             <form className="m-b20" onSubmit={handleVerify}>
//               {/* Email Verification */}
//               {verificationData.email_sent && (
//                 <div className="mb-4">
//                   <label className="form-label" htmlFor="emailCode">
//                     Email Verification Code
//                   </label>
//                   <div className="input-group input-mini input-lg">
//                     <input
//                       type="text"
//                       id="emailCode"
//                       className="form-control"
//                       placeholder="Enter 6-digit code"
//                       value={emailCode}
//                       onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                       maxLength={6}
//                     />
//                   </div>
//                   <small className="form-text text-muted">
//                     Sent to: {verificationData.email}
//                     {' · '}
//                     <span 
//                       className="link" 
//                       style={{ cursor: 'pointer' }}
//                       onClick={() => handleResend('email')}
//                     >
//                       {resendLoading === 'email' ? 'Resending...' : 'Resend code'}
//                     </span>
//                   </small>
//                 </div>
//               )}

//               {/* Phone Verification */}
//               {verificationData.sms_sent && (
//                 <div className="mb-4">
//                   <label className="form-label" htmlFor="phoneCode">
//                     Phone Verification Code
//                   </label>
//                   <div className="input-group input-mini input-lg">
//                     <input
//                       type="text"
//                       id="phoneCode"
//                       className="form-control"
//                       placeholder="Enter 6-digit code"
//                       value={phoneCode}
//                       onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                       maxLength={6}
//                     />
//                   </div>
//                   <small className="form-text text-muted">
//                     Sent to: {verificationData.phone}
//                     {' · '}
//                     <span 
//                       className="link" 
//                       style={{ cursor: 'pointer' }}
//                       onClick={() => handleResend('phone')}
//                     >
//                       {resendLoading === 'phone' ? 'Resending...' : 'Resend code'}
//                     </span>
//                   </small>
//                 </div>
//               )}

//               <div className="m-b30">
//                 <div className="alert alert-warning" style={{ 
//                   padding: '10px', 
//                   borderRadius: '8px',
//                   backgroundColor: '#fff3cd',
//                   border: '1px solid #ffc107',
//                   fontSize: '0.9em'
//                 }}>
//                   <i className="feather icon-info" style={{ marginRight: '8px' }} />
//                   You need to verify at least one method (email or phone) to continue.
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="btn btn-thin btn-lg w-100 btn-primary rounded-xl"
//                 disabled={loading || (!emailCode && !phoneCode)}
//               >
//                 {loading ? 'Verifying...' : 'Verify & Complete Signup'}
//               </button>
//             </form>

//             <div className="text-center">
//               <p className="form-text">
//                 Didn't receive the codes?{' '}
//                 <Link to="/auth/signup" className="link">
//                   Try signing up again
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default VerifySignup;


// // v2

// // VerifySignup.tsx - Step 2: Verify signup codes

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { NotificationService } from '../../services/local/NotificationService';
// import { AuthService } from '../../services/auth/AuthService';
// import type { SignupResponse, VerifySignupData } from '../../types/auth';
// // import {
// //   SignupResponse,
// //   VerifySignupData,
// // } from '../../types/auth';

// type VerificationSession = SignupResponse['data'];

// const VerifySignup: React.FC = () => {
//   const [verificationData, setVerificationData] =
//     useState<VerificationSession | null>(null);

//   const [emailCode, setEmailCode] = useState('');
//   const [phoneCode, setPhoneCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [resendLoading, setResendLoading] =
//     useState<'email' | 'phone' | null>(null);

//   const [timeRemaining, setTimeRemaining] = useState(600);
//   const navigate = useNavigate();

//   // ================================
//   // Load verification session
//   // ================================
//   useEffect(() => {
//     const storedData = sessionStorage.getItem('verification_data');

//     if (!storedData) {
//       NotificationService.showToast(
//         'No verification session found. Please sign up again.',
//         'error'
//       );
//       navigate('/auth/signup');
//       return;
//     }

//     const data: VerificationSession = JSON.parse(storedData);

//     setVerificationData(data);
//     setTimeRemaining(data.expires_in_seconds ?? 600);
//   }, [navigate]);

//   // ================================
//   // Countdown timer
//   // ================================
//   useEffect(() => {
//     if (timeRemaining <= 0) return;

//     const timer = setInterval(() => {
//       setTimeRemaining((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           NotificationService.showToast(
//             'Verification session expired. Please sign up again.',
//             'error'
//           );
//           sessionStorage.removeItem('verification_data');
//           navigate('/auth/signup');
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeRemaining, navigate]);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   // ================================
//   // Verify codes
//   // ================================
//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!verificationData) return;

//     if (!emailCode && !phoneCode) {
//       NotificationService.showToast(
//         'Please enter at least one verification code',
//         'error'
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload: VerifySignupData = {
//         token: verificationData.token,
//         ...(emailCode && { email_code: emailCode }),
//         ...(phoneCode && { phone_code: phoneCode }),
//       };

//       const response = await AuthService.verifySignup(payload);

//       if (response.success) {
//         NotificationService.showToast(
//           response.message || 'Account created successfully!',
//           'success'
//         );

//         sessionStorage.removeItem('verification_data');
//         navigate('/auth/signin');
//       }
//     } catch (error: any) {
//       NotificationService.showToast(
//         error.message || 'Verification failed',
//         'error'
//       );
//     } finally {
//       setLoading(false);
//     }
    
//   };

//   // ================================
//   // Resend code
//   // ================================
//   const handleResend = async (type: 'email' | 'phone') => {
//     if (!verificationData) return;

//     setResendLoading(type);

//     try {
//       const response = await AuthService.resendVerificationCode({
//         token: verificationData.token,
//         type,
//       });

//       if (response.success) {
//         NotificationService.showToast(
//           response.message || `New ${type} verification code sent!`,
//           'success'
//         );
//         setTimeRemaining(600);
//       }
//     } catch (error: any) {
//       NotificationService.showToast(
//         error.message || 'Failed to resend code',
//         'error'
//       );
//     } finally {
//       setResendLoading(null);
//     }
//   };

//   if (!verificationData) return null;

//   return (
//     <main className="page-content">
//       <div className="container py-0">
//         <div className="dz-authentication-area">
//           <div className="main-logo">
//             <Link to="/auth/signup" className="back-btn">
//               <i className="feather icon-arrow-left" />
//             </Link>
//             <div className="logo">
//               <img src="images/logo.png" alt="logo" />
//             </div>
//           </div>

//           <div className="section-head">
//             <h3 className="title">Verify Your Account</h3>
//             <p>
//               We've sent verification codes to your email and phone. 
//               Enter at least one code to complete registration.
//             </p>
//           </div>

//           <div className="account-section">
//             {/* Timer Display */}
//             <div className="text-center mb-4">
//               <div className="alert alert-info" style={{ 
//                 padding: '10px', 
//                 borderRadius: '8px', 
//                 backgroundColor: '#e7f3ff',
//                 border: '1px solid #b3d9ff'
//               }}>
//                 <i className="feather icon-clock" style={{ marginRight: '8px' }} />
//                 Time remaining: <strong>{formatTime(timeRemaining)}</strong>
//               </div>
//             </div>

//             <form className="m-b20" onSubmit={handleVerify}>
//               {/* Email Verification */}
//               {verificationData.email_sent && (
//                 <div className="mb-4">
//                   <label className="form-label" htmlFor="emailCode">
//                     Email Verification Code
//                   </label>
//                   <div className="input-group input-mini input-lg">
//                     <input
//                       type="text"
//                       id="emailCode"
//                       className="form-control"
//                       placeholder="Enter 6-digit code"
//                       value={emailCode}
//                       onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                       maxLength={6}
//                     />
//                   </div>
//                   <small className="form-text text-muted">
//                     Sent to: {verificationData.email}
//                     {' · '}
//                     <span 
//                       className="link" 
//                       style={{ cursor: 'pointer' }}
//                       onClick={() => handleResend('email')}
//                     >
//                       {resendLoading === 'email' ? 'Resending...' : 'Resend code'}
//                     </span>
//                   </small>
//                 </div>
//               )}

//               {/* Phone Verification */}
//               {verificationData.sms_sent && (
//                 <div className="mb-4">
//                   <label className="form-label" htmlFor="phoneCode">
//                     Phone Verification Code
//                   </label>
//                   <div className="input-group input-mini input-lg">
//                     <input
//                       type="text"
//                       id="phoneCode"
//                       className="form-control"
//                       placeholder="Enter 6-digit code"
//                       value={phoneCode}
//                       onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                       maxLength={6}
//                     />
//                   </div>
//                   <small className="form-text text-muted">
//                     Sent to: {verificationData.phone}
//                     {' · '}
//                     <span 
//                       className="link" 
//                       style={{ cursor: 'pointer' }}
//                       onClick={() => handleResend('phone')}
//                     >
//                       {resendLoading === 'phone' ? 'Resending...' : 'Resend code'}
//                     </span>
//                   </small>
//                 </div>
//               )}

//               <div className="m-b30">
//                 <div className="alert alert-warning" style={{ 
//                   padding: '10px', 
//                   borderRadius: '8px',
//                   backgroundColor: '#fff3cd',
//                   border: '1px solid #ffc107',
//                   fontSize: '0.9em'
//                 }}>
//                   <i className="feather icon-info" style={{ marginRight: '8px' }} />
//                   You need to verify at least one method (email or phone) to continue.
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="btn btn-thin btn-lg w-100 btn-primary rounded-xl"
//                 disabled={loading || (!emailCode && !phoneCode)}
//               >
//                 {loading ? 'Verifying...' : 'Verify & Complete Signup'}
//               </button>
//             </form>

//             <div className="text-center">
//               <p className="form-text">
//                 Didn't receive the codes?{' '}
//                 <Link to="/auth/signup" className="link">
//                   Try signing up again
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default VerifySignup;



// // v3 - use the types from auth.ts
// // VerifySignup.tsx - Step 2: Verify signup codes

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { NotificationService } from '../../services/local/NotificationService';
// import { AuthService } from '../../services/auth/AuthService';
// import type { SignupResponse, VerifySignupData } from '../../types/auth';
// import { useAuth } from '../../hooks/useAuth';

// type VerificationSession = SignupResponse['data'];

// const VerifySignup: React.FC = () => {
//   const [verificationData, setVerificationData] = useState<VerificationSession | null>(null);
//   const [emailCode, setEmailCode] = useState('');
//   const [phoneCode, setPhoneCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState<'email' | 'phone' | null>(null);
//   const [timeRemaining, setTimeRemaining] = useState(600);
  
//   const navigate = useNavigate();
//   const { verifySignup } = useAuth();

//   // ================================
//   // Load verification session
//   // ================================
//   useEffect(() => {
//     const storedData = sessionStorage.getItem('verification_data');

//     if (!storedData) {
//       NotificationService.showToast(
//         'No verification session found. Please sign up again.',
//         'error'
//       );
//       navigate('/auth/signup');
//       return;
//     }

//     try {
//       const data: VerificationSession = JSON.parse(storedData);
//       setVerificationData(data);
//       setTimeRemaining(data.expires_in_seconds ?? 600);
//     } catch (error) {
//       NotificationService.showToast(
//         'Invalid verification session. Please sign up again.',
//         'error'
//       );
//       navigate('/auth/signup');
//     }
//   }, [navigate]);

//   // ================================
//   // Countdown timer
//   // ================================
//   useEffect(() => {
//     if (timeRemaining <= 0) return;

//     const timer = setInterval(() => {
//       setTimeRemaining((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           NotificationService.showToast(
//             'Verification session expired. Please sign up again.',
//             'error'
//           );
//           sessionStorage.removeItem('verification_data');
//           navigate('/auth/signup');
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeRemaining, navigate]);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   // ================================
//   // Verify codes
//   // ================================
//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!verificationData) return;

//     if (!emailCode && !phoneCode) {
//       NotificationService.showToast(
//         'Please enter at least one verification code',
//         'error'
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload: VerifySignupData = {
//         token: verificationData.token,
//         ...(emailCode && { email_code: emailCode }),
//         ...(phoneCode && { phone_code: phoneCode }),
//       };

//       // Call verifySignup from AuthContext
//       await verifySignup(payload);
      
//       // ONLY navigate on successful verification
//       NotificationService.showToast(
//         'Account verified successfully! You can now sign in.',
//         'success'
//       );
      
//       // Wait a moment before redirecting
//       setTimeout(() => {
//         navigate('/auth/signin');
//       }, 1500);
      
//     } catch (error: any) {
//       // Error is already handled by AuthContext
//       console.error('Verification failed:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================================
//   // Resend code
//   // ================================
//   const handleResend = async (type: 'email' | 'phone') => {
//     if (!verificationData) return;

//     setResendLoading(type);

//     try {
//       const response = await AuthService.resendVerificationCode({
//         token: verificationData.token,
//         type,
//       });

//       if (response.success) {
//         NotificationService.showToast(
//           response.message || `New ${type} verification code sent!`,
//           'success'
//         );
//         setTimeRemaining(600);
//       }
//     } catch (error: any) {
//       NotificationService.showToast(
//         error.message || 'Failed to resend code',
//         'error'
//       );
//     } finally {
//       setResendLoading(null);
//     }
//   };

//   if (!verificationData) {
//     return (
//       <main className="page-content">
//         <div className="container py-0">
//           <div className="dz-authentication-area">
//             <div className="text-center p-5">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//               <p className="mt-3">Loading verification session...</p>
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="page-content">
//       <div className="container py-0">
//         <div className="dz-authentication-area">
//           <div className="main-logo">
//             <Link to="/auth/signup" className="back-btn">
//               <i className="feather icon-arrow-left" />
//             </Link>
//             <div className="logo">
//               <img src="images/logo.png" alt="logo" />
//             </div>
//           </div>

//           <div className="section-head">
//             <h3 className="title">Verify Your Account</h3>
//             <p>
//               We've sent verification codes to your email and phone. 
//               Enter at least one code to complete registration.
//             </p>
//           </div>

//           <div className="account-section">
//             {/* Timer Display */}
//             <div className="text-center mb-4">
//               <div className="alert alert-info" style={{ 
//                 padding: '10px', 
//                 borderRadius: '8px', 
//                 backgroundColor: '#e7f3ff',
//                 border: '1px solid #b3d9ff'
//               }}>
//                 <i className="feather icon-clock" style={{ marginRight: '8px' }} />
//                 Time remaining: <strong>{formatTime(timeRemaining)}</strong>
//               </div>
//             </div>

//             <form className="m-b20" onSubmit={handleVerify}>
//               {/* Email Verification */}
//               {verificationData.email_sent && (
//                 <div className="mb-4">
//                   <label className="form-label" htmlFor="emailCode">
//                     Email Verification Code
//                   </label>
//                   <div className="input-group input-mini input-lg">
//                     <input
//                       type="text"
//                       id="emailCode"
//                       className="form-control"
//                       placeholder="Enter 6-digit code"
//                       value={emailCode}
//                       onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                       maxLength={6}
//                       disabled={loading}
//                     />
//                   </div>
//                   <small className="form-text text-muted">
//                     Sent to: {verificationData.email}
//                     {' · '}
//                     <span 
//                       className="link" 
//                       style={{ cursor: resendLoading === 'email' ? 'wait' : 'pointer' }}
//                       onClick={() => !resendLoading && handleResend('email')}
//                     >
//                       {resendLoading === 'email' ? 'Resending...' : 'Resend code'}
//                     </span>
//                   </small>
//                 </div>
//               )}

//               {/* Phone Verification */}
//               {verificationData.sms_sent && (
//                 <div className="mb-4">
//                   <label className="form-label" htmlFor="phoneCode">
//                     Phone Verification Code
//                   </label>
//                   <div className="input-group input-mini input-lg">
//                     <input
//                       type="text"
//                       id="phoneCode"
//                       className="form-control"
//                       placeholder="Enter 6-digit code"
//                       value={phoneCode}
//                       onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                       maxLength={6}
//                       disabled={loading}
//                     />
//                   </div>
//                   <small className="form-text text-muted">
//                     Sent to: {verificationData.phone}
//                     {' · '}
//                     <span 
//                       className="link" 
//                       style={{ cursor: resendLoading === 'phone' ? 'wait' : 'pointer' }}
//                       onClick={() => !resendLoading && handleResend('phone')}
//                     >
//                       {resendLoading === 'phone' ? 'Resending...' : 'Resend code'}
//                     </span>
//                   </small>
//                 </div>
//               )}

//               <div className="m-b30">
//                 <div className="alert alert-warning" style={{ 
//                   padding: '10px', 
//                   borderRadius: '8px',
//                   backgroundColor: '#fff3cd',
//                   border: '1px solid #ffc107',
//                   fontSize: '0.9em'
//                 }}>
//                   <i className="feather icon-info" style={{ marginRight: '8px' }} />
//                   You need to verify at least one method (email or phone) to continue.
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="btn btn-thin btn-lg w-100 btn-primary rounded-xl"
//                 disabled={loading || (!emailCode && !phoneCode)}
//               >
//                 {loading ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                     Verifying...
//                   </>
//                 ) : (
//                   'Verify & Complete Signup'
//                 )}
//               </button>
//             </form>

//             <div className="text-center">
//               <p className="form-text">
//                 Didn't receive the codes?{' '}
//                 <Link to="/auth/signup" className="link">
//                   Try signing up again
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default VerifySignup;



// v4

// // VerifySignup.tsx - Step 2: Verify signup codes with OTP boxes

// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { NotificationService } from '../../services/local/NotificationService';
// import { AuthService } from '../../services/auth/AuthService';
// import type { SignupResponse, VerifySignupData } from '../../types/auth';
// import { useAuth } from '../../hooks/useAuth';
// import AuthHeader from './AuthHeader';

// type VerificationSession = SignupResponse['data'];

// // OTP Input Component for individual digit boxes
// interface OTPInputProps {
//   length?: number;
//   value: string;
//   onChange: (value: string) => void;
//   disabled?: boolean;
// }

// const OTPInput: React.FC<OTPInputProps> = ({ 
//   length = 6, 
//   value, 
//   onChange, 
//   disabled = false 
// }) => {
//   const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
//   const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

//   useEffect(() => {
//     // Initialize OTP from value
//     const newOtp = Array(length).fill('');
//     value.split('').forEach((char, index) => {
//       if (index < length) newOtp[index] = char;
//     });
//     setOtp(newOtp);
//   }, [value, length]);

//   const handleChange = (element: HTMLInputElement, index: number) => {
//     const newValue = element.value.replace(/\D/g, '').slice(0, 1);
    
//     if (newValue !== otp[index]) {
//       const newOtp = [...otp];
//       newOtp[index] = newValue;
//       setOtp(newOtp);
//       onChange(newOtp.join(''));
      
//       // Auto-focus next input
//       if (newValue && index < length - 1) {
//         const nextInput = inputsRef.current[index + 1];
//         if (nextInput) nextInput.focus();
//       }
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
//     // Handle backspace
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       const prevInput = inputsRef.current[index - 1];
//       if (prevInput) {
//         prevInput.focus();
//         const newOtp = [...otp];
//         newOtp[index - 1] = '';
//         setOtp(newOtp);
//         onChange(newOtp.join(''));
//       }
//     }
//   };

//   const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    
//     const newOtp = [...otp];
//     pastedData.split('').forEach((char, index) => {
//       if (index < length) newOtp[index] = char;
//     });
    
//     setOtp(newOtp);
//     onChange(newOtp.join(''));
    
//     // Focus the next empty input or the last one
//     const focusIndex = Math.min(pastedData.length, length - 1);
//     const nextInput = inputsRef.current[focusIndex];
//     if (nextInput) nextInput.focus();
//   };

//   return (
//     <div id="otp" className="digit-group input-mini d-flex justify-content-center gap-2">
//       {otp.map((digit, index) => (
//         <input
//           key={index}
//           ref={(el) => (inputsRef.current[index] = el)}
//           type="text"
//           className="form-control text-center"
//           placeholder=""
//           value={digit}
//           onChange={(e) => handleChange(e.target as HTMLInputElement, index)}
//           onKeyDown={(e) => handleKeyDown(e, index)}
//           onPaste={index === 0 ? handlePaste : undefined}
//           maxLength={1}
//           disabled={disabled}
//           style={{
//             width: '50px',
//             height: '50px',
//             fontSize: '1.2rem',
//             fontWeight: 'bold',
//             padding: '0'
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// const VerifySignup: React.FC = () => {
//   const [verificationData, setVerificationData] = useState<VerificationSession | null>(null);
//   const [emailCode, setEmailCode] = useState('');
//   const [phoneCode, setPhoneCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState<'email' | 'phone' | null>(null);
//   const [timeRemaining, setTimeRemaining] = useState(600);
  
//   const navigate = useNavigate();
//   const { verifySignup } = useAuth();

//   // ================================
//   // Load verification session
//   // ================================
//   useEffect(() => {
//     const storedData = sessionStorage.getItem('verification_data');

//     if (!storedData) {
//       NotificationService.showToast(
//         'No verification session found. Please sign up again.',
//         'error'
//       );
//       navigate('/auth/signup');
//       return;
//     }

//     try {
//       const data: VerificationSession = JSON.parse(storedData);
//       setVerificationData(data);
//       setTimeRemaining(data.expires_in_seconds ?? 600);
//     } catch (error) {
//       NotificationService.showToast(
//         'Invalid verification session. Please sign up again.',
//         'error'
//       );
//       navigate('/auth/signup');
//     }
//   }, [navigate]);

//   // ================================
//   // Countdown timer
//   // ================================
//   useEffect(() => {
//     if (timeRemaining <= 0) return;

//     const timer = setInterval(() => {
//       setTimeRemaining((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           NotificationService.showToast(
//             'Verification session expired. Please sign up again.',
//             'error'
//           );
//           sessionStorage.removeItem('verification_data');
//           navigate('/auth/signup');
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeRemaining, navigate]);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   // ================================
//   // Verify codes
//   // ================================
//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!verificationData) return;

//     if (!emailCode && !phoneCode) {
//       NotificationService.showToast(
//         'Please enter at least one verification code',
//         'error'
//       );
//       return;
//     }

//     // Validate code lengths
//     if (emailCode && emailCode.length !== 6) {
//       NotificationService.showToast(
//         'Email code must be 6 digits',
//         'error'
//       );
//       return;
//     }

//     if (phoneCode && phoneCode.length !== 6) {
//       NotificationService.showToast(
//         'Phone code must be 6 digits',
//         'error'
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload: VerifySignupData = {
//         token: verificationData.token,
//         ...(emailCode && { email_code: emailCode }),
//         ...(phoneCode && { phone_code: phoneCode }),
//       };

//       // Call verifySignup from AuthContext
//       await verifySignup(payload);
      
//       // ONLY navigate on successful verification
//       NotificationService.showToast(
//         'Account verified successfully! You can now sign in.',
//         'success'
//       );
      
//       // Wait a moment before redirecting
//       setTimeout(() => {
//         navigate('/auth/signin');
//       }, 1500);
      
//     } catch (error: any) {
//       // Error is already handled by AuthContext
//       console.error('Verification failed:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================================
//   // Resend code
//   // ================================
//   const handleResend = async (type: 'email' | 'phone') => {
//     if (!verificationData) return;

//     setResendLoading(type);

//     try {
//       const response = await AuthService.resendVerificationCode({
//         token: verificationData.token,
//         type,
//       });

//       if (response.success) {
//         NotificationService.showToast(
//           response.message || `New ${type} verification code sent!`,
//           'success'
//         );
//         setTimeRemaining(600);
        
//         // Clear the corresponding code field
//         if (type === 'email') setEmailCode('');
//         if (type === 'phone') setPhoneCode('');
//       }
//     } catch (error: any) {
//       NotificationService.showToast(
//         error.message || 'Failed to resend code',
//         'error'
//       );
//     } finally {
//       setResendLoading(null);
//     }
//   };

//   if (!verificationData) {
//     return (
//       <main className="page-content">
//         <div className="container py-0">
//           <div className="dz-authentication-area">
//             <div className="text-center p-5">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//               <p className="mt-3">Loading verification session...</p>
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="page-content">
//       <div className="container py-0">
//         <div className="dz-authentication-area">

//            <div className="main-logo">
//             <Link to="/auth/signin" className="back-btn">
//               <i className="feather icon-arrow-left" />
//             </Link>
//           </div>
          
//           <AuthHeader />

//           {/* Email Verification Section */}
//           {verificationData.email_sent && (
//             <div className="section-head text-center">
//               <h3 className="title">Enter Code</h3>
//               <p>
//                 An Authentication Code Has Been Sent To{' '}
//                 <span className="text-lowercase text-primary">
//                   {verificationData.email}
//                 </span>
//               </p>
//             </div>
//           )}

//           <div className="account-section">
//             {/* Timer Display */}
//             <div className="text-center mb-4">
//               <div className="alert alert-info" style={{ 
//                 padding: '10px', 
//                 borderRadius: '8px', 
//                 backgroundColor: '#e7f3ff',
//                 border: '1px solid #b3d9ff',
//                 fontSize: '0.9rem'
//               }}>
//                 <i className="feather icon-clock" style={{ marginRight: '8px' }} />
//                 Time remaining: <strong>{formatTime(timeRemaining)}</strong>
//               </div>
//             </div>

//             <form className="m-b20" onSubmit={handleVerify}>
//               {/* Email Verification */}
//               {verificationData.email_sent && (
//                 <div className="mb-4">
//                   <label className="form-label text-center d-block">
//                     Email Verification Code
//                   </label>
//                   <div className="d-flex justify-content-center mb-3">
//                     <OTPInput
//                       value={emailCode}
//                       onChange={setEmailCode}
//                       disabled={loading}
//                     />
//                   </div>
//                   <small className="form-text text-muted text-center d-block">
//                     Sent to: {verificationData.email}
//                     {' · '}
//                     <span 
//                       className="link" 
//                       style={{ 
//                         cursor: resendLoading === 'email' ? 'wait' : 'pointer',
//                         textDecoration: 'underline'
//                       }}
//                       onClick={() => !resendLoading && handleResend('email')}
//                     >
//                       {resendLoading === 'email' ? 'Resending...' : "Didn't receive code? Resend"}
//                     </span>
//                   </small>
//                 </div>
//               )}

//               {/* Divider if both methods are available */}
//               {verificationData.email_sent && verificationData.sms_sent && (
//                 <div className="text-center my-4">
//                   <div className="divider">
//                     <span className="divider-text">OR</span>
//                   </div>
//                 </div>
//               )}

//               {/* Phone Verification */}
//               {verificationData.sms_sent && (
//                 <div className="mb-4">
//                   <label className="form-label text-center d-block">
//                     Phone Verification Code
//                   </label>
//                   <div className="d-flex justify-content-center mb-3">
//                     <OTPInput
//                       value={phoneCode}
//                       onChange={setPhoneCode}
//                       disabled={loading}
//                     />
//                   </div>
//                   <small className="form-text text-muted text-center d-block">
//                     Sent to: {verificationData.phone}
//                     {' · '}
//                     <span 
//                       className="link" 
//                       style={{ 
//                         cursor: resendLoading === 'phone' ? 'wait' : 'pointer',
//                         textDecoration: 'underline'
//                       }}
//                       onClick={() => !resendLoading && handleResend('phone')}
//                     >
//                       {resendLoading === 'phone' ? 'Resending...' : "Didn't receive code? Resend"}
//                     </span>
//                   </small>
//                 </div>
//               )}

//               <div className="m-b30">
//                 <div className="alert alert-warning" style={{ 
//                   padding: '10px', 
//                   borderRadius: '8px',
//                   backgroundColor: '#fff3cd',
//                   border: '1px solid #ffc107',
//                   fontSize: '0.9em'
//                 }}>
//                   <i className="feather icon-info" style={{ marginRight: '8px' }} />
//                   You need to verify at least one method (email or phone) to continue.
//                 </div>
//               </div>

//               <div className="bottom-btn pb-3">
//                 <button
//                   type="submit"
//                   className="btn btn-thin btn-lg w-100 btn-primary rounded-xl"
//                   disabled={loading || (!emailCode && !phoneCode)}
//                 >
//                   {loading ? (
//                     <>
//                       <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                       Verifying...
//                     </>
//                   ) : (
//                     'Verify and proceed'
//                   )}
//                 </button>
                
//                 <div className="text-center mt-3 form-text">
//                   Back To{' '}
//                   <Link to="/auth/signin" className="text-underline link">
//                     Sign In
//                   </Link>
//                 </div>
//               </div>
//             </form>

//             <div className="text-center">
//               <p className="form-text">
//                 Didn't receive the codes?{' '}
//                 <Link to="/auth/signup" className="link" style={{ textDecoration: 'underline' }}>
//                   Try signing up again
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default VerifySignup;


// // v5 - supports alpha-numeric codes
// // v5 - Updated OTP Input Component for alphanumeric codes

// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { NotificationService } from '../../services/local/NotificationService';
// import { AuthService } from '../../services/auth/AuthService';
// import type { SignupResponse, VerifySignupData } from '../../types/auth';
// import { useAuth } from '../../hooks/useAuth';
// import AuthHeader from './AuthHeader';

// type VerificationSession = SignupResponse['data'];

// // OTP Input Component for alphanumeric codes
// interface OTPInputProps {
//   length?: number;
//   value: string;
//   onChange: (value: string) => void;
//   disabled?: boolean;
//   uppercaseOnly?: boolean;
// }

// const OTPInput: React.FC<OTPInputProps> = ({ 
//   length = 6, 
//   value, 
//   onChange, 
//   disabled = false,
//   uppercaseOnly = true
// }) => {
//   const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
//   const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

//   useEffect(() => {
//     // Initialize OTP from value
//     const newOtp = Array(length).fill('');
//     value.split('').forEach((char, index) => {
//       if (index < length) newOtp[index] = char;
//     });
//     setOtp(newOtp);
//   }, [value, length]);

//   const sanitizeInput = (input: string): string => {
//     // Allow alphanumeric characters
//     let sanitized = input.replace(/[^a-zA-Z0-9]/g, '');
    
//     // Convert to uppercase if needed
//     if (uppercaseOnly) {
//       sanitized = sanitized.toUpperCase();
//     }
    
//     return sanitized;
//   };

//   const handleChange = (element: HTMLInputElement, index: number) => {
//     const newValue = sanitizeInput(element.value).slice(0, 1);
    
//     if (newValue !== otp[index]) {
//       const newOtp = [...otp];
//       newOtp[index] = newValue;
//       setOtp(newOtp);
//       onChange(newOtp.join(''));
      
//       // Auto-focus next input
//       if (newValue && index < length - 1) {
//         const nextInput = inputsRef.current[index + 1];
//         if (nextInput) nextInput.focus();
//       }
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
//     // Handle backspace
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       const prevInput = inputsRef.current[index - 1];
//       if (prevInput) {
//         prevInput.focus();
//         const newOtp = [...otp];
//         newOtp[index - 1] = '';
//         setOtp(newOtp);
//         onChange(newOtp.join(''));
//       }
//     }
    
//     // Handle delete
//     if (e.key === 'Delete' && !otp[index]) {
//       const newOtp = [...otp];
//       newOtp[index] = '';
//       setOtp(newOtp);
//       onChange(newOtp.join(''));
//     }
    
//     // Handle arrow keys for navigation
//     if (e.key === 'ArrowLeft' && index > 0) {
//       const prevInput = inputsRef.current[index - 1];
//       if (prevInput) prevInput.focus();
//       e.preventDefault();
//     }
    
//     if (e.key === 'ArrowRight' && index < length - 1) {
//       const nextInput = inputsRef.current[index + 1];
//       if (nextInput) nextInput.focus();
//       e.preventDefault();
//     }
//   };

//   const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     const pastedData = sanitizeInput(e.clipboardData.getData('text')).slice(0, length);
    
//     const newOtp = [...otp];
//     pastedData.split('').forEach((char, index) => {
//       if (index < length) newOtp[index] = char;
//     });
    
//     setOtp(newOtp);
//     onChange(newOtp.join(''));
    
//     // Focus the next empty input or the last one
//     const focusIndex = Math.min(pastedData.length, length - 1);
//     const nextInput = inputsRef.current[focusIndex];
//     if (nextInput) nextInput.focus();
//   };

//   return (
//     <div id="otp" className="digit-group input-mini d-flex justify-content-center gap-2">
//       {otp.map((digit, index) => (
//         <input
//           key={index}
//           ref={(el) => (inputsRef.current[index] = el)}
//           type="text"
//           className="form-control text-center"
//           placeholder=""
//           value={digit}
//           onChange={(e) => handleChange(e.target as HTMLInputElement, index)}
//           onKeyDown={(e) => handleKeyDown(e, index)}
//           onPaste={index === 0 ? handlePaste : undefined}
//           onFocus={(e) => e.target.select()} // Select all text on focus
//           maxLength={1}
//           disabled={disabled}
//           style={{
//             width: '50px',
//             height: '50px',
//             fontSize: '1.2rem',
//             fontWeight: 'bold',
//             padding: '0',
//             textTransform: uppercaseOnly ? 'uppercase' : 'none'
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// const VerifySignup: React.FC = () => {
//   const [verificationData, setVerificationData] = useState<VerificationSession | null>(null);
//   const [emailCode, setEmailCode] = useState('');
//   const [phoneCode, setPhoneCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState<'email' | 'phone' | null>(null);
//   const [timeRemaining, setTimeRemaining] = useState(600);
  
//   const navigate = useNavigate();
//   const { verifySignup } = useAuth();

//   // ================================
//   // Load verification session
//   // ================================
//   useEffect(() => {
//     const storedData = sessionStorage.getItem('verification_data');

//     if (!storedData) {
//       NotificationService.showToast(
//         'No verification session found. Please sign up again.',
//         'error'
//       );
//       navigate('/auth/signup');
//       return;
//     }

//     try {
//       const data: VerificationSession = JSON.parse(storedData);
//       setVerificationData(data);
//       setTimeRemaining(data.expires_in_seconds ?? 600);
//     } catch (error) {
//       NotificationService.showToast(
//         'Invalid verification session. Please sign up again.',
//         'error'
//       );
//       navigate('/auth/signup');
//     }
//   }, [navigate]);

//   // ================================
//   // Countdown timer
//   // ================================
//   useEffect(() => {
//     if (timeRemaining <= 0) return;

//     const timer = setInterval(() => {
//       setTimeRemaining((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           NotificationService.showToast(
//             'Verification session expired. Please sign up again.',
//             'error'
//           );
//           sessionStorage.removeItem('verification_data');
//           navigate('/auth/signup');
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeRemaining, navigate]);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   // ================================
//   // Verify codes
//   // ================================
//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!verificationData) return;

//     if (!emailCode && !phoneCode) {
//       NotificationService.showToast(
//         'Please enter at least one verification code',
//         'error'
//       );
//       return;
//     }

//     // Validate code format - now alphanumeric, 6 characters
//     if (emailCode && emailCode.length !== 6) {
//       NotificationService.showToast(
//         'Email code must be 6 characters',
//         'error'
//       );
//       return;
//     }

//     if (phoneCode && phoneCode.length !== 6) {
//       NotificationService.showToast(
//         'Phone code must be 6 characters',
//         'error'
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload: VerifySignupData = {
//         token: verificationData.token,
//         ...(emailCode && { email_code: emailCode.toUpperCase() }), // Ensure uppercase
//         ...(phoneCode && { phone_code: phoneCode.toUpperCase() }), // Ensure uppercase
//       };

//       // Call verifySignup from AuthContext
//       await verifySignup(payload);
      
//       // ONLY navigate on successful verification
//       NotificationService.showToast(
//         'Account verified successfully! You can now sign in.',
//         'success'
//       );
      
//       // Wait a moment before redirecting
//       setTimeout(() => {
//         navigate('/auth/signin');
//       }, 1500);
      
//     } catch (error: any) {
//       // Error is already handled by AuthContext
//       console.error('Verification failed:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================================
//   // Resend code
//   // ================================
//   const handleResend = async (type: 'email' | 'phone') => {
//     if (!verificationData) return;

//     setResendLoading(type);

//     try {
//       const response = await AuthService.resendVerificationCode({
//         token: verificationData.token,
//         type,
//       });

//       if (response.success) {
//         NotificationService.showToast(
//           response.message || `New ${type} verification code sent!`,
//           'success'
//         );
//         setTimeRemaining(600);
        
//         // Clear the corresponding code field
//         if (type === 'email') setEmailCode('');
//         if (type === 'phone') setPhoneCode('');
//       }
//     } catch (error: any) {
//       NotificationService.showToast(
//         error.message || 'Failed to resend code',
//         'error'
//       );
//     } finally {
//       setResendLoading(null);
//     }
//   };

//   if (!verificationData) {
//     return (
//       <main className="page-content">
//         <div className="container py-0">
//           <div className="dz-authentication-area">
//             <div className="text-center p-5">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//               <p className="mt-3">Loading verification session...</p>
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="page-content">
//       <div className="container py-0">
//         <div className="dz-authentication-area">
//           <div className="main-logo">
//             <Link to="/auth/signin" className="back-btn">
//               <i className="feather icon-arrow-left" />
//             </Link>
//           </div>
          
//           <AuthHeader />

//           {/* Email Verification Section */}
//           {verificationData.email_sent && (
//             <div className="section-head text-center">
//               <h3 className="title">Enter Code</h3>
//               <p>
//                 A verification code has been sent to{' '}
//                 <span className="text-lowercase text-primary">
//                   {verificationData.email}
//                 </span>
//               </p>
//             </div>
//           )}

//           <div className="account-section">
//             {/* Timer Display */}
//             <div className="text-center mb-4">
//               <div className="alert alert-info" style={{ 
//                 padding: '10px', 
//                 borderRadius: '8px', 
//                 backgroundColor: '#e7f3ff',
//                 border: '1px solid #b3d9ff',
//                 fontSize: '0.9rem'
//               }}>
//                 <i className="feather icon-clock" style={{ marginRight: '8px' }} />
//                 Time remaining: <strong>{formatTime(timeRemaining)}</strong>
//               </div>
//             </div>

//             {/* Code Format Hint */}
//             <div className="text-center mb-3">
//               <div className="alert alert-light d-inline-flex align-items-center">
//                 <i className="feather icon-info text-info me-2" />
//                 <small>Enter the 6-character code (letters & numbers)</small>
//               </div>
//             </div>

//             <form className="m-b20" onSubmit={handleVerify}>
//               {/* Email Verification */}
//               {verificationData.email_sent && (
//                 <div className="mb-4">
//                   <label className="form-label text-center d-block">
//                     Email Verification Code
//                   </label>
//                   <div className="d-flex justify-content-center mb-3">
//                     <OTPInput
//                       value={emailCode}
//                       onChange={setEmailCode}
//                       disabled={loading}
//                       uppercaseOnly={true}
//                     />
//                   </div>
//                   <small className="form-text text-muted text-center d-block">
//                     Sent to: {verificationData.email}
//                     {' · '}
//                     <span 
//                       className="link" 
//                       style={{ 
//                         cursor: resendLoading === 'email' ? 'wait' : 'pointer',
//                         textDecoration: 'underline'
//                       }}
//                       onClick={() => !resendLoading && handleResend('email')}
//                     >
//                       {resendLoading === 'email' ? 'Resending...' : "Didn't receive code? Resend"}
//                     </span>
//                   </small>
//                 </div>
//               )}

//               {/* Divider if both methods are available */}
//               {verificationData.email_sent && verificationData.sms_sent && (
//                 <div className="text-center my-4">
//                   <div className="divider">
//                     <span className="divider-text">OR</span>
//                   </div>
//                 </div>
//               )}

//               {/* Phone Verification */}
//               {verificationData.sms_sent && (
//                 <div className="mb-4">
//                   <label className="form-label text-center d-block">
//                     Phone Verification Code
//                   </label>
//                   <div className="d-flex justify-content-center mb-3">
//                     <OTPInput
//                       value={phoneCode}
//                       onChange={setPhoneCode}
//                       disabled={loading}
//                       uppercaseOnly={true}
//                     />
//                   </div>
//                   <small className="form-text text-muted text-center d-block">
//                     Sent to: {verificationData.phone}
//                     {' · '}
//                     <span 
//                       className="link" 
//                       style={{ 
//                         cursor: resendLoading === 'phone' ? 'wait' : 'pointer',
//                         textDecoration: 'underline'
//                       }}
//                       onClick={() => !resendLoading && handleResend('phone')}
//                     >
//                       {resendLoading === 'phone' ? 'Resending...' : "Didn't receive code? Resend"}
//                     </span>
//                   </small>
//                 </div>
//               )}

//               <div className="m-b30">
//                 <div className="alert alert-warning" style={{ 
//                   padding: '10px', 
//                   borderRadius: '8px',
//                   backgroundColor: '#fff3cd',
//                   border: '1px solid #ffc107',
//                   fontSize: '0.9em'
//                 }}>
//                   <i className="feather icon-info" style={{ marginRight: '8px' }} />
//                   You need to verify at least one method (email or phone) to continue.
//                 </div>
//               </div>

//               <div className="bottom-btn pb-3">
//                 <button
//                   type="submit"
//                   className="btn btn-thin btn-lg w-100 btn-primary rounded-xl"
//                   disabled={loading || (!emailCode && !phoneCode)}
//                 >
//                   {loading ? (
//                     <>
//                       <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                       Verifying...
//                     </>
//                   ) : (
//                     'Verify and proceed'
//                   )}
//                 </button>
                
//                 <div className="text-center mt-3 form-text">
//                   Back To{' '}
//                   <Link to="/auth/signin" className="text-underline link">
//                     Sign In
//                   </Link>
//                 </div>
//               </div>
//             </form>

//             <div className="text-center">
//               <p className="form-text">
//                 Didn't receive the codes?{' '}
//                 <Link to="/auth/signup" className="link" style={{ textDecoration: 'underline' }}>
//                   Try signing up again
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default VerifySignup;


// v6 - improved - supports pasting and deleting individually at any index

// // v6 - Enhanced OTP Input Component with better deletion and paste support

// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { NotificationService } from '../../services/local/NotificationService';
// import { AuthService } from '../../services/auth/AuthService';
// import type { SignupResponse, VerifySignupData } from '../../types/auth';
// import { useAuth } from '../../hooks/useAuth';
// import AuthHeader from './AuthHeader';

// type VerificationSession = SignupResponse['data'];

// // Enhanced OTP Input Component for alphanumeric codes
// interface OTPInputProps {
//   length?: number;
//   value: string;
//   onChange: (value: string) => void;
//   disabled?: boolean;
//   uppercaseOnly?: boolean;
// }

// const OTPInput: React.FC<OTPInputProps> = ({ 
//   length = 6, 
//   value, 
//   onChange, 
//   disabled = false,
//   uppercaseOnly = true
// }) => {
//   const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
//   const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
//   const [focusedIndex, setFocusedIndex] = useState<number>(-1);

//   useEffect(() => {
//     // Initialize OTP from value
//     const newOtp = Array(length).fill('');
//     value.split('').forEach((char, index) => {
//       if (index < length) newOtp[index] = char;
//     });
//     setOtp(newOtp);
//   }, [value, length]);

//   const sanitizeInput = (input: string): string => {
//     // Allow alphanumeric characters
//     let sanitized = input.replace(/[^a-zA-Z0-9]/g, '');
    
//     // Convert to uppercase if needed
//     if (uppercaseOnly) {
//       sanitized = sanitized.toUpperCase();
//     }
    
//     return sanitized;
//   };

//   const handleChange = (element: HTMLInputElement, index: number) => {
//     let newValue = sanitizeInput(element.value);
    
//     // Handle multiple characters (for paste)
//     if (newValue.length > 1) {
//       // Fill multiple boxes with the pasted value
//       const newOtp = [...otp];
//       const chars = newValue.split('');
      
//       chars.forEach((char, charIndex) => {
//         const targetIndex = index + charIndex;
//         if (targetIndex < length) {
//           newOtp[targetIndex] = char;
//         }
//       });
      
//       setOtp(newOtp);
//       onChange(newOtp.join(''));
      
//       // Focus the next empty input or the last one
//       const nextIndex = Math.min(index + chars.length, length - 1);
//       const nextInput = inputsRef.current[nextIndex];
//       if (nextInput) nextInput.focus();
//       return;
//     }
    
//     // Single character input
//     newValue = newValue.slice(0, 1);
    
//     if (newValue !== otp[index]) {
//       const newOtp = [...otp];
//       newOtp[index] = newValue;
//       setOtp(newOtp);
//       onChange(newOtp.join(''));
      
//       // Auto-focus next input if value entered
//       if (newValue && index < length - 1) {
//         const nextInput = inputsRef.current[index + 1];
//         if (nextInput) {
//           nextInput.focus();
//           setFocusedIndex(index + 1);
//         }
//       }
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
//     // Handle backspace - current box has value
//     if (e.key === 'Backspace' && otp[index] && !e.ctrlKey && !e.metaKey) {
//       e.preventDefault();
//       const newOtp = [...otp];
//       newOtp[index] = '';
//       setOtp(newOtp);
//       onChange(newOtp.join(''));
//       return;
//     }
    
//     // Handle backspace - current box is empty, delete previous box
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       e.preventDefault();
//       const prevInput = inputsRef.current[index - 1];
//       if (prevInput) {
//         const newOtp = [...otp];
//         newOtp[index - 1] = '';
//         setOtp(newOtp);
//         onChange(newOtp.join(''));
//         prevInput.focus();
//         setFocusedIndex(index - 1);
//       }
//       return;
//     }
    
//     // Handle delete key - delete current character and shift focus
//     if (e.key === 'Delete') {
//       e.preventDefault();
//       const newOtp = [...otp];
//       newOtp[index] = '';
//       setOtp(newOtp);
//       onChange(newOtp.join(''));
//       return;
//     }
    
//     // Handle arrow keys for navigation
//     if (e.key === 'ArrowLeft' && index > 0) {
//       const prevInput = inputsRef.current[index - 1];
//       if (prevInput) {
//         prevInput.focus();
//         setFocusedIndex(index - 1);
//       }
//       e.preventDefault();
//     }
    
//     if (e.key === 'ArrowRight' && index < length - 1) {
//       const nextInput = inputsRef.current[index + 1];
//       if (nextInput) {
//         nextInput.focus();
//         setFocusedIndex(index + 1);
//       }
//       e.preventDefault();
//     }
    
//     // Handle home/end keys
//     if (e.key === 'Home') {
//       const firstInput = inputsRef.current[0];
//       if (firstInput) {
//         firstInput.focus();
//         setFocusedIndex(0);
//       }
//       e.preventDefault();
//     }
    
//     if (e.key === 'End') {
//       const lastInput = inputsRef.current[length - 1];
//       if (lastInput) {
//         lastInput.focus();
//         setFocusedIndex(length - 1);
//       }
//       e.preventDefault();
//     }
    
//     // Handle Ctrl/Cmd + A to select all
//     if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
//       e.preventDefault();
//       const allInputs = inputsRef.current.filter(Boolean);
//       if (allInputs.length > 0) {
//         // Focus the first input and select all
//         const firstInput = allInputs[0];
//         firstInput.focus();
//         // We can't select across multiple inputs, but we can focus first
//       }
//     }
//   };

//   const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
//     e.preventDefault();
//     const pastedData = sanitizeInput(e.clipboardData.getData('text'));
    
//     if (!pastedData) return;
    
//     // Fill OTP array starting from the paste index
//     const newOtp = [...otp];
//     const chars = pastedData.split('');
    
//     chars.forEach((char, charIndex) => {
//       const targetIndex = index + charIndex;
//       if (targetIndex < length) {
//         newOtp[targetIndex] = char;
//       }
//     });
    
//     setOtp(newOtp);
//     onChange(newOtp.join(''));
    
//     // Focus the next empty input or the last one
//     const nextIndex = Math.min(index + chars.length, length - 1);
//     const nextInput = inputsRef.current[nextIndex];
//     if (nextInput) {
//       nextInput.focus();
//       setFocusedIndex(nextIndex);
//     }
//   };

//   const handleFocus = (index: number) => {
//     setFocusedIndex(index);
//   };

//   const handleBlur = () => {
//     setFocusedIndex(-1);
//   };

//   // Clear a specific character
//   const clearCharacter = (index: number) => {
//     const newOtp = [...otp];
//     newOtp[index] = '';
//     setOtp(newOtp);
//     onChange(newOtp.join(''));
    
//     // Focus the cleared box
//     const input = inputsRef.current[index];
//     if (input) {
//       input.focus();
//       setFocusedIndex(index);
//     }
//   };

//   return (
//     <div id="otp" className="digit-group input-mini d-flex justify-content-center gap-2">
//       {otp.map((digit, index) => (
//         <div key={index} className="position-relative">
//           <input
//             ref={(el) => (inputsRef.current[index] = el)}
//             type="text"
//             className="form-control text-center"
//             placeholder=""
//             value={digit}
//             onChange={(e) => handleChange(e.target as HTMLInputElement, index)}
//             onKeyDown={(e) => handleKeyDown(e, index)}
//             onPaste={(e) => handlePaste(e, index)}
//             onFocus={() => handleFocus(index)}
//             onBlur={handleBlur}
//             onClick={() => handleFocus(index)}
//             maxLength={1}
//             disabled={disabled}
//             style={{
//               width: '50px',
//               height: '50px',
//               fontSize: '1.2rem',
//               fontWeight: 'bold',
//               padding: '0',
//               textTransform: uppercaseOnly ? 'uppercase' : 'none',
//               position: 'relative',
//               zIndex: 1,
//               borderColor: focusedIndex === index ? '#4a6fa5' : undefined,
//               boxShadow: focusedIndex === index ? '0 0 0 2px rgba(74, 111, 165, 0.25)' : 'none'
//             }}
//           />
//           {/* Clear button for the box */}
//           {digit && (
//             <button
//               type="button"
//               className="btn btn-link p-0 position-absolute"
//               onClick={(e) => {
//                 e.preventDefault();
//                 clearCharacter(index);
//               }}
//               style={{
//                 top: '-8px',
//                 right: '-8px',
//                 zIndex: 2,
//                 width: '20px',
//                 height: '20px',
//                 borderRadius: '50%',
//                 backgroundColor: '#ff6b6b',
//                 color: 'white',
//                 border: 'none',
//                 fontSize: '12px',
//                 lineHeight: '18px',
//                 padding: 0,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 cursor: 'pointer'
//               }}
//               title="Clear this character"
//               aria-label="Clear character"
//             >
//               ×
//             </button>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// const VerifySignup: React.FC = () => {
//   const [verificationData, setVerificationData] = useState<VerificationSession | null>(null);
//   const [emailCode, setEmailCode] = useState('');
//   const [phoneCode, setPhoneCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState<'email' | 'phone' | null>(null);
//   const [timeRemaining, setTimeRemaining] = useState(600);
  
//   const navigate = useNavigate();
//   const { verifySignup } = useAuth();

//   // ================================
//   // Load verification session
//   // ================================
//   useEffect(() => {
//     const storedData = sessionStorage.getItem('verification_data');

//     if (!storedData) {
//       NotificationService.showToast(
//         'No verification session found. Please sign up again.',
//         'error'
//       );
//       navigate('/auth/signup');
//       return;
//     }

//     try {
//       const data: VerificationSession = JSON.parse(storedData);
//       setVerificationData(data);
//       setTimeRemaining(data.expires_in_seconds ?? 600);
//     } catch (error) {
//       NotificationService.showToast(
//         'Invalid verification session. Please sign up again.',
//         'error'
//       );
//       navigate('/auth/signup');
//     }
//   }, [navigate]);

//   // ================================
//   // Countdown timer
//   // ================================
//   useEffect(() => {
//     if (timeRemaining <= 0) return;

//     const timer = setInterval(() => {
//       setTimeRemaining((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           NotificationService.showToast(
//             'Verification session expired. Please sign up again.',
//             'error'
//           );
//           sessionStorage.removeItem('verification_data');
//           navigate('/auth/signup');
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeRemaining, navigate]);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   // ================================
//   // Verify codes
//   // ================================
//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!verificationData) return;

//     if (!emailCode && !phoneCode) {
//       NotificationService.showToast(
//         'Please enter at least one verification code',
//         'error'
//       );
//       return;
//     }

//     // Validate code format - now alphanumeric, 6 characters
//     if (emailCode && emailCode.length !== 6) {
//       NotificationService.showToast(
//         'Email code must be 6 characters',
//         'error'
//       );
//       return;
//     }

//     if (phoneCode && phoneCode.length !== 6) {
//       NotificationService.showToast(
//         'Phone code must be 6 characters',
//         'error'
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload: VerifySignupData = {
//         token: verificationData.token,
//         ...(emailCode && { email_code: emailCode.toUpperCase() }),
//         ...(phoneCode && { phone_code: phoneCode.toUpperCase() }),
//       };

//       // Call verifySignup from AuthContext
//       await verifySignup(payload);
      
//       // ONLY navigate on successful verification
//       NotificationService.showToast(
//         'Account verified successfully! You can now sign in.',
//         'success'
//       );
      
//       // Wait a moment before redirecting
//       setTimeout(() => {
//         navigate('/auth/signin');
//       }, 1500);
      
//     } catch (error: any) {
//       // Error is already handled by AuthContext
//       console.error('Verification failed:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================================
//   // Resend code
//   // ================================
//   const handleResend = async (type: 'email' | 'phone') => {
//     if (!verificationData) return;

//     setResendLoading(type);

//     try {
//       const response = await AuthService.resendVerificationCode({
//         token: verificationData.token,
//         type,
//       });

//       if (response.success) {
//         NotificationService.showToast(
//           response.message || `New ${type} verification code sent!`,
//           'success'
//         );
//         setTimeRemaining(600);
        
//         // Clear the corresponding code field
//         if (type === 'email') setEmailCode('');
//         if (type === 'phone') setPhoneCode('');
//       }
//     } catch (error: any) {
//       NotificationService.showToast(
//         error.message || 'Failed to resend code',
//         'error'
//       );
//     } finally {
//       setResendLoading(null);
//     }
//   };

//   // Clear all characters for a specific code
//   const clearEmailCode = () => {
//     setEmailCode('');
//   };

//   const clearPhoneCode = () => {
//     setPhoneCode('');
//   };

//   if (!verificationData) {
//     return (
//       <main className="page-content">
//         <div className="container py-0">
//           <div className="dz-authentication-area">
//             <div className="text-center p-5">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//               <p className="mt-3">Loading verification session...</p>
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="page-content">
//       <div className="container py-0">
//         <div className="dz-authentication-area d-flex justify-content-center">
//         <div className="auth-wrapper w-100">
//           <AuthHeader />

//           {/* Email Verification Section */}
//           {verificationData.email_sent && (
//             <div className="section-head text-center">
//               <h3 className="title">Enter Code</h3>
//               <p>
//                 A verification code has been sent to{' '}
//                 <span className="text-lowercase text-primary">
//                   {verificationData.email}
//                 </span>
//               </p>
//             </div>
//           )}

//           <div className="account-section">
//             {/* Timer Display */}
//             <div className="text-center mb-2">
//               <div className="alert alert-info" style={{ 
//                 padding: '10px', 
//                 borderRadius: '8px', 
//                 backgroundColor: '#e7f3ff',
//                 border: '1px solid #b3d9ff',
//                 fontSize: '0.9rem'
//               }}>
//                 <i className="feather icon-clock" style={{ marginRight: '8px' }} />
//                 Time remaining: <strong>{formatTime(timeRemaining)}</strong>
//               </div>
//             </div>

//             {/* Code Format Hint */}
//             <div className="text-center mb-2">
//               <div className="alert alert-light d-inline-flex align-items-center">
//                 <i className="feather icon-info text-info me-2" />
//                 <small>Enter the 6-character code (letters & numbers)</small>
//               </div>
//             </div>

//             <form className="m-b20" onSubmit={handleVerify}>
//               {/* Email Verification */}
//               {verificationData.email_sent && (
//                 <div className="mb-4">
//                   <div className="d-flex justify-content-between align-items-center mb-2">
//                     <label className="form-label">
//                       Email Verification Code
//                     </label>
//                     {emailCode && (
//                       <button
//                         type="button"
//                         className="btn btn-link btn-sm p-0"
//                         onClick={clearEmailCode}
//                         style={{ fontSize: '0.875rem' }}
//                       >
//                         Clear all
//                       </button>
//                     )}
//                   </div>
//                   <div className="d-flex justify-content-center mb-3 position-relative">
//                     <OTPInput
//                       value={emailCode}
//                       onChange={setEmailCode}
//                       disabled={loading}
//                       uppercaseOnly={true}
//                     />
//                   </div>
//                   <small className="form-text text-muted text-center d-block">
//                     Sent to: {verificationData.email}
//                     {' · '}
//                     <span 
//                       className="link" 
//                       style={{ 
//                         cursor: resendLoading === 'email' ? 'wait' : 'pointer',
//                         textDecoration: 'underline'
//                       }}
//                       onClick={() => !resendLoading && handleResend('email')}
//                     >
//                       {resendLoading === 'email' ? 'Resending...' : "Didn't receive code? Resend / "}
//                     </span>

//                     <Link to="/auth/signup" className="link" style={{ textDecoration: 'underline' }}>
//                       Sign up again
//                     </Link>

//                   </small>
//                 </div>
//               )}

//               {/* Divider if both methods are available */}
//               {verificationData.email_sent && verificationData.sms_sent && (
//                 <div className="text-center my-4">
//                   <div className="divider">
//                     <span className="divider-text">OR</span>
//                   </div>
//                 </div>
//               )}

//               {/* Phone Verification */}
//               {verificationData.sms_sent && (
//                 <div className="mb-4">
//                   <div className="d-flex justify-content-between align-items-center mb-2">
//                     <label className="form-label">
//                       Phone Verification Code
//                     </label>
//                     {phoneCode && (
//                       <button
//                         type="button"
//                         className="btn btn-link btn-sm p-0"
//                         onClick={clearPhoneCode}
//                         style={{ fontSize: '0.875rem' }}
//                       >
//                         Clear all
//                       </button>
//                     )}
//                   </div>
//                   <div className="d-flex justify-content-center mb-3">
//                     <OTPInput
//                       value={phoneCode}
//                       onChange={setPhoneCode}
//                       disabled={loading}
//                       uppercaseOnly={true}
//                     />
//                   </div>
//                   <small className="form-text text-muted text-center d-block">
//                     Sent to: {verificationData.phone}
//                     {' · '}
//                     <span 
//                       className="link1" 
//                       style={{ 
//                         cursor: resendLoading === 'phone' ? 'wait' : 'pointer',
//                         textDecoration: 'underline'
//                       }}
//                       onClick={() => !resendLoading && handleResend('phone')}
//                     >
//                       {resendLoading === 'phone' ? 'Resending...' : "Didn't receive code? Resend"}
//                     </span>
//                   </small>
//                 </div>
//               )}

//               {/* Keyboard Shortcuts Hint */}
//               <div className="mb-3">
//                 <div className="alert alert-light border" style={{ fontSize: '0.8rem' }}>
//                   <div className="d-flex flex-wrap justify-content-center gap-3">
//                     <span>
//                       <kbd>←</kbd> <kbd>→</kbd> Navigate
//                     </span>
//                     <span>
//                       <kbd>Backspace</kbd> Delete
//                     </span>
//                     <span>
//                       <kbd>Ctrl</kbd>+<kbd>V</kbd> Paste
//                     </span>
//                     <span>
//                       <kbd>Home</kbd>/<kbd>End</kbd> Jump
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="m-b30">
//                 <div className="alert alert-warning" style={{ 
//                   padding: '10px', 
//                   borderRadius: '8px',
//                   backgroundColor: '#fff3cd',
//                   border: '1px solid #ffc107',
//                   fontSize: '0.9em'
//                 }}>
//                   <i className="feather icon-info" style={{ marginRight: '8px' }} />
//                   You need to verify at least one method (email or phone) to continue.
//                 </div>
//               </div>

//               <div className="bottom-btn1 pb-3">
//                 <button
//                   type="submit"
//                   className="btn btn-thin btn-lg w-100 btn-primary rounded-xl"
//                   disabled={loading || (!emailCode && !phoneCode)}
//                 >
//                   {loading ? (
//                     <>
//                       <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                       Verifying...
//                     </>
//                   ) : (
//                     'Verify and proceed'
//                   )}
//                 </button>
                
//                 <div className="text-center mt-3 form-text">
//                   Back To{' '}
//                   <Link to="/auth/signin" className="text-underline link">
//                     Sign In
//                   </Link>
//                 </div>
//               </div>
//             </form>

//           </div>
//         </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default VerifySignup;


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
