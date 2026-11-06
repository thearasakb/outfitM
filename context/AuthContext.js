import React, { createContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'outfitready-user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log('Load auth user failed:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (identifier, password) => {
    if (!identifier || !password) {
      throw new Error('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
    }

    const userData = {
      email: identifier.trim(),
      name: identifier.trim() || 'User',
      loggedInAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (username, email, password) => {
    if (!username || !password) {
      throw new Error('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
    }

    const userData = {
      name: username.trim(),
      email: email.trim(),
      loggedInAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
