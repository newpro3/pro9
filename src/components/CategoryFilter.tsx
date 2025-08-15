import React from 'react';
import { MenuTheme, ThemeColors } from '../hooks/useMenuTheme';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  theme: MenuTheme;
  colors: ThemeColors;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  theme,
  colors,
}) => {
  const getButtonStyles = (isActive: boolean) => {
    const baseStyles = 'px-6 py-3 rounded-full whitespace-nowrap font-medium transition-all duration-300 border-2 backdrop-blur-sm';
    
    if (isActive) {
      return `${baseStyles} text-white shadow-xl transform scale-105`;
    }
    
    return `${baseStyles} hover:shadow-lg hover:scale-102 hover:backdrop-blur-md`;
  };

  return (
    <div 
      className="sticky top-0 z-10 px-4 py-4 backdrop-blur-md"
      style={{ 
        backgroundColor: `${colors.surface}90`
      }}
    >
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
        <button
          onClick={() => onCategoryChange('all')}
          className={getButtonStyles(activeCategory === 'all')}
          style={activeCategory === 'all' ? { 
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            boxShadow: `0 8px 25px ${colors.primary}40`
          } : { 
            backgroundColor: colors.cardBackground,
            color: colors.text,
            borderColor: colors.cardBorder,
            backdropFilter: 'blur(10px)'
          }}
        >
          All Items
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={getButtonStyles(activeCategory === category)}
            style={activeCategory === category ? { 
              backgroundColor: colors.primary,
              borderColor: colors.primary,
              boxShadow: `0 8px 25px ${colors.primary}40`
            } : { 
              backgroundColor: colors.cardBackground,
              color: colors.text,
              borderColor: colors.cardBorder,
              backdropFilter: 'blur(10px)'
            }}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};