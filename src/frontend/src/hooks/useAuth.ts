import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const {
    identity,
    login,
    clear,
    isAuthenticated,
    loginStatus,
    isInitializing,
    isLoggingIn,
  } = useInternetIdentity();

  const principal = identity?.getPrincipal();

  return {
    login,
    logout: clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    loginStatus,
    principal,
    identity,
  };
}
