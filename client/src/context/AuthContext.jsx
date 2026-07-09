import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // Register
  const register = async (formData) => {
    try {
      const { data } = await API.post("/auth/register", formData);

      localStorage.setItem("token", data.token);

      setUser(data.user);

      toast.success(data.message);

      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration Failed"
      );

      return false;
    }
  };

  // Login
  const login = async (formData) => {
    try {
      const { data } = await API.post("/auth/login", formData);

      localStorage.setItem("token", data.token);

      setUser(data.user);

      toast.success(data.message);

      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login Failed"
      );

      return false;
    }
  };

  // Logout
  const logout = () => {

    localStorage.removeItem("token");

    setUser(null);

    toast.success("Logged Out Successfully");

};

  // Current User
  const loadUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await API.get("/auth/me");

      setUser(data.user);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;