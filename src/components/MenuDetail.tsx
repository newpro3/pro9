import React, { useState } from 'react';
import { X, Plus, Minus, Clock, AlertTriangle } from 'lucide-react';
import { MenuItem } from '../types';
import { MenuTheme, ThemeColors } from '../hooks/useMenuTheme';

interface MenuDetailProps {
  item: MenuItem;
  theme: MenuTheme;
  colors: ThemeColors;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export const MenuDetail: React.FC<MenuDetailProps> = ({ item, theme, colors, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    onClose();
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const getModalStyles = () => {
    switch (theme) {
      case 'modern':
        return {
          modal: 'bg-white rounded-3xl shadow-2xl',
          button: 'rounded-xl font-semibold text-base',
          quantityButton: 'rounded-xl'
        };
      case 'elegant':
        return {
          modal: 'bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-xl border border-amber-100',
          button: 'rounded-lg font-serif font-semibold',
          quantityButton: 'rounded-lg'
        };
      case 'minimal':
        return {
          modal: 'bg-white rounded-lg shadow-lg border',
          button: 'rounded font-medium',
          quantityButton: 'rounded'
        };
      default:
        return {
          modal: 'bg-white rounded-2xl shadow-xl',
          button: 'rounded-lg font-semibold',
          quantityButton: 'rounded-lg'
        };
    }
  };

  const styles = getModalStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        className={`${styles.modal} w-full max-w-md max-h-[90vh] overflow-hidden animate-slide-up flex flex-col`}
        style={{ 
          backgroundColor: colors.cardBackground,
          border: `1px solid ${colors.cardBorder}`
        }}
      >
        <div className="relative">
          <img
            src={item.photo || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
            alt={item.name}
            className="w-full h-36 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 rounded-full p-2 hover:bg-opacity-100 transition-all"
            style={{ 
              backgroundColor: `${colors.surface}90`,
              backdropFilter: 'blur(8px)'
            }}
          >
            <X className="w-5 h-5" style={{ color: colors.text }} />
          </button>
          {!item.available && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Currently Unavailable</span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: colors.text }}>
              {item.name}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
              {item.description}
            </p>
            <div className="mt-3">
              <span className="text-2xl font-bold" style={{ color: colors.primary }}>
                ${item.price.toFixed(2)}
              </span>
              {item.popularity_score > 0 && (
                <div className="inline-flex items-center ml-3 text-yellow-500">
                  <span className="text-base">⭐</span>
                  <span className="ml-1 font-semibold text-sm">{item.popularity_score}/100</span>
                </div>
              )}
            </div>
          </div>

          {item.preparation_time > 0 && (
            <div 
              className="flex items-center px-3 py-2 rounded-lg"
              style={{ 
                backgroundColor: `${colors.warning}20`,
                color: colors.warning
              }}
            >
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">Preparation time: {item.preparation_time} minutes</span>
            </div>
          )}

          {item.ingredients && (
            <div>
              <h3 className="font-semibold mb-1 text-sm" style={{ color: colors.text }}>
                Ingredients
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                {item.ingredients}
              </p>
            </div>
          )}

          {item.allergens && (
            <div 
              className="flex items-start px-3 py-2 rounded-lg"
              style={{ 
                backgroundColor: `${colors.error}20`,
                color: colors.error
              }}
            >
              <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold text-sm">Allergens: </span>
                <span className="text-sm">{item.allergens}</span>
              </div>
            </div>
          )}

          {(item.views > 0 || item.orders > 0) && (
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <h3 className="font-semibold mb-1 text-sm" style={{ color: colors.text }}>
                Popularity
              </h3>
              <div className="flex space-x-4 text-xs" style={{ color: colors.textSecondary }}>
                {item.views > 0 && <span>👁️ {item.views} views</span>}
                {item.orders > 0 && <span>🛒 {item.orders} orders</span>}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t" style={{ 
          backgroundColor: colors.cardBackground,
          borderColor: colors.border
        }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              {quantity > 1 && (
                <div className="text-sm mb-1" style={{ color: colors.textSecondary }}>
                  ${item.price.toFixed(2)} × {quantity}
                </div>
              )}
              <div className="text-xl font-bold" style={{ color: colors.primary }}>
                Total: ${(item.price * quantity).toFixed(2)}
              </div>
            </div>

            <div 
              className="flex items-center rounded-lg"
              style={{ backgroundColor: colors.background }}
            >
              <button
                onClick={decrementQuantity}
                className={`p-2 hover:bg-opacity-80 transition-colors ${styles.quantityButton}`}
                style={{ backgroundColor: colors.border }}
              >
                <Minus className="w-4 h-4" style={{ color: colors.text }} />
              </button>
              <span className="px-4 py-2 font-semibold text-base" style={{ color: colors.text }}>
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                className={`p-2 hover:bg-opacity-80 transition-colors ${styles.quantityButton}`}
                style={{ backgroundColor: colors.border }}
              >
                <Plus className="w-4 h-4" style={{ color: colors.text }} />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!item.available}
            className={`w-full py-3 ${styles.button} text-white transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed`}
            style={{ 
              backgroundColor: item.available ? colors.primary : '#d1d5db'
            }}
          >
            {item.available ? 'Add to Order' : 'Currently Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};