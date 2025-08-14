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
    const baseStyles = 'flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200';
    
    if (isActive) {
      return `${baseStyles} shadow-md transform scale-105`;
    }
    
    return `${baseStyles} hover:bg-opacity-10`;
  };

  const getNavStyles = () => {
    switch (theme) {
      case 'modern':
        return 'rounded-t-3xl shadow-2xl';
      case 'elegant':
        return 'rounded-t-2xl shadow-xl border-t border-amber-200';
      case 'minimal':
        return 'border-t';
      default:
        return 'rounded-t-xl shadow-lg';
    }
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 px-4 py-2 safe-area-pb backdrop-blur-md ${getNavStyles()}`}
      style={{ 
        backgroundColor: `${colors.surface}95`,
        borderColor: colors.border
      }}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={() => onTabChange('home')}
          className={getButtonStyles(activeTab === 'home')}
          style={activeTab === 'home' ? { 
            backgroundColor: colors.primary,
            color: 'white'
          } : { color: colors.textSecondary }}
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">{t('home')}</span>
        </button>

        <button
          onClick={onWaiterCall}
          className={getButtonStyles(false)}
          style={{ color: colors.accent }}
        >
          <ChefHat className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">{t('waiter')}</span>
        </button>

        <button
          onClick={onCartClick}
          className={`relative ${getButtonStyles(false)}`}
          style={{ color: colors.success }}
        >
          <ShoppingCart className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">{t('cart')}</span>
          {cartItemCount > 0 && (
            <div 
              className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
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
          <FileText className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">{t('bill')}</span>
        </button>

        <button
          onClick={onSettingsClick}
          className={getButtonStyles(false)}
          style={{ color: colors.textSecondary }}
        >
          <Settings className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">{t('settings')}</span>
        </button>
      </div>
    </div>
  );
};