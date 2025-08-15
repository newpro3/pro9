import { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebase';

export type MenuTheme = 'classic' | 'modern' | 'elegant' | 'minimal' | 'vibrant' | 'dark' | 'nature' | 'sunset';

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
  shadow: string;
  overlay: string;
  highlight: string;
}

export const getThemeColors = (theme: MenuTheme): ThemeColors => {
  switch (theme) {
    case 'modern':
      return {
        primary: '#6366f1',
        secondary: '#4f46e5',
        accent: '#8b5cf6',
        text: '#1f2937',
        textSecondary: '#6b7280',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        surface: '#ffffff',
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        cardBackground: 'rgba(255, 255, 255, 0.95)',
        cardBorder: 'rgba(99, 102, 241, 0.2)',
        buttonText: '#ffffff',
        gradientStart: '#667eea',
        gradientEnd: '#764ba2',
        shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        overlay: 'rgba(99, 102, 241, 0.1)',
        highlight: '#f0f9ff'
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
        gradientEnd: '#fcb69f',
        shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overlay: 'rgba(217, 119, 6, 0.1)',
        highlight: '#fef3c7'
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
        gradientEnd: '#e2e8f0',
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        overlay: 'rgba(55, 65, 81, 0.05)',
        highlight: '#f1f5f9'
      };
    case 'vibrant':
      return {
        primary: '#ec4899',
        secondary: '#be185d',
        accent: '#f472b6',
        text: '#1f2937',
        textSecondary: '#6b7280',
        background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        surface: '#ffffff',
        border: '#fce7f3',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        cardBackground: 'rgba(255, 255, 255, 0.95)',
        cardBorder: 'rgba(236, 72, 153, 0.2)',
        buttonText: '#ffffff',
        gradientStart: '#ffecd2',
        gradientEnd: '#fcb69f',
        shadow: '0 20px 25px -5px rgba(236, 72, 153, 0.1), 0 10px 10px -5px rgba(236, 72, 153, 0.04)',
        overlay: 'rgba(236, 72, 153, 0.1)',
        highlight: '#fdf2f8'
      };
    case 'dark':
      return {
        primary: '#60a5fa',
        secondary: '#3b82f6',
        accent: '#93c5fd',
        text: '#f9fafb',
        textSecondary: '#d1d5db',
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        surface: '#374151',
        border: '#4b5563',
        success: '#34d399',
        warning: '#fbbf24',
        error: '#f87171',
        cardBackground: 'rgba(55, 65, 81, 0.95)',
        cardBorder: 'rgba(96, 165, 250, 0.3)',
        buttonText: '#ffffff',
        gradientStart: '#1f2937',
        gradientEnd: '#111827',
        shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overlay: 'rgba(96, 165, 250, 0.1)',
        highlight: '#1e3a8a'
      };
    case 'nature':
      return {
        primary: '#16a34a',
        secondary: '#15803d',
        accent: '#22c55e',
        text: '#1f2937',
        textSecondary: '#6b7280',
        background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
        surface: '#ffffff',
        border: '#dcfce7',
        success: '#16a34a',
        warning: '#eab308',
        error: '#dc2626',
        cardBackground: 'rgba(255, 255, 255, 0.95)',
        cardBorder: 'rgba(22, 163, 74, 0.2)',
        buttonText: '#ffffff',
        gradientStart: '#d4edda',
        gradientEnd: '#c3e6cb',
        shadow: '0 20px 25px -5px rgba(22, 163, 74, 0.1), 0 10px 10px -5px rgba(22, 163, 74, 0.04)',
        overlay: 'rgba(22, 163, 74, 0.1)',
        highlight: '#f0fdf4'
      };
    case 'sunset':
      return {
        primary: '#f97316',
        secondary: '#ea580c',
        accent: '#fb923c',
        text: '#1f2937',
        textSecondary: '#6b7280',
        background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
        surface: '#ffffff',
        border: '#fed7aa',
        success: '#16a34a',
        warning: '#f59e0b',
        error: '#dc2626',
        cardBackground: 'rgba(255, 255, 255, 0.95)',
        cardBorder: 'rgba(249, 115, 22, 0.2)',
        buttonText: '#ffffff',
        gradientStart: '#fed7aa',
        gradientEnd: '#fdba74',
        shadow: '0 20px 25px -5px rgba(249, 115, 22, 0.1), 0 10px 10px -5px rgba(249, 115, 22, 0.04)',
        overlay: 'rgba(249, 115, 22, 0.1)',
        highlight: '#fff7ed'
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
        gradientEnd: '#c3e6cb',
        shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        overlay: 'rgba(5, 150, 105, 0.1)',
        highlight: '#f0fdf4'
      };
  }
};

export const useMenuTheme = (userId?: string) => {
  const [theme, setTheme] = useState<MenuTheme>('modern');
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