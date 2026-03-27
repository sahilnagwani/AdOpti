import React from "react";
import Link from "next/link";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#05080f] flex flex-col justify-center items-center px-4 font-sans text-center">
      <div className="mb-4">
        <span className="text-9xl font-black text-white/20 tracking-tighter shadow-sm blur-[1px]">404</span>
      </div>
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight mb-2">
        Page not found
      </h1>
      <p className="text-gray-400 font-medium max-w-sm mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <Link 
        href="/dashboard"
        className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </Link>
    </div>
  );
};
