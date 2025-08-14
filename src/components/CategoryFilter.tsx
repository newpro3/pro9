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
    const baseStyles = 'px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-200 border';
    
    if (isActive) {
      return `${baseStyles} text-white shadow-lg transform scale-105`;
    }
    
    return `${baseStyles} hover:shadow-sm hover:scale-102`;
  };

  return (
    <div 
      className="sticky top-0 z-10 px-4 py-3 backdrop-blur-md border-b"
      style={{ 
        backgroundColor: `${colors.surface}95`,
        borderColor: colors.border
      }}
    >
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => onCategoryChange('all')}
          className={getButtonStyles(activeCategory === 'all')}
          style={activeCategory === 'all' ? { 
            backgroundColor: colors.primary,
            borderColor: colors.primary
          } : { 
            backgroundColor: colors.cardBackground,
            color: colors.text,
            borderColor: colors.cardBorder
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
              borderColor: colors.primary
            } : { 
              backgroundColor: colors.cardBackground,
              color: colors.text,
              borderColor: colors.cardBorder
            }}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};