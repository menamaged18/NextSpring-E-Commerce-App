import Link from 'next/link';
import React from 'react';

function AddProductElement() {
  return (
    <Link
      href="/AddProduct"
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
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      <span>Add Product</span>
    </Link>
  );
}

export default AddProductElement;