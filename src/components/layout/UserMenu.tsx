import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useClickOutside } from "../../hooks/useClickOutside";

export const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useClickOutside(menuRef, () => setIsOpen(false));

  const initial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    router.push("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-bold border-2 border-transparent hover:border-white/30 transition-colors focus:outline-none"
      >
        {initial}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[#0d1117] border border-white/10 rounded-xl shadow-xl z-50 py-1 origin-top-right">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm font-semibold text-white truncate">{user?.user_metadata?.name || "User"}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>

          <div className="py-1">
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Account Settings
            </Link>
          </div>

          <div className="border-t border-white/10 py-1">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 font-medium hover:bg-red-500/10 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
