import React, { createContext, useContext, useState } from "react";
import * as SecureStore from "expo-secure-store";

interface AuthContextType {
  token: string | null;
  login: (newToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  const login = async (newToken: string) => {
    setToken(newToken);
    await SecureStore.setItemAsync("token", newToken);
  };

  const logout = async () => {
    setToken(null);
    await SecureStore.deleteItemAsync("token");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
