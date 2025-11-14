"use client";
import React, {useState} from 'react';
// import { useTypedDispatch } from '@/data/store/store';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import {
//   addUser,
// } from '@/data/reducers/User';

function Page() {
  // const router = useRouter();
  const inputStyle = 'mt-2 p-4 w-full rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 text-gray-700 placeholder-gray-400';

  // const dispatch = useTypedDispatch();

  const [signupFields, setSignupFields] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSignupFields = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setSignupFields( (prev) => ({...prev, [name]: value}) )
  };

  // const handleAddUser = async () => {
  //   setIsLoading(true);
  //   try {
  //     // const result = await dispatch(addUser(signupFields)).unwrap();
  //     if(result === "Registration successful"){
  //       alert("Added Successfully");
  //       router.push('/login');        
  //     }
  //   } catch (error) {
  //     alert(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-12">
        {/* Header Section - Vertically Centered */}
        <div className="flex-1 flex flex-col justify-center text-center w-full lg:w-auto">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600 text-sm">
            Join us today and get started with your journey
          </p>
        </div>

        {/* Form Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6 w-full lg:w-auto">
          <div className="space-y-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  placeholder="Enter your full name"
                  type="text"
                  id="name"
                  name="name"
                  value={signupFields.name}
                  onChange={handleSignupFields}
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  placeholder="Enter your email address"
                  type="email"
                  id="email"
                  name="email"
                  value={signupFields.email}
                  onChange={handleSignupFields}
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  placeholder="Create a strong password"
                  type="password"
                  name="password"
                  id="password"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                  value={signupFields.password}
                  onChange={handleSignupFields}
                  required
                  className={inputStyle}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must contain at least 8 characters with uppercase, lowercase, and numbers
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  placeholder="Confirm your password"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={signupFields.confirmPassword}
                  onChange={handleSignupFields}
                  required
                  className={inputStyle}
                />
              </div>
            </div>

            <button
              className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              type="submit"
              id="registerBtn"
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault();
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 2000);
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
          <div className="mt-8 pt-5 border-t border-gray-100">
            <p className="text-center text-sm text-gray-600">
              You have an account?{' '}
              <Link 
                href="/login" 
                className="font-medium text-blue-600 hover:text-blue-800 transition duration-150"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;