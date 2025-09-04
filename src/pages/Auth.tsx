import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OTPInput } from '@/components/ui/otp-input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Auth = () => {
  const { user, login, sendOtp, verifyOtp, resendOtp, isLoading } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<'phone' | 'otp' | 'details'>('phone');
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    name: '',
    email: '',
    otp: '',
    confirmPassword: ''
  });

  // Redirect if already logged in
  if (user && !isLoading) {
    return <Navigate to="/profile" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const success = await login(formData.phone, formData.password);
    if (success) {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in."
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid phone number or password. Please check your credentials.",
        variant: "destructive"
      });
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive"
      });
      return;
    }

    const result = await sendOtp(formData.phone);
    if (result.success) {
      setRegistrationStep('otp');
      toast({
        title: "OTP Sent",
        description: result.message || "OTP has been sent to your phone number."
      });
    } else {
      toast({
        title: "Failed to Send OTP",
        description: result.message || "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp) {
      toast({
        title: "Error",
        description: "Please enter the OTP",
        variant: "destructive"
      });
      return;
    }

    if (formData.otp.length !== 6) {
      toast({
        title: "Error",
        description: "OTP must be 6 digits",
        variant: "destructive"
      });
      return;
    }

    setRegistrationStep('details');
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    const success = await verifyOtp(
      formData.phone,
      formData.otp,
      formData.name,
      formData.email,
      formData.password
    );

    if (success) {
      toast({
        title: "Account Created!",
        description: "Welcome to the Sign Language Corpus Collection platform."
      });
    } else {
      toast({
        title: "Registration Failed",
        description: "Please check your details and try again.",
        variant: "destructive"
      });
    }
  };

  const handleResendOtp = async () => {
    const success = await resendOtp(formData.phone);
    if (success) {
      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your phone number."
      });
    } else {
      toast({
        title: "Failed to Resend OTP",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const resetRegistration = () => {
    setRegistrationStep('phone');
    setFormData(prev => ({ ...prev, otp: '', name: '', email: '', password: '', confirmPassword: '' }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 px-4 py-12">
      <Card className="w-full max-w-md shadow-custom-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-foreground">Welcome</CardTitle>
          <CardDescription className="text-muted-foreground">
            Join the Sign Language Corpus Collection community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="h-12 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              {registrationStep === 'phone' && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="h-12"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </form>
              )}

              {registrationStep === 'otp' && (
                <div className="space-y-4">
                  <Button
                    variant="ghost"
                    onClick={resetRegistration}
                    className="mb-2 p-0 h-auto text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to phone number
                  </Button>
                  
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Enter the 6-digit OTP sent to
                    </p>
                    <p className="font-medium">{formData.phone}</p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-center block">Enter OTP</Label>
                      <OTPInput
                        value={formData.otp}
                        onChange={(value) => setFormData(prev => ({ ...prev, otp: value }))}
                        disabled={isLoading}
                        className="justify-center"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        Resend OTP
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isLoading || formData.otp.length !== 6}
                        className="flex-1"
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          'Verify OTP'
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {registrationStep === 'details' && (
                <div className="space-y-4">
                  <Button
                    variant="ghost"
                    onClick={() => setRegistrationStep('otp')}
                    className="mb-2 p-0 h-auto text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to OTP
                  </Button>

                  <form onSubmit={handleCompleteRegistration} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className="h-12 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="h-12"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-lg font-semibold" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Demo: Use any phone number to test OTP flow</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;