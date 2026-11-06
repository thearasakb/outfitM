import React, { createContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PhotoContext = createContext(null);

const STORAGE_KEY = 'outfitready-photos';

export function PhotoProvider({ children }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const savedPhotos = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedPhotos) {
          const parsedPhotos = JSON.parse(savedPhotos);
          if (Array.isArray(parsedPhotos)) {
            setPhotos(parsedPhotos);
          }
        }
      } catch (error) {
        console.log('Load photos failed:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, []);

  useEffect(() => {
    const persistPhotos = async () => {
      if (loading) {
        return;
      }

      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
      } catch (error) {
        console.log('Save photos failed:', error);
      }
    };

    persistPhotos();
  }, [photos, loading]);

  const addPhoto = (photo) => {
    const payload = {
      id: photo.id || String(Date.now()),
      uri: photo.uri || '',
      name: photo.name || 'ชุดใหม่',
      category: photo.category || 'ทั่วไป',
      notes: photo.notes || '',
      favorite: Boolean(photo.favorite),
      createdAt: photo.createdAt || new Date().toISOString(),
    };

    setPhotos((prev) => [payload, ...prev]);
    return payload;
  };

  const removePhoto = (id) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  const toggleFavorite = (id) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === id ? { ...photo, favorite: !photo.favorite } : photo
      )
    );
  };

  const clearPhotos = () => {
    setPhotos([]);
  };

  const value = useMemo(
    () => ({
      photos,
      loading,
      addPhoto,
      removePhoto,
      toggleFavorite,
      clearPhotos,
      setPhotos,
    }),
    [photos, loading]
  );

  return <PhotoContext.Provider value={value}>{children}</PhotoContext.Provider>;
}
