import Link from 'next/link'
import React from 'react'

function AboutElement() {
  return (
        <Link
        href="/about"
        className="hover:text-gray-300 transition duration-300 flex items-center space-x-1"
        >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
        <span>About</span>
        </Link>
  )
}

export default AboutElement