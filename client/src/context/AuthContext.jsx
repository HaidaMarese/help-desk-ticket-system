import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    const token = localStorage.getItem("helpDeskToken");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem("helpDeskToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    const response = await api.post(
      "/auth/register",
      formData
    );

    localStorage.setItem(
      "helpDeskToken",
      response.data.token
    );

    setUser(response.data.user);
  };

  const login = async (formData) => {
    const response = await api.post(
      "/auth/login",
      formData
    );

    localStorage.setItem(
      "helpDeskToken",
      response.data.token
    );

    setUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem("helpDeskToken");
    setUser(null);
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}