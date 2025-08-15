import React from 'react';
import { Plus, Clock, Star } from 'lucide-react';
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
          card: 'rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 backdrop-blur-sm relative group',
          image: 'aspect-square relative overflow-hidden',
          content: 'p-6',
          title: 'font-bold text-lg mb-2 line-clamp-2',
          description: 'text-sm mb-4 line-clamp-2 opacity-80',
          price: 'font-black text-2xl',
          unavailable: 'absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm rounded-3xl',
          prepTime: 'absolute top-4 left-4 text-white text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm flex items-center gap-1',
          addButton: 'absolute bottom-4 right-4 w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl transform transition-all duration-300 hover:scale-110 group-hover:scale-105 shadow-2xl',
          rating: 'absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1'
        };
      case 'elegant':
        return {
          card: 'rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-102 hover:shadow-2xl relative group border',
          image: 'aspect-square relative overflow-hidden',
          content: 'p-5',
          title: 'font-serif font-semibold text-lg mb-2 line-clamp-2',
          description: 'text-sm mb-3 line-clamp-2 italic opacity-75',
          price: 'font-serif font-bold text-xl',
          unavailable: 'absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-2xl',
          prepTime: 'absolute top-3 left-3 text-white text-xs px-3 py-1 rounded-lg font-medium backdrop-blur-sm flex items-center gap-1',
          addButton: 'absolute bottom-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold transform transition-all duration-300 hover:scale-110 shadow-xl',
          rating: 'absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1'
        };
      case 'minimal':
        return {
          card: 'rounded-xl overflow-hidden cursor-pointer transform transition-all duration-200 hover:shadow-lg hover:border-opacity-50 relative group border',
          image: 'aspect-square relative overflow-hidden',
          content: 'p-4',
          title: 'font-medium text-base mb-1 line-clamp-2',
          description: 'text-xs mb-2 line-clamp-2 opacity-70',
          price: 'font-semibold text-lg',
          unavailable: 'absolute inset-0 bg-gray-100 bg-opacity-90 flex items-center justify-center rounded-xl',
          prepTime: 'absolute top-2 left-2 text-white text-xs px-2 py-1 rounded font-medium backdrop-blur-sm flex items-center gap-1',
          addButton: 'absolute bottom-3 right-3 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm transform transition-all duration-200 hover:scale-105',
          rating: 'absolute top-2 right-2 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold flex items-center gap-1'
        };
      case 'vibrant':
        return {
          card: 'rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:rotate-1 relative group',
          image: 'aspect-square relative overflow-hidden',
          content: 'p-6',
          title: 'font-bold text-lg mb-2 line-clamp-2',
          description: 'text-sm mb-4 line-clamp-2',
          price: 'font-black text-2xl',
          unavailable: 'absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm rounded-3xl',
          prepTime: 'absolute top-4 left-4 text-white text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm flex items-center gap-1',
          addButton: 'absolute bottom-4 right-4 w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl transform transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-2xl',
          rating: 'absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1'
        };
      case 'dark':
        return {
          card: 'rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 relative group border border-opacity-30',
          image: 'aspect-square relative overflow-hidden',
          content: 'p-5',
          title: 'font-bold text-lg mb-2 line-clamp-2',
          description: 'text-sm mb-4 line-clamp-2 opacity-80',
          price: 'font-black text-xl',
          unavailable: 'absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center backdrop-blur-sm rounded-2xl',
          prepTime: 'absolute top-4 left-4 text-white text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm flex items-center gap-1',
          addButton: 'absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transform transition-all duration-300 hover:scale-110 shadow-2xl',
          rating: 'absolute top-4 right-4 bg-black bg-opacity-70 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 text-white'
        };
      case 'nature':
        return {
          card: 'rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 relative group',
          image: 'aspect-square relative overflow-hidden',
          content: 'p-5',
          title: 'font-semibold text-lg mb-2 line-clamp-2',
          description: 'text-sm mb-4 line-clamp-2 opacity-75',
          price: 'font-bold text-xl',
          unavailable: 'absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm rounded-2xl',
          prepTime: 'absolute top-4 left-4 text-white text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm flex items-center gap-1',
          addButton: 'absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transform transition-all duration-300 hover:scale-110 shadow-xl',
          rating: 'absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1'
        };
      case 'sunset':
        return {
          card: 'rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 relative group',
          image: 'aspect-square relative overflow-hidden',
          content: 'p-5',
          title: 'font-bold text-lg mb-2 line-clamp-2',
          description: 'text-sm mb-4 line-clamp-2 opacity-80',
          price: 'font-black text-xl',
          unavailable: 'absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm rounded-2xl',
          prepTime: 'absolute top-4 left-4 text-white text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm flex items-center gap-1',
          addButton: 'absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transform transition-all duration-300 hover:scale-110 shadow-xl',
          rating: 'absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1'
        };
      default: // classic
        return {
          card: 'rounded-xl overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg relative group',
          image: 'aspect-square relative overflow-hidden',
          content: 'p-4',
          title: 'font-semibold text-base mb-1 line-clamp-2',
          description: 'text-xs mb-2 line-clamp-2 opacity-75',
          price: 'font-bold text-lg',
          unavailable: 'absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center',
          prepTime: 'absolute top-3 left-3 text-white text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm flex items-center gap-1',
          addButton: 'absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg transform transition-all duration-200 hover:scale-110',
          rating: 'absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1'
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
        border: `1px solid ${colors.cardBorder}`,
        boxShadow: colors.shadow
      }}
    >
      <div className={styles.image}>
        <img
          src={item.photo || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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
            style={{ backgroundColor: `${colors.warning}90` }}
          >
            <Clock className="w-3 h-3" />
            {item.preparation_time}min
          </div>
        )}
        {item.popularity_score > 0 && (
          <div className={styles.rating}>
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            {item.popularity_score}
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
          {item.orders > 0 && (
            <div className="flex items-center text-xs" style={{ color: colors.textSecondary }}>
              <span>{item.orders} orders</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};