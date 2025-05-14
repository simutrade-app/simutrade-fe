'use client';

import React from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { FaGoogle } from 'react-icons/fa6';
import { IoEyeOutline } from 'react-icons/io5';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate(); // Kept for future use with actual login logic
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { login } = useAuth(); // Kept for future use with actual login logic

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      console.log('Login data:', data);
      // await login(data.email, data.password);
      // navigate('/dashboard');
      alert('Login successful (simulated)!');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed (simulated)! Check console for details.');
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Placeholder Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 items-center justify-center p-12">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-700">Simutrade</h1>
          <p className="mt-2 text-gray-500">
            Left panel placeholder for image/brand content.
          </p>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="flex flex-col w-full lg:w-1/2 items-center justify-center px-8 py-12 sm:px-12 md:px-16 lg:px-24">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <img src="/logo.svg" alt="Cogie" className="h-8" />
          </div>

          {/* Welcome Text */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold mb-2">Welcome Back</h1>
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
                    <FormLabel className="text-left">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        className="bg-white border border-gray-300 rounded-md h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-left">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                          className="bg-white border border-gray-300 rounded-md pr-10 h-12"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <IoEyeOutline className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
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
                        className="text-white border-0"
                      />
                      <label
                        htmlFor="rememberMe"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                  )}
                />

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot Password
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-black hover:bg-black/90 text-white h-12"
              >
                Sign In
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full border rounded-md h-12"
              >
                <FaGoogle className="mr-2 h-4 w-4" />
                Sign In with Google
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold leading-6 text-primary hover:underline"
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
