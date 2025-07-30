import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import Constants from "expo-constants";

interface AuthContextType {
  token: string | null;
  user: any | null;
  isLoading: boolean;
  login: (newToken: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithMockUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user data for testing
const MOCK_USER = {
  id: "mock-user-123",
  email: "test@example.com",
  name: "Test User",
  xp: 750,
  level: 5,
  nextLevel: 1000
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app start
  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("token");
        if (storedToken) {
          setToken(storedToken);
          // Set mock user if using mock token
          if (storedToken === "mock-jwt-token-for-testing") {
            setUser(MOCK_USER);
          } else {
            // For real tokens, set a basic user object
            setUser({
              id: "user-from-token",
              email: "user@example.com",
              name: "User",
              xp: 0
            });
          }
        }
      } catch (error) {
        console.log("Error checking stored token:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);

  const login = async (newToken: string) => {
    setToken(newToken);
    await SecureStore.setItemAsync("token", newToken);
    // Set basic user when logging in
    setUser({
      id: "user-from-token",
      email: "user@example.com", 
      name: "User",
      xp: 0
    });
  };

  const loginWithMockUser = async () => {
    console.log("Logging in with mock user via API...");
    try {
      // Clear any existing token first
      console.log("Clearing existing token...");
      setToken(null);
      setUser(null);
      await SecureStore.deleteItemAsync("token");
      
      const api = axios.create({
        baseURL: Constants.expoConfig?.extra?.apiUrl || "http://localhost:4000",
      });
      
      // First, try to register the user (in case they don't exist)
      try {
        await api.post("/auth/register", {
          email: "test@example.com",
          password: "test123",
          name: "Test User"
        });
        console.log("Mock user registered successfully");
      } catch (error: any) {
        // User might already exist, that's okay
        console.log("User might already exist:", error.response?.data?.error);
      }
      
      // Now login to get a real token
      console.log("Logging in to get real token...");
      const { data } = await api.post("/auth/login", {
        email: "test@example.com",
        password: "test123"
      });
      
      console.log("Mock user logged in successfully, token received");
      console.log("New token:", data.token);
      setToken(data.token);
      setUser(MOCK_USER);
      await SecureStore.setItemAsync("token", data.token);
    } catch (error: any) {
      console.error("Error logging in mock user:", error.response?.data || error.message);
      throw error;
    }
  };

  // Auto-navigate when token is set
  useEffect(() => {
    if (token && user) {
      console.log("Token and user set, should navigate to tabs");
    }
  }, [token, user]);

  const logout = async () => {
    console.log("Logging out...");
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync("token");
    console.log("Logout complete");
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout, loginWithMockUser }}>
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