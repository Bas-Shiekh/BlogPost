"use client";

import { useAppSelector, useAppDispatch } from "./index";
import {
  login as loginAction,
  register as registerAction,
  logout as logoutAction,
  clearError,
} from "../store/slices/authSlice";

/**
 * Hook for accessing auth state and actions from Redux
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const login = async (email: string, password: string) => {
    return dispatch(loginAction({ email, password })).unwrap();
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    return dispatch(
      registerAction({
        name,
        email,
        password,
        confirmationPassword: confirmPassword,
      })
    ).unwrap();
  };

  const logout = async () => {
    return dispatch(logoutAction()).unwrap();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError: () => dispatch(clearError()),
  };
}
