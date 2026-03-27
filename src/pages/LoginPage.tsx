import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div className="min-h-screen bg-[#05080f] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (isAuthenticated) {
    router.replace("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4 font-sans">
      <div className="w-full max-w-sm p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-6 flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        
        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
        <p className="text-gray-400 text-sm mb-8 text-center">Sign in to access your marketing intelligence dashboard.</p>
        
        <button 
          onClick={() => alert("Normally this would trigger Supabase Auth.")}
          className="w-full py-3 bg-white text-gray-900 rounded-lg font-bold text-sm tracking-wide shadow-md hover:bg-gray-100 transition-colors"
        >
          Sign in (Stub)
        </button>
      </div>
    </div>
  );
}
