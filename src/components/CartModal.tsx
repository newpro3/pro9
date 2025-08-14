import React from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { OrderItem } from '../types';
import { MenuTheme, ThemeColors } from '../hooks/useMenuTheme';

interface CartModalProps {
  items: OrderItem[];
  totalAmount: number;
  tableNumber: string;
  theme: MenuTheme;
  colors: ThemeColors;
  onClose: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onPlaceOrder: () => void;
  onPaymentOrder?: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  items,
  totalAmount,
  tableNumber,
  theme,
  colors,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onPaymentOrder,
}) => {
  const getModalStyles = () => {
    switch (theme) {
      case 'modern':
        return {
          modal: 'bg-white rounded-3xl shadow-2xl',
          button: 'rounded-xl font-semibold',
          itemCard: 'rounded-2xl',
          quantityButton: 'rounded-xl'
        };
      case 'elegant':
        return {
          modal: 'bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-xl border border-amber-100',
          button: 'rounded-lg font-serif font-semibold',
          itemCard: 'rounded-xl',
          quantityButton: 'rounded-lg'
        };
      case 'minimal':
        return {
          modal: 'bg-white rounded-lg shadow-lg border',
          button: 'rounded font-medium',
          itemCard: 'rounded',
          quantityButton: 'rounded'
        };
      default:
        return {
          modal: 'bg-white rounded-2xl shadow-xl',
          button: 'rounded-lg font-semibold',
          itemCard: 'rounded-xl',
          quantityButton: 'rounded-lg'
        };
    }
  };

  const styles = getModalStyles();

  if (items.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div 
          className={`${styles.modal} p-6 max-w-sm w-full text-center`}
          style={{ 
            backgroundColor: colors.cardBackground,
            border: `1px solid ${colors.cardBorder}`
          }}
        >
          <h2 className="text-xl font-bold mb-3" style={{ color: colors.text }}>
            Your cart is empty
          </h2>
          <p className="mb-5 text-sm" style={{ color: colors.textSecondary }}>
            Add some delicious items to get started!
          </p>
          <button
            onClick={onClose}
            className={`w-full py-3 ${styles.button} text-white transition-colors`}
            style={{ backgroundColor: colors.primary }}
          >
            Continue Browsing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        className={`${styles.modal} w-full max-w-md max-h-[90vh] overflow-hidden animate-slide-up flex flex-col`}
        style={{ 
          backgroundColor: colors.cardBackground,
          border: `1px solid ${colors.cardBorder}`
        }}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: colors.border }}>
          <h2 className="text-lg font-bold" style={{ color: colors.text }}>
            Your Order
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" style={{ color: colors.text }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.map((item) => (
            <div 
              key={item.id} 
              className={`flex items-center space-x-3 p-3 ${styles.itemCard}`}
              style={{ 
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`
              }}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-sm" style={{ color: colors.text }}>
                  {item.name}
                </h3>
                <p className="text-sm font-medium" style={{ color: colors.primary }}>
                  ${item.price.toFixed(2)} each
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <div 
                  className="flex items-center border"
                  style={{ 
                    backgroundColor: colors.background,
                    borderColor: colors.border
                  }}
                >
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className={`p-2 hover:bg-gray-100 transition-colors ${styles.quantityButton}`}
                  >
                    <Minus className="w-4 h-4" style={{ color: colors.text }} />
                  </button>
                  <span className="px-3 py-1 font-semibold text-sm" style={{ color: colors.text }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className={`p-2 hover:bg-gray-100 transition-colors ${styles.quantityButton}`}
                  >
                    <Plus className="w-4 h-4" style={{ color: colors.text }} />
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-bold text-sm" style={{ color: colors.text }}>
                    ${item.total.toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className={`p-2 hover:bg-red-50 transition-colors ${styles.quantityButton}`}
                  style={{ color: colors.error }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div 
          className="p-4 border-t"
          style={{ 
            backgroundColor: colors.cardBackground,
            borderColor: colors.border
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-bold" style={{ color: colors.text }}>
              Total
            </span>
            <span className="text-xl font-bold" style={{ color: colors.primary }}>
              ${totalAmount.toFixed(2)}
            </span>
          </div>

          <div className="space-y-3">
            <button
              onClick={onPlaceOrder}
              className={`w-full py-3 ${styles.button} text-white transition-colors`}
              style={{ backgroundColor: colors.primary }}
            >
              Place Order (Pay Later)
            </button>
            {onPaymentOrder && (
              <button
                onClick={onPaymentOrder}
                className={`w-full py-3 ${styles.button} text-white transition-colors`}
                style={{ backgroundColor: colors.success }}
              >
                Pay Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};