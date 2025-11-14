import Link from 'next/link'
import React from 'react'

function FavouritesElement() {
  return (
        <Link
        href="/Favourites"
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
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
        </svg>
        <span>Favourites</span>
        </Link>
  )
}

export default FavouritesElement