// src/contexts/AuthContext.ts
import { createContext } from "react";
import type { UserProfile, LoginData, RegisterData } from "../api/auth";

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
