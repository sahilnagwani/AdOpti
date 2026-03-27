import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const FALLBACK = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  signOut: async () => {},
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  // Return safe defaults if used outside provider
  return context ?? FALLBACK;
};
