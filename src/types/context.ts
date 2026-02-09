/* =====================================================
  UTILITY TYPES
===================================================== */


import type { AuthPayload, VerifySignupData, ResetPasswordDataDTO } from "./auth";
import type { User } from "./users";

/* -------------------------------------------------------------------------- */
/* Context Types                                                                      */
/* -------------------------------------------------------------------------- */
export interface AuthContextType {
  auth: AuthPayload | null;
  loading: boolean;

  signin(username: string, password: string): Promise<void>;
  signout(): Promise<void>;

  signup(data: Partial<User>): Promise<void>;
  verifySignup(payload: VerifySignupData): Promise<void>;

  forgotPassword(email: string): Promise<void>;
  resetPassword(data: ResetPasswordDataDTO): Promise<void>;

  updateUser(data: Partial<User>): Promise<void>;
}
