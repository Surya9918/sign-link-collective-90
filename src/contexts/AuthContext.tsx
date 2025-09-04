import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<boolean>;
  sendOtp: (phoneNumber: string) => Promise<{ success: boolean; referenceId?: string; message?: string }>;
  verifyOtp: (phoneNumber: string, otpCode: string, name: string, email: string, password: string) => Promise<boolean>;
  resendOtp: (phoneNumber: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('signLanguageUser');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        // Optionally fetch fresh user data
        fetchCurrentUser();
      } catch (error) {
        console.error('Error parsing saved user:', error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const userData = await apiService.getCurrentUser();
      // Add backward compatibility fields
      const userWithCompat = {
        ...userData,
        username: userData.name,
        contributionsCount: 0,
        badgesEarned: [],
        joinedDate: userData.created_at.split('T')[0]
      };
      setUser(userWithCompat);
      localStorage.setItem('signLanguageUser', JSON.stringify(userWithCompat));
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    }
  };

  const login = async (phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const loginResponse = await apiService.login({ phone, password });
      localStorage.setItem('access_token', loginResponse.access_token);
      localStorage.setItem('token_type', loginResponse.token_type);
      
      // Fetch user data after successful login
      await fetchCurrentUser();
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const sendOtp = async (phoneNumber: string): Promise<{ success: boolean; referenceId?: string; message?: string }> => {
    try {
      const response = await apiService.sendSignupOtp({ phone_number: phoneNumber });
      return {
        success: true,
        referenceId: response.reference_id,
        message: response.message
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send OTP'
      };
    }
  };

  const verifyOtp = async (
    phoneNumber: string,
    otpCode: string,
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.verifySignupOtp({
        phone_number: phoneNumber,
        otp_code: otpCode,
        name,
        email,
        password,
        has_given_consent: true
      });
      
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('token_type', response.token_type);
      
      // Fetch user data after successful registration
      await fetchCurrentUser();
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Verify OTP error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const resendOtp = async (phoneNumber: string): Promise<boolean> => {
    try {
      await apiService.resendSignupOtp({ phone_number: phoneNumber });
      return true;
    } catch (error) {
      console.error('Resend OTP error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('signLanguageUser');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      sendOtp, 
      verifyOtp, 
      resendOtp, 
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};