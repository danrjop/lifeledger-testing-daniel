"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface User {
  userId: string;
  username: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const DEMO_USER: User = {
  userId: "demo-sally-001",
  username: "Sally",
  email: "sally@lifeledger.demo",
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  checkAuth: async () => {},
  getIdToken: async () => null,
});

/**
 * Demo AuthProvider — auto-authenticates as Sally on mount so any page
 * (including /dashboard) is reachable without a real login flow.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    setUser(DEMO_USER);
    setIsLoading(false);
  }, []);

  const getIdToken = useCallback(async () => "demo-token", []);

  useEffect(() => {
    setUser(DEMO_USER);
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, checkAuth, getIdToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
