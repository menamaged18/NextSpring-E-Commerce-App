// spinnter in the middle of the dropdown navbar 
// function Spinner() {
//   return (
//     <div className="flex justify-center">
//       <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full text-indigo-600" role="status">
//         <span className="sr-only">Loading...</span>
//       </div>
//     </div>
//   );
// }

"use client"
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Spinner() {
  useEffect(() => {
    // lock scroll while spinner visible
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Render to body so it's outside any stacking / transform contexts
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/50 pointer-events-auto"
      aria-hidden="true"
    >
      <div
        className="inline-block w-10 h-10 border-4 border-t-indigo-600 rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>,
    document.body
  );
}


