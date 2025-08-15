import React from 'react';
import { Home, ChefHat, Receipt, ShoppingCart, Settings, FileText } from 'lucide-react';
import { useTranslation } from '../utils/translations';
import { MenuTheme, ThemeColors } from '../hooks/useMenuTheme';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onWaiterCall: () => void;
  onBillClick: () => void;
  onCartClick: () => void;
  onSettingsClick: () => void;
  cartItemCount: number;
  language: 'en' | 'am';
  theme: MenuTheme;
  colors: ThemeColors;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onWaiterCall,
  onBillClick,
  onCartClick,
  onSettingsClick,
  cartItemCount,
  language,
  theme,
  colors,
}) => {
  const t = useTranslation(language);

  const getButtonStyles = (isActive: boolean) => {
    const baseStyles = 'flex flex-col items-center py-3 px-4 rounded-2xl transition-all duration-300 backdrop-blur-sm';
    
    if (isActive) {
      return `${baseStyles} shadow-xl transform scale-110`;
    }
    
    return `${baseStyles} hover:bg-opacity-20 hover:scale-105`;
  };

  const getNavStyles = () => {
    switch (theme) {
      case 'modern':
        return 'rounded-t-3xl shadow-2xl border-t-2';
      case 'elegant':
        return 'rounded-t-2xl shadow-xl border-t-2';
      case 'minimal':
        return 'border-t-2';
      case 'vibrant':
        return 'rounded-t-3xl shadow-2xl border-t-2';
      case 'dark':
        return 'rounded-t-2xl shadow-2xl border-t-2';
      case 'nature':
        return 'rounded-t-2xl shadow-xl border-t-2';
      case 'sunset':
        return 'rounded-t-2xl shadow-xl border-t-2';
      default:
        return 'rounded-t-2xl shadow-xl border-t-2';
    }
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 px-6 py-4 safe-area-pb backdrop-blur-xl ${getNavStyles()}`}
      style={{ 
        backgroundColor: `${colors.surface}95`,
        borderColor: colors.primary
      }}
    >
      <div className="flex items-center justify-around">
        <button
          onClick={() => onTabChange('home')}
          className={getButtonStyles(activeTab === 'home')}
          style={activeTab === 'home' ? { 
            backgroundColor: colors.primary,
            color: 'white',
            boxShadow: `0 8px 25px ${colors.primary}40`
          } : { color: colors.textSecondary }}
        >
          <Home className="w-5 h-5 mb-1" />
          <span className="text-xs font-semibold">{t('home')}</span>
        </button>

        <button
          onClick={onWaiterCall}
          className={getButtonStyles(false)}
          style={{ color: colors.accent }}
        >
          <ChefHat className="w-5 h-5 mb-1" />
          <span className="text-xs font-semibold">{t('waiter')}</span>
        </button>

        <button
          onClick={onCartClick}
          className={`relative ${getButtonStyles(false)}`}
          style={{ color: colors.success }}
        >
          <ShoppingCart className="w-5 h-5 mb-1" />
          <span className="text-xs font-semibold">{t('cart')}</span>
          {cartItemCount > 0 && (
            <div 
              className="absolute -top-2 -right-2 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg"
              style={{ backgroundColor: colors.error }}
            >
              {cartItemCount > 9 ? '9+' : cartItemCount}
            </div>
          )}
        </button>

        <button
          onClick={onBillClick}
          className={getButtonStyles(false)}
          style={{ color: colors.warning }}
        >
          <FileText className="w-5 h-5 mb-1" />
          <span className="text-xs font-semibold">{t('bill')}</span>
        </button>

        <button
          onClick={onSettingsClick}
          className={getButtonStyles(false)}
          style={{ color: colors.textSecondary }}
        >
          <Settings className="w-5 h-5 mb-1" />
          <span className="text-xs font-semibold">{t('settings')}</span>
        </button>
      </div>
    </div>
  );
};