// src/contexts/AuthProvider.tsx
import React, { useState, useEffect, type ReactNode } from "react";
import AuthContext, { AuthContextType } from "./AuthContext";
import {
  authApi,
  type UserProfile,
  type LoginData,
  type RegisterData,
} from "../api/auth";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (localStorage.getItem("accessToken")) {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleApiError = (err: unknown): string => {
    if (
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      typeof err.response === "object" &&
      err.response !== null &&
      "data" in err.response
    ) {
      return (err.response as { data?: Record<string, string[]> }).data
        ? Object.values((err.response as { data: Record<string, string[]> }).data)
            .flat()
            .join(" ")
        : "An error occurred.";
    }
    return "An unexpected error occurred.";
  };

  const login = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      await authApi.login(data);
      const userData = await authApi.getCurrentUser();
      setUser(userData);
    } catch (err: unknown) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      await authApi.register(data);
      await authApi.login({ username: data.username, password: data.password });
      const userData = await authApi.getCurrentUser();
      setUser(userData);
    } catch (err: unknown) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await authApi.updateProfile(data);
      setUser(updatedUser);
    } catch (err: unknown) {
      setError("Failed to update profile");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
