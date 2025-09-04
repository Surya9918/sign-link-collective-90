const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  phone: string;
  name: string;
  email: string;
  gender: string;
  date_of_birth: string;
  place: string;
  id: string;
  is_active: boolean;
  has_given_consent: boolean;
  consent_given_at: string;
  last_login_at: string;
  created_at: string;
  updated_at: string;
  // Backward compatibility fields
  username?: string;
  contributionsCount?: number;
  badgesEarned?: string[];
  joinedDate?: string;
}

export interface SendOtpRequest {
  phone_number: string;
}

export interface SendOtpResponse {
  status: string;
  message: string;
  reference_id: string;
}

export interface VerifyOtpRequest {
  phone_number: string;
  otp_code: string;
  name: string;
  email: string;
  password: string;
  has_given_consent: boolean;
}

export interface VerifyOtpResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  phone_number: string;
  roles: string[];
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail?.[0]?.msg || 'Login failed');
    }

    return response.json();
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail?.[0]?.msg || 'Failed to get user info');
    }

    return response.json();
  }

  async sendSignupOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup/send-otp`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail?.[0]?.msg || 'Failed to send OTP');
    }

    return response.json();
  }

  async verifySignupOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup/verify-otp`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail?.[0]?.msg || 'Failed to verify OTP');
    }

    return response.json();
  }

  async resendSignupOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup/resend-otp`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail?.[0]?.msg || 'Failed to resend OTP');
    }

    return response.json();
  }
}

export const apiService = new ApiService();