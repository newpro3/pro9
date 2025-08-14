import { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebase';

export type MenuTheme = 'classic' | 'modern' | 'elegant' | 'minimal';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
  background: string;
  surface: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  cardBackground: string;
  cardBorder: string;
  buttonText: string;
  gradientStart: string;
  gradientEnd: string;
}

export const getThemeColors = (theme: MenuTheme): ThemeColors => {
  switch (theme) {
    case 'modern':
      return {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa',
        text: '#1f2937',
        textSecondary: '#6b7280',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        surface: '#ffffff',
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        cardBackground: 'rgba(255, 255, 255, 0.95)',
        cardBorder: 'rgba(59, 130, 246, 0.2)',
        buttonText: '#ffffff',
        gradientStart: '#667eea',
        gradientEnd: '#764ba2'
      };
    case 'elegant':
      return {
        primary: '#d97706',
        secondary: '#92400e',
        accent: '#fbbf24',
        text: '#374151',
        textSecondary: '#6b7280',
        background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        surface: '#ffffff',
        border: '#f3f4f6',
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
        cardBackground: 'rgba(255, 255, 255, 0.9)',
        cardBorder: 'rgba(217, 119, 6, 0.3)',
        buttonText: '#ffffff',
        gradientStart: '#ffecd2',
        gradientEnd: '#fcb69f'
      };
    case 'minimal':
      return {
        primary: '#374151',
        secondary: '#111827',
        accent: '#6b7280',
        text: '#111827',
        textSecondary: '#6b7280',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        surface: '#ffffff',
        border: '#e5e7eb',
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
        cardBackground: 'rgba(255, 255, 255, 0.8)',
        cardBorder: 'rgba(55, 65, 81, 0.1)',
        buttonText: '#ffffff',
        gradientStart: '#f8fafc',
        gradientEnd: '#e2e8f0'
      };
    default: // classic
      return {
        primary: '#059669',
        secondary: '#047857',
        accent: '#10b981',
        text: '#1f2937',
        textSecondary: '#6b7280',
        background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
        surface: '#ffffff',
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        cardBackground: 'rgba(255, 255, 255, 0.95)',
        cardBorder: 'rgba(5, 150, 105, 0.2)',
        buttonText: '#ffffff',
        gradientStart: '#d4edda',
        gradientEnd: '#c3e6cb'
      };
  }
};

export const useMenuTheme = (userId?: string) => {
  const [theme, setTheme] = useState<MenuTheme>('classic');
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
      const userDoc = await firebaseService.getUserProfile(userId);
      if (userDoc?.settings?.menuTheme) {
        setTheme(userDoc.settings.menuTheme);
      } else {
        const savedTheme = localStorage.getItem(`menuTheme_${userId}`) as MenuTheme;
        if (savedTheme) {
          setTheme(savedTheme);
        }
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      const savedTheme = localStorage.getItem(`menuTheme_${userId}`) as MenuTheme;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = async (newTheme: MenuTheme) => {
    setTheme(newTheme);
    if (userId) {
      localStorage.setItem(`menuTheme_${userId}`, newTheme);
      try {
        await firebaseService.updateUserProfile(userId, {
          settings: {
            menuTheme: newTheme
          }
        });
      } catch (error) {
        console.error('Error updating theme in Firebase:', error);
      }
    }
  };

  const colors = getThemeColors(theme);

  return { theme, colors, updateTheme, loading };
};