import Link from 'next/link'
import React from 'react'

function CartElement() {
  return (
        <Link
        href="/Cart"
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
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5H18.6L22 13M18 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m0-4h18"
            />
        </svg>
        <span>Cart</span>
        </Link>
  )
}

export default CartElement