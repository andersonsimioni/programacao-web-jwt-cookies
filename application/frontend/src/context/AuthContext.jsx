import { createContext, useState, useEffect } from 'react';
import { getMe } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // evita piscar entre login e dashboard

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getMe();
        if (!data.message) setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
