import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
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
    } catch {
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
      } catch {
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
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.log('Save history failed:', error);
      }
    };

    persistHistory();
  }, [history, loading]);

  const saveHistoryEntry = useCallback(async (recommendation) => {
    const normalizedItems = Array.isArray(recommendation?.items)
      ? recommendation.items.map((item) => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object') {
            return item.name || item.title || 'ชุดที่แนะนำ';
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
    setHistory((prev) => prev.filter((item) => item.id !== id));
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
    [history, loading, loadHistory, saveHistoryEntry, deleteHistoryEntry, clearHistory]
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}
