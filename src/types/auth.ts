/* =====================================================
   USER & AUTH TYPES
===================================================== */

import type { User, UserRole } from "./users";

// AUTH PAYLOADS
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type?: string;
}

export interface AuthPayload {
  user: User;
  tokens: AuthTokens;
}

export interface SigninData {
  username: string;
  password: string;
}

export interface SigninResponse {
  success: boolean;
  message?: string;
  data: AuthPayload;
}

export interface SignupData {
  username: string;
  email: string;
  phone?: string;
  names?: string;
  password?: string;
  role?: UserRole;
  parent_id?: string | null; // For students
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    email: string;
    phone?: string;
    email_sent: boolean;
    sms_sent: boolean;
    expires_in_seconds: number;
    next_step?: string;
  };

}

export interface VerifySignupData {
  token: string;
  email_code?: string;
  phone_code?: string;
}

export interface VerifySignupResponse {
  success: boolean;
  message: string;
  data: {
    username: string;
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
  };
}

export interface ResendCodeData {
  token: string;
  type: 'email' | 'phone';
}

export interface ResendCodeResponse {
  success: boolean;
  message: string;
}

// export interface ResetPasswordData {
//   token?: string;
//   email?: string;
//   new_password: string;
//   confirm_password?: string;

// }

export interface ResetPasswordDataDTO {
  reset_code: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface ForgotPasswordData {
  email: string;
}


export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  currentRole: UserRole | null;
}



export interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}


// others

