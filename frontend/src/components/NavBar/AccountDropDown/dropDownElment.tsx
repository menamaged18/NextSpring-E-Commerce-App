'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/Hooks/reduxHooks';
// import { logoutUserAsync } from '@/data/reducers/user/jsonUsers/User';
import {logoutUser} from '@/data/reducers/user/UserReducer'
import Spinner from './MySpinner';

function NavbarDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const typedDispatch = useAppDispatch();

  const toggleDropdown = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsOpen((s) => !s);
  };

  const handleSignout = (e: React.MouseEvent) => {
    // stop the click bubbling so document mousedown/click handlers don't react to it
    e.stopPropagation();
    e.preventDefault();

    // to close dropdown immediately so navbar won't keep re-rendering under the overlay
    setIsOpen(false);

    // to show the fullscreen spinner
    setIsSigningOut(true);

    setTimeout(() => {
      typedDispatch(logoutUser());
      // TODO/optional later: keep spinner until route update / redux updates; but for 3s behavior:
      setIsSigningOut(false);
    }, 3000);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isSigningOut) return; // ignore outside clicks while signing out
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSigningOut]);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full py-2 px-4 rounded-lg hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 md:hover:bg-transparent md:border-0 md:hover:text-indigo-600 md:p-0 md:w-auto cursor-pointer"
      >
        Account
        <svg className="w-3 h-3 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-2 right-0 font-normal bg-white divide-y divide-gray-200 rounded-lg shadow-md w-32 max-w-[calc(100vw-1rem)]"
        >
          {!isAuthenticated ? (
            <ul className="py-2 text-sm text-gray-700">
              <li><Link href="/signUp" className="block px-4 py-2.5 hover:bg-indigo-50 hover:text-indigo-600" onClick={() => setIsOpen(false)}>Sign-up</Link></li>
              <li><Link href="/login" className="block px-4 py-2.5 hover:bg-indigo-50 hover:text-indigo-600" onClick={() => setIsOpen(false)}>Login</Link></li>
            </ul>
          ) : (
            <div className="py-1">
              <button
                onClick={handleSignout}
                className="w-full block px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 text-left cursor-pointer"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      )}

      {isSigningOut && <Spinner />}
    </div>
  );
}

export default NavbarDropdown;
