
import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

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
      ...(user || {}),
      email: identifier.trim(),
      name: user?.name || identifier.trim() || 'User',
      password,
      loggedInAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(userData)
    );

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
      password,
      avatar: null,
      loggedInAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(userData)
    );

    setUser(userData);
    return userData;
  };

  const updateProfile = async (profileData = {}) => {
    if (!user) {
      throw new Error('ไม่พบข้อมูลบัญชีผู้ใช้');
    }

    const nextUser = {
      ...user,
      name: (profileData.name ?? user.name ?? '').trim(),
      avatar: profileData.avatar ?? user.avatar ?? null,
    };

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nextUser)
    );

    setUser(nextUser);
    return nextUser;
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) {
      throw new Error('ไม่พบข้อมูลบัญชีผู้ใช้');
    }

    if (!currentPassword || !newPassword) {
      throw new Error('กรุณากรอกรหัสผ่านให้ครบ');
    }

    if (!user.password) {
      throw new Error(
        'บัญชีนี้ยังไม่มีรหัสผ่านเดิมที่บันทึกไว้ กรุณาเข้าสู่ระบบใหม่ก่อนเปลี่ยนรหัสผ่าน'
      );
    }

    if (user.password !== currentPassword) {
      throw new Error('รหัสผ่านเดิมไม่ถูกต้อง');
    }

    if (currentPassword === newPassword) {
      throw new Error('รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม');
    }

    const nextUser = {
      ...user,
      password: newPassword,
    };

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nextUser)
    );

    setUser(nextUser);
    return true;
  };

  const deleteAccount = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      updateProfile,
      changePassword,
      deleteAccount,
      logout,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
