// import type { ApiResponse } from '@/types';

// import type { 
//   ResendCodeData, 
//   ResendCodeResponse, 
//   ResetPasswordData, 
//   User, 
//   VerifySignupData, 
//   VerifySignupResponse 
// } from '@/types/auth';

// import { AxiosService } from '../base/AxiosService';

// export const AuthService = {

//   async signin(username: string, password: string): Promise<ApiResponse<User>> {
//     try {
//       const response = await AxiosService.json.post('/auth/signin', {
//         username,
//         password,
//       });
//       return response.data;
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   }, 

//   async forgotPassword(data: { email: string }): Promise<{ success: boolean; message: string }> {
//     const response = await AxiosService.json.post('/auth/forgot-password', data);
//     return response.data;
//   },

//   async resetPassword(data: ResetPasswordData): Promise<{ success: boolean; message: string }> {
//     const response = await AxiosService.json.post('/auth/reset-password', data);
//     return response.data;
//   },

//   async signup (userData: Partial<User>): Promise<ApiResponse<User>> {
//     try {
//       const response = await AxiosService.json.post('/auth/signup', userData);
//       return response.data;
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   },

  
//   /**
//    * Step 2: Verify codes and complete registration
//    */
//   async verifySignup(data: VerifySignupData): Promise<VerifySignupResponse> {
//     try {
//       const response = await AxiosService.json.post('/auth/signup/verify', data);
//       return response.data;
//     } catch (error: any) {
//       console.log('Verify signup error:', error);
//       const errorMessage = error.response.data.message || error.message || error.response?.data?.detail || 'Verification failed';
//       throw new Error(
//         errorMessage
//       );
//     }
//   },

//   /**
//    * Resend verification code
//    */
//   async resendVerificationCode(data: ResendCodeData): Promise<ResendCodeResponse> {
//     try {
//       const response = await AxiosService.json.post('/auth/signup/resend', data);
//       return response.data;
//     } catch (error: any) {
//       console.log('Resend code error:', error);
//       const errorMessage = error.response.data.message || error.message || error.response?.data?.detail || 'Failed to resend code';
//       throw new Error(
//         errorMessage
//       );
//     }
//   },


//   async signout(): Promise<ApiResponse> {
//     try {
//       const response = await AxiosService.json.post('/auth/signout');
//       return response.data;
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   },

//   async refreshToken(refreshToken: string): Promise<ApiResponse<{ access_token: string }>> {
//     try {
//       const response = await AxiosService.json.post('/auth/refresh-token', {
//         refresh_token: refreshToken,
//       });
//       return response.data;
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   },

//   // async resetPassword(email: string): Promise<ApiResponse> {
//   //   try {
//   //     const response = await AxiosService.json.post('/auth/reset-password', { email });
//   //     return response.data;
//   //   } catch (error) {
//   //     throw this.handleError(error);
//   //   }
//   // },

//   handleError(error: any): Error {
//     if (error.response?.data?.message) {
//       return new Error(error.response.data.message);
//     }
//     return new Error('An error occurred during authentication');
//   },
  
// };

// v2 - consistent error handling and type usage
import type { ApiResponse } from '@/types';
import type {
  ResendCodeData,
  ResendCodeResponse,
  ResetPasswordData,
  SigninResponse,
  User,
  VerifySignupData,
  VerifySignupResponse,
} from '@/types/auth';

import { AxiosService } from '../base/AxiosService';

/* =====================================================
   Error Normalization
===================================================== */

const extractErrorMessage = (error: unknown): string => {
  const err = error as any;

  return (
    err?.response?.data?.message ||
    err?.response?.data?.detail ||
    err?.message ||
    'An unexpected authentication error occurred'
  );
};

export const AuthService = {
  /* ==================== AUTH ==================== */

  // async signin(
  //   username: string,
  //   password: string
  // ): Promise<ApiResponse<User>> {
  //   try {
  //     const response = await AxiosService.json.post('/auth/signin', {
  //       username,
  //       password,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     throw this.handleError(error);
  //   }
  // },

  async signin(
      username: string,
      password: string
    ): Promise<SigninResponse> {
      try {
        const response = await AxiosService.json.post('/auth/signin', {
          username,
          password,
        });
        return response.data;
      } catch (error) {
        throw this.handleError(error);
      }
  },
      
  async signup(
    userData: Partial<User>
  ): Promise<ApiResponse<User>> {
    try {
      const response = await AxiosService.json.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async signout(): Promise<ApiResponse> {
    try {
      const response = await AxiosService.json.post('/auth/signout');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async refreshToken(
    refreshToken: string
  ): Promise<ApiResponse<{ access_token: string }>> {
    try {
      const response = await AxiosService.json.post('/auth/refresh-token', {
        refresh_token: refreshToken,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /* ================= PASSWORD ================= */

  async forgotPassword(
    data: { email: string }
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await AxiosService.json.post(
        '/auth/forgot-password',
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async verifyResetToken(
      token: string
    ): Promise<{ success: boolean; message: string }> {
      try {
        const response = await AxiosService.json.post(
          '/auth/reset-password/verify-token',
          { token } // ✅ JSON object
        );

        return response.data;
      } catch (error) {
        throw this.handleError(error);
      }
    },
  
  async resetPassword(
    data: ResetPasswordData
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await AxiosService.json.post(
        '/auth/reset-password',
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /* ================= SIGNUP FLOW ================= */

  async verifySignup(
    data: VerifySignupData
  ): Promise<VerifySignupResponse> {
    try {
      const response = await AxiosService.json.post(
        '/auth/signup/verify',
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async resendVerificationCode(
    data: ResendCodeData
  ): Promise<ResendCodeResponse> {
    try {
      const response = await AxiosService.json.post(
        '/auth/signup/resend',
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /* ================= INTERNAL ================= */

  handleError(error: unknown): Error {
    return new Error(extractErrorMessage(error));
  },
};
