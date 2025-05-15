'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { FcGoogle } from 'react-icons/fc';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import loginImg from '@/assets/images/login-img.jpg';
import { useToast } from '@/hooks/use-toast';
import FloatingExportCard from '@/components/ui/FloatingExportCard';
import { loginUser } from '@/services/AuthService';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get the intended destination if redirected from protected route
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    console.log('LoginPage component rendered - updated version');
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      console.log('Login data:', data);

      // Call the API directly using the loginUser function
      const response = await loginUser(data.email, data.password);
      console.log('Login response:', response);

      if (response.status === 'success') {
        // If login is successful, store the token from the response
        // This is already handled inside loginUser function

        toast({
          title: 'Success',
          description: 'Login successful!',
          variant: 'success',
        });

        // Delay navigation slightly to ensure toast is shown
        setTimeout(() => {
          try {
            navigate(from, { replace: true });
          } catch (navError) {
            console.warn('Navigation failed, using fallback', navError);
            window.location.href = from;
          }
        }, 300);
      } else {
        // Show specific error from the API
        toast({
          title: 'Login Failed',
          description: response.message || 'Email or password is wrong.',
          variant: 'destructive',
        });
      }
    } catch (error: Error | unknown) {
      console.error('Login failed:', error);

      // Show a more user-friendly error message
      toast({
        title: 'Login Failed',
        description: 'Email or password is wrong.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Image Panel with Floating Card */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-6 bg-white relative">
        <img
          src={loginImg}
          alt="Login"
          className="h-full w-full object-cover rounded-2xl"
        />

        {/* Use the FloatingExportCard component */}
        <FloatingExportCard />
      </div>

      {/* Add the floating animation keyframes to the document */}
      <style>{`
        @keyframes float {
          0% {
            transform: translate(-50%, -50%);
          }
          50% {
            transform: translate(-50%, -53%);
          }
          100% {
            transform: translate(-50%, -50%);
          }
        }
      `}</style>

      {/* Right Login Form Panel */}
      <div className="flex flex-col w-full lg:w-1/2 items-center justify-center px-8 py-12 sm:px-12 md:px-16 lg:px-24 bg-white">
        <div className="w-full max-w-md">
          {/* Logo for mobile view */}
          <div className="flex lg:hidden justify-center mb-12">
            <img src="/logo.png" alt="SimuTrade" className="h-12" />
          </div>

          {/* Icon and Welcome Text */}
          <div className="mb-10 text-left">
            <img src="/icon-nograd.svg" alt="Logo" className="h-16 w-16 mb-4" />
            <h1 className="text-3xl font-bold text-black mb-2">Welcome Back</h1>
            <p className="text-gray-600">
              Enter your email and password to access your account
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
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        disabled={isLoading}
                        {...field}
                        className="bg-white border border-accent rounded-md h-12 focus:border-secondary focus:ring-secondary"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
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
                          placeholder="Enter your password"
                          {...field}
                          disabled={isLoading}
                          autoComplete="current-password"
                          className="bg-white border border-accent rounded-md pr-10 h-12 focus:border-secondary focus:ring-secondary"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
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

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                        className="border-accent text-secondary focus:ring-secondary"
                      />
                      <label
                        htmlFor="rememberMe"
                        className="text-sm font-medium text-gray-600 cursor-pointer"
                      >
                        Remember me
                      </label>
                    </div>
                  )}
                />

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary hover:text-secondary transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white h-12 font-medium"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </Form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-accent/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="https://api.simutrade.app/user/auth/google?redirect_url=https://simutrade.app/oauth-redirect.html"
                className="block w-full"
              >
                <Button
                  variant="outline"
                  disabled={isLoading}
                  className="w-full border border-accent rounded-md h-12 hover:bg-accent/10 transition-colors text-primary font-medium"
                  type="button"
                >
                  <FcGoogle className="mr-2 h-4 w-4" />
                  Sign In with Google
                </Button>
              </a>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-primary hover:text-secondary-dark transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
