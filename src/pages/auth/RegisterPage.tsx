import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
// import { useAuth } from '@/contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import loginImg from '@/assets/images/login-img.jpg';
import { useToast } from '@/hooks/use-toast';
import FloatingExportCard from '@/components/ui/FloatingExportCard';
import {
  verifyEmail,
  checkEmailVerification,
  registerUser,
} from '@/services/AuthService';

const registerSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password.' }),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  // const { register } = useAuth();  // Commented out until implemented in AuthContext
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [verificationLink, setVerificationLink] = useState<string | null>(null);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    mode: 'onChange',
  });

  // Watch password and confirmPassword fields
  const password = form.watch('password');
  const confirmPassword = form.watch('confirmPassword');

  // Check if passwords match
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(null);
    }

    if (password && !passwordTouched) {
      setPasswordTouched(true);
    }
  }, [password, confirmPassword, passwordTouched]);

  // Poll for verification status if we have a link
  useEffect(() => {
    if (!verificationLink || emailVerified) return;

    const checkInterval = setInterval(async () => {
      try {
        // Extract the token from the verification link
        const url = new URL(verificationLink);
        const token = url.searchParams.get('token');

        if (!token) return;

        // Check verification status using AuthService
        const data = await checkEmailVerification(token);

        if (data.status === 'success' && data.data.isVerified) {
          setEmailVerified(true);
          setVerifyingEmail(false);
          clearInterval(checkInterval);

          toast({
            title: 'Email Verified',
            description: 'Your email has been successfully verified.',
            variant: 'success',
          });
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(checkInterval);
  }, [verificationLink, emailVerified, toast]);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      if (!emailVerified) {
        toast({
          title: 'Verification Required',
          description: 'Please verify your email first',
          variant: 'destructive',
        });
        return;
      }

      console.log('Register data:', data);
      // Call the registerUser service function
      const registrationResponse = await registerUser(
        data.email,
        data.password
      );
      console.log('Registration response:', registrationResponse);

      if (registrationResponse.status === 'success') {
        navigate('/login');
        toast({
          title: 'Success',
          description:
            registrationResponse.message || 'Account created successfully!',
          variant: 'success',
        });
      } else {
        toast({
          title: 'Registration Failed',
          description:
            registrationResponse.message ||
            'Unable to create your account. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: 'Registration Failed',
        description: 'Unable to create your account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleVerifyEmail = async () => {
    const email = form.getValues('email');
    if (!email || !email.includes('@') || !email.includes('.')) {
      form.setError('email', {
        type: 'manual',
        message: 'Please enter a valid email address',
      });
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address first',
        variant: 'destructive',
      });
      return;
    }

    setVerifyingEmail(true);

    try {
      const data = await verifyEmail(email);

      if (data.status === 'success' && data.data.verificationCheck) {
        setVerificationLink(data.data.verificationCheck);

        toast({
          title: 'Verification Email Sent',
          description:
            'Please check your inbox and click the verification link.',
          variant: 'success',
        });
      } else {
        setVerifyingEmail(false);
        toast({
          title: 'Verification Failed',
          description: data.message || 'Failed to send verification email.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      setVerifyingEmail(false);
      toast({
        title: 'Verification Failed',
        description: 'Failed to send verification email. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-6 bg-white relative">
        <img
          src={loginImg}
          alt="Register"
          className="h-full w-full object-cover rounded-2xl"
        />

        {/* Add the FloatingExportCard component */}
        <FloatingExportCard />
      </div>

      {/* Right Register Form Panel */}
      <div className="flex flex-col w-full lg:w-1/2 items-center justify-center px-8 py-12 sm:px-12 md:px-16 lg:px-24 bg-white">
        <div className="w-full max-w-md">
          {/* Logo for mobile view */}
          <div className="flex lg:hidden justify-center mb-12">
            <img src="/icon-nograd.svg" alt="SimuTrade" className="h-12" />
          </div>

          {/* Icon and Welcome Text */}
          <div className="mb-10 text-left">
            <img src="/icon-nograd.svg" alt="Logo" className="h-16 w-16 mb-4" />
            <h1 className="text-3xl font-bold text-black mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600">
              Sign up to start your trading journey
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-primary font-medium">
                      Email Address
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                          disabled={emailVerified}
                          className={`bg-white border border-accent rounded-md h-12 focus:border-secondary focus:ring-secondary ${emailVerified ? 'opacity-60' : ''}`}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        onClick={handleVerifyEmail}
                        disabled={emailVerified || verifyingEmail}
                        className={`h-12 text-white font-medium px-4 ${
                          emailVerified
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-primary hover:bg-primary/90'
                        }`}
                      >
                        {emailVerified
                          ? 'Verified'
                          : verifyingEmail
                            ? 'Verifying...'
                            : 'Verify Email'}
                      </Button>
                    </div>
                    <FormMessage className="text-red-600" />
                    {verifyingEmail && !emailVerified && (
                      <p className="text-xs text-blue-500 mt-1">
                        Please check your inbox and click the verification link.
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-primary font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a password"
                          {...field}
                          disabled={!emailVerified}
                          className={`bg-white border border-accent rounded-md pr-10 h-12 focus:border-secondary focus:ring-secondary ${!emailVerified ? 'opacity-60' : ''}`}
                          onFocus={() => setPasswordTouched(true)}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          disabled={!emailVerified}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showPassword ? (
                            <IoEyeOffOutline className="h-5 w-5 text-gray-400" />
                          ) : (
                            <IoEyeOutline className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-primary font-medium">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          {...field}
                          disabled={!emailVerified}
                          className={`bg-white border ${
                            passwordsMatch === false && field.value
                              ? 'border-red-500'
                              : passwordsMatch === true && field.value
                                ? 'border-green-500'
                                : 'border-accent'
                          } rounded-md pr-10 h-12 focus:border-secondary focus:ring-secondary ${!emailVerified ? 'opacity-60' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          disabled={!emailVerified}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showConfirmPassword ? (
                            <IoEyeOffOutline className="h-5 w-5 text-gray-400" />
                          ) : (
                            <IoEyeOutline className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    {passwordsMatch === true &&
                      field.value &&
                      !fieldState.error && (
                        <p className="text-xs text-green-500 mt-1">
                          Passwords match
                        </p>
                      )}
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 text-left">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!emailVerified}
                        className={`border-accent text-secondary focus:ring-secondary mt-1 ${!emailVerified ? 'opacity-60' : ''}`}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel
                        className={`text-sm font-medium text-gray-600 cursor-pointer ${!emailVerified ? 'opacity-60' : ''}`}
                      >
                        I accept the{' '}
                        <Link
                          to="/terms"
                          className="text-primary hover:text-emerald-600 hover:underline"
                        >
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link
                          to="/privacy"
                          className="text-primary hover:text-emerald-600 hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </FormLabel>
                      <FormMessage className="text-red-600" />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={!emailVerified || passwordsMatch === false}
                className="w-full bg-primary hover:bg-primary/90 text-white h-12 font-medium disabled:opacity-60"
              >
                Create Account
              </Button>
            </form>
          </Form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-accent/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="https://api.simutrade.app/user/auth/google"
                className="block w-full"
              >
                <Button
                  variant="outline"
                  className="w-full border border-accent rounded-md h-12 hover:bg-accent/10 transition-colors text-primary font-medium"
                  type="button"
                >
                  <FcGoogle className="mr-2 h-4 w-4" />
                  Sign Up with Google
                </Button>
              </a>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary hover:text-secondary-dark transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
