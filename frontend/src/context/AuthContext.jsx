import { createContext, useContext, useState, useEffect } from "react";
import { DEMO_ACCOUNTS, utilisateurs } from "../data/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  function login(email, password) {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const account = DEMO_ACCOUNTS.find(
          (a) => a.email === email && a.password === password
        );
        if (account) {
          setUser(account.user);
          setLoading(false);
          resolve(account.user);
        } else {
          setLoading(false);
          reject(new Error("Email ou mot de passe incorrect"));
        }
      }, 600);
    });
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  function hasRole(...roles) {
    return user && roles.includes(user.role);
  }

  const value = { user, login, logout, loading, hasRole, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
