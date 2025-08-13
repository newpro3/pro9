import { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebase';

export const useMenuTheme = (userId?: string) => {
  const [theme, setTheme] = useState<'classic' | 'modern' | 'elegant' | 'minimal'>('classic');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadTheme();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadTheme = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      // Try to get from user settings first
      const userDoc = await firebaseService.getUserProfile(userId);
      if (userDoc?.settings?.menuTheme) {
        setTheme(userDoc.settings.menuTheme);
      } else {
        // Fallback to localStorage
        const savedTheme = localStorage.getItem(`menuTheme_${userId}`) as any;
        if (savedTheme) {
          setTheme(savedTheme);
        }
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      // Fallback to localStorage
      const savedTheme = localStorage.getItem(`menuTheme_${userId}`) as any;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = (newTheme: 'classic' | 'modern' | 'elegant' | 'minimal') => {
    setTheme(newTheme);
    if (userId) {
      localStorage.setItem(`menuTheme_${userId}`, newTheme);
      // Also update in Firebase
      firebaseService.updateUserProfile(userId, {
        settings: {
          menuTheme: newTheme
        }
      }).catch(error => {
        console.error('Error updating theme in Firebase:', error);
      });
    }
  };

  return { theme, updateTheme, loading };
};