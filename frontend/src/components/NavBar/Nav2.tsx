// components/NavBar/NavBar.tsx
"use client";
import { useState, useEffect } from "react";

function Navbar2() {
  const [isSticky, setIsSticky] = useState(false);
  const navbarHeight = 64; // Define the height of the navbar

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`
          ${isSticky ? 'fixed top-0 left-0 right-0 rounded-none max' : 'relative mt-6 mx-8 rounded-4xl hover:scale-105'}
          bg-gray-900 text-white shadow-sm z-50 transition-all duration-300 ease-in-out
          `}
        style={{ height: navbarHeight }}
      >
        {/* Add navbar content here */}
        {/* <div className="text-lg font-bold">Logo</div>
        <ul className="hidden md:flex items-center space-x-4">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul> */}
      </nav>
    </>
  );
}

export default Navbar2;