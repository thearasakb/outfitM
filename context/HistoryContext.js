
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const HistoryContext = createContext(null);

const STORAGE_KEY = 'outfitready-history';

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];

      setHistory(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.log('Load history failed:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const runLoad = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];

        if (active) {
          setHistory(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.log('Load history failed:', error);

        if (active) {
          setHistory([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    runLoad();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    const persistHistory = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(history)
        );
      } catch (error) {
        console.log('Save history failed:', error);
      }
    };

    persistHistory();
  }, [history, loading]);

  const saveHistoryEntry = useCallback(async (recommendation) => {
    const normalizedItems = Array.isArray(recommendation?.items)
      ? recommendation.items.map((item) => {
          // รองรับประวัติรูปแบบเก่า
          if (typeof item === 'string') {
            return item;
          }

          if (item && typeof item === 'object') {
            const imageValue =
              item.uri ||
              item.imageUri ||
              item.image ||
              item.url ||
              null;

            const uri =
              typeof imageValue === 'string'
                ? imageValue
                : imageValue?.uri || null;

            // เก็บข้อมูลรูปภาพไว้ด้วย ไม่ตัดเหลือแค่ชื่อ
            return {
              id: String(item.id || Date.now()),
              name: item.name || item.title || 'ชุดที่แนะนำ',
              title: item.title || item.name || 'ชุดที่แนะนำ',
              category: item.category || '',
              uri,
            };
          }

          return 'ชุดที่แนะนำ';
        })
      : [];

    const entry = {
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      title: recommendation?.title || 'Everyday Fresh',
      text: recommendation?.text || '',
      items: normalizedItems,
      image: recommendation?.image || recommendation?.uri || null,
    };

    setHistory((prev) => [entry, ...prev].slice(0, 20));

    return entry;
  }, []);

  const deleteHistoryEntry = useCallback((id) => {
    setHistory((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const value = useMemo(
    () => ({
      history,
      loading,
      saveHistoryEntry,
      deleteHistoryEntry,
      clearHistory,
      refreshHistory: loadHistory,
    }),
    [
      history,
      loading,
      loadHistory,
      saveHistoryEntry,
      deleteHistoryEntry,
      clearHistory,
    ]
  );

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
}
