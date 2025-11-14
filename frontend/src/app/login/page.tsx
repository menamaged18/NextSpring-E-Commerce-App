'use client';
import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {useAppSelector, useAppDispatch} from "@/Hooks/reduxHooks";
import { loginUser } from '@/data/reducers/user/UserReducer';
import SearchParamsMessage from './SearchParamsMessage';
import HelpLogin from '@/components/LoginHelp/HelpLogin';

export default function Page() {
  const router = useRouter();
  const typedDispatch = useAppDispatch();
  const {error, loading, isAuthenticated} = useAppSelector(state => state.user); 
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    typedDispatch(loginUser(loginData));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className={`relative max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl shadow-lg transition-all duration-300 ${
          isHovered ? 'shadow-xl' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-500">Enter your credentials to access your account</p>
        </div>

        <Suspense fallback={<div className="text-center py-4">Loading…</div>}>
          <SearchParamsMessage />
        </Suspense>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fixed error display - check error exists and show it */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa fa-envelope text-gray-400"></i>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-10 w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition duration-200"
                  value={loginData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-800 transition duration-150"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa fa-lock text-gray-400"></i>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10 w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition duration-200"
                  value={loginData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-4 rounded-lg text-white font-medium cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform ${
              isFocused ? 'ring-4 ring-blue-200 scale-[0.98]' : 'shadow-md'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onMouseEnter={() => setIsFocused(true)}
            onMouseLeave={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-5 border-t border-gray-100">
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              href="/signUp"
              className="font-medium text-blue-600 hover:text-blue-800 transition duration-150"
            >
              Create account
            </Link>
          </p>
        </div>
        <HelpLogin />
      </div>
    </div>
  );
}