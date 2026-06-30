import { useCallback, useEffect } from "react";
import { useUser, useClerk, useAuth as useClerkAuth } from "@clerk/react";
import { useLocation } from "wouter";
import { setAuthTokenGetter } from "@workspace/api-client-react";

interface AuthContextType {
  user: { id: string; firstName: string | null; email: string | null } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useClerkAuth();

  useEffect(() => {
    setAuthTokenGetter(async () => {
      try {
        return await getToken();
      } catch {
        return null;
      }
    });
  }, [getToken]);

  return <>{children}</>;
}

export function useAuthContext(): AuthContextType {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { isSignedIn } = useClerkAuth();
  const [, setLocation] = useLocation();

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const login = useCallback(() => {
    setLocation("/login");
  }, [setLocation]);

  const logout = useCallback(() => {
    signOut({ redirectUrl: window.location.origin + basePath + "/" });
  }, [signOut, basePath]);

  return {
    user: user
      ? {
          id: user.id,
          firstName: user.firstName,
          email: user.primaryEmailAddress?.emailAddress || null,
        }
      : null,
    isLoading: !isLoaded,
    isAuthenticated: !!isSignedIn,
    login,
    logout,
  };
}
