import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("inventory_user")) || null
  );

  const login = async (credentials) => {
    const fakeUser = {
      id: 1,
      username: "admin",
      email: credentials.email,
      role: "admin",
    };

    setUser(fakeUser);
    localStorage.setItem("inventory_user", JSON.stringify(fakeUser));
    return { data: { user: fakeUser } };
  };

  const register = async (payload) => {
    return {
      data: {
        message: "User registered successfully",
        user: {
          id: Date.now(),
          username: payload.username,
          email: payload.email,
          role: payload.role,
        },
      },
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("inventory_user");
  };

  const value = useMemo(() => ({ user, login, register, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}