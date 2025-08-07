import { SignUpFormSchema } from "@/@types/auth";
import apiClient from "./apiClient";
import { AxiosResponse } from "axios";

export interface LoginInfo {
  username: string; // Accepts email or phone
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    uuid: string;
    firstLogin: boolean;
    isActive: boolean;
    lastName: string;
    gender: string;
    phone: string;
    type: string;
    updatedAt: string;
    createdAt: string;
    profile?: string | null;
    verifiedAt: string | null;
    lastLogin: string | null;
    createdBy: string | null;
  };
}

export interface VerifyOTPTokenRequest {
  phone: string;
  token: string;
}

export interface ForgotPasswordRequest {
  username: string;
}

export interface ResendOtpTokenRequest {
  username: string;
}

export interface ForgotPasswordResponse {
  username: string;
  success: boolean;
  message: string;
}

export interface VerifyOTPTokenResponse {
  message: string;
  success: boolean;
}

export interface ResendOtpTokenResponse {
  message: string;
  success: boolean;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  passwordConfirmation: string;
}

export interface ResetPasswordResponse {
  success: boolean; // ✅ Fixed typo from `succes` to `success`
  message: string;
}

export interface ResendTokenRequest {
  token: string;
  password: string;
  passwordConfirmation: string;
}

export interface ResendTokenResponse {
  success: boolean; // ✅ Fixed duplicate definition & wrong type
  message: string;
}

class AuthService {
  private authApi = "/auth"; // ✅ Ensure correct API path

  /**
   * Login method that supports email or phone number.
   */
  async login(data: LoginInfo) {
    return apiClient.post<AuthResponse>(`${this.authApi}/login`, data);
  }

  /**
   * Registers a new user.
   */
  register(data: SignUpFormSchema): Promise<AxiosResponse<AuthResponse>> {
    return apiClient.post(`${this.authApi}/register`, data);
  }

  /**
   * Verifies user account with OTP.
   */

  verifyAccount(
    data: VerifyOTPTokenRequest
  ): Promise<AxiosResponse<VerifyOTPTokenResponse>> {
    return apiClient.post(`${this.authApi}/verify-account`, data);
  }

  /**
   * Sends a forgot password request (fixing the previous duplicate).
   */
  forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<AxiosResponse<ForgotPasswordResponse>> {
    return apiClient.post(`${this.authApi}/forgot-password`, data);
  }

  /**
   * Resend OTP token for password reset.
   */
  resendForgotPasswordToken(
    data: ResendTokenRequest
  ): Promise<AxiosResponse<ResendTokenResponse>> {
    return apiClient.post<ResendTokenResponse>(
      `${this.authApi}/reset-password`,
      data
    );
  }
  forgottPassword(
    data: VerifyOTPTokenRequest
  ): Promise<AxiosResponse<VerifyOTPTokenResponse>> {
    return apiClient.post(`${this.authApi}/verify-account`, data);
  }

  resetPassword(uuid: string): Promise<AxiosResponse<VerifyOTPTokenResponse>> {
    return apiClient.get(`${this.authApi}/reset-password/${uuid}`);
  }

  resendOtp(
    data: ResendOtpTokenRequest
  ): Promise<AxiosResponse<ResendOtpTokenResponse>> {
    return apiClient.post(`${this.authApi}/resend-verify-account-token`, data);
  }

  async logout() {
    localStorage.removeItem("userToken");
    return true;
  }

  /**
   * Retrieves the current user's token.
   */
  getToken(): string | null {
    return localStorage.getItem("userToken");
  }

  /**
   * Checks if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();
