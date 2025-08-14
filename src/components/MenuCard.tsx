import React from 'react';
import { Plus } from 'lucide-react';
import { MenuItem } from '../types';
import { MenuTheme, ThemeColors } from '../hooks/useMenuTheme';

interface MenuCardProps {
  item: MenuItem;
  onClick: () => void;
  onAddToCart: (item: MenuItem) => void;
  theme: MenuTheme;
  colors: ThemeColors;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onClick, onAddToCart, theme, colors }) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(item);
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'modern':
        return {
          card: 'rounded-2xl shadow-lg border-0 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm',
          image: 'aspect-square relative overflow-hidden',
          content: 'p-4',
          title: 'font-bold text-base mb-2 line-clamp-2',
          description: 'text-sm mb-3 line-clamp-2',
          price: 'font-black text-xl',
          unavailable: 'absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm',
          prepTime: 'absolute top-3 left-3 text-white text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm',
          addButton: 'absolute bottom-3 right-3 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl transform transition-all duration-200 hover:scale-110 hover:shadow-2xl'
        };
      case 'elegant':
        return {
          card: 'rounded-xl shadow-md border overflow-hidden cursor-pointer transform transition-all duration-200 hover:shadow-xl hover:scale-102',
          image: 'aspect-square relative overflow-hidden',
          content: 'p-4',
          title: 'font-serif font-semibold text-base mb-2 line-clamp-2',
          description: 'text-sm mb-3 line-clamp-2 italic',
          price: 'font-serif font-bold text-lg',
          unavailable: 'absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center',
          prepTime: 'absolute top-2 left-2 text-white text-xs px-2 py-1 rounded font-medium',
          addButton: 'absolute bottom-3 right-3 w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transform transition-all duration-200 hover:scale-105'
        };
      case 'minimal':
        return {
          card: 'rounded-lg border overflow-hidden cursor-pointer transform transition-all duration-150 hover:shadow-md hover:border-opacity-50',
          image: 'aspect-square relative overflow-hidden',
          content: 'p-3',
          title: 'font-medium text-sm mb-1 line-clamp-2',
          description: 'text-xs mb-2 line-clamp-2',
          price: 'font-semibold text-base',
          unavailable: 'absolute inset-0 bg-gray-100 bg-opacity-90 flex items-center justify-center',
          prepTime: 'absolute top-2 left-2 text-white text-xs px-2 py-1 rounded',
          addButton: 'absolute bottom-2 right-2 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm transform transition-all duration-150 hover:scale-105'
        };
      default: // classic
        return {
          card: 'rounded-xl shadow-sm border overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg',
          image: 'aspect-square relative overflow-hidden',
          content: 'p-3',
          title: 'font-semibold text-sm mb-1 line-clamp-2',
          description: 'text-xs mb-2 line-clamp-2',
          price: 'font-bold text-lg',
          unavailable: 'absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center',
          prepTime: 'absolute top-2 left-2 text-white text-xs px-2 py-1 rounded-full',
          addButton: 'absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg transform transition-all duration-200 hover:scale-110'
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div
      onClick={onClick}
      className={styles.card}
      style={{ 
        backgroundColor: colors.cardBackground,
        border: `1px solid ${colors.cardBorder}`
      }}
    >
      <div className={styles.image}>
        <img
          src={item.photo || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {!item.available && (
          <div className={styles.unavailable}>
            <span className="text-white font-semibold text-sm">Unavailable</span>
          </div>
        )}
        {item.preparation_time > 0 && (
          <div 
            className={styles.prepTime}
            style={{ backgroundColor: colors.warning }}
          >
            {item.preparation_time}min
          </div>
        )}
        {/* Always show add button for available items */}
        {item.available && (
          <button
            onClick={handleAddToCart}
            className={styles.addButton}
            style={{ backgroundColor: colors.primary }}
            data-item-id={item.id}
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title} style={{ color: colors.text }}>
          {item.name}
        </h3>
        <p className={styles.description} style={{ color: colors.textSecondary }}>
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <span className={styles.price} style={{ color: colors.primary }}>
            ${item.price.toFixed(2)}
          </span>
          {item.popularity_score > 0 && (
            <div className="flex items-center text-yellow-500 text-xs">
              <span>⭐</span>
              <span className="ml-1">{item.popularity_score}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};