import React from 'react';
import { X, Receipt, CreditCard } from 'lucide-react';
import { TableBill } from '../types';
import { MenuTheme, ThemeColors } from '../hooks/useMenuTheme';

interface BillModalProps {
  tableBill: TableBill | null;
  tableNumber: string;
  businessName: string;
  theme: MenuTheme;
  colors: ThemeColors;
  onClose: () => void;
  onPaymentOrder: () => void;
}



export const BillModal: React.FC<BillModalProps> = ({
  tableBill,
  tableNumber,
  businessName,
  theme,
  colors,
  onClose,
  onPaymentOrder,
}) => {
  const getModalStyles = () => {
    switch (theme) {
      case 'modern':
        return {
          modal: 'bg-white rounded-3xl shadow-2xl',
          button: 'rounded-xl font-semibold'
        };
      case 'elegant':
        return {
          modal: 'bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-xl border border-amber-100',
          button: 'rounded-lg font-serif font-semibold'
        };
      case 'minimal':
        return {
          modal: 'bg-white rounded-lg shadow-lg border',
          button: 'rounded font-medium'
        };
      default:
        return {
          modal: 'bg-white rounded-2xl shadow-xl',
          button: 'rounded-lg font-semibold'
        };
    }
  };

  const styles = getModalStyles();

  if (!tableBill) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div 
          className={`${styles.modal} p-6 max-w-sm w-full text-center`}
          style={{ 
            backgroundColor: colors.cardBackground,
            border: `1px solid ${colors.cardBorder}`
          }}
        >
          <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-bold mb-3" style={{ color: colors.text }}>
            No Outstanding Bill
          </h2>
          <p className="mb-5 text-sm" style={{ color: colors.textSecondary }}>
            Table {tableNumber} has no current orders.
          </p>
          <button
            onClick={onClose}
            className={`w-full text-white py-3 ${styles.button} transition-colors`}
            style={{ backgroundColor: colors.textSecondary }}
          >
            Close
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
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <h2 className="text-lg font-bold" style={{ color: colors.text }}>
            Current Bill
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close bill"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Business Header */}
          <div className="text-center mb-6 pb-4 border-b">
            <h1 className="text-xl font-bold" style={{ color: colors.text }}>
              {businessName}
            </h1>
            <p style={{ color: colors.textSecondary }}>Table {tableNumber}</p>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {new Date(tableBill.updatedAt).toLocaleString()}
            </p>
          </div>

          {/* Bill Items */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold" style={{ color: colors.text }}>
              Items Ordered
            </h3>
            {tableBill.items.map((item, index) => (
              <div 
                key={`${item.id}-${index}`} 
                className="flex justify-between items-center py-2 border-b"
                style={{ borderColor: colors.border }}
              >
                <div className="flex-1">
                  <p className="font-medium" style={{ color: colors.text }}>
                    {item.name}
                  </p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold" style={{ color: colors.text }}>
                  ${item.total.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Bill Totals */}
          <div 
            className="p-4 rounded-lg space-y-2 mb-6 border"
            style={{ 
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`
            }}
          >
            <div className="flex justify-between text-sm">
              <span style={{ color: colors.textSecondary }}>Subtotal:</span>
              <span className="font-medium">${tableBill.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: colors.textSecondary }}>
                Tax ({((tableBill.tax / tableBill.subtotal) * 100).toFixed(0)}%):
              </span>
              <span className="font-medium">${tableBill.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span style={{ color: colors.primary }}>
                ${tableBill.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-4">
            <button
              onClick={onPaymentOrder}
              className={`w-full text-white py-3 ${styles.button} transition-colors flex items-center justify-center gap-2`}
              style={{ backgroundColor: colors.primary }}
            >
              <CreditCard className="w-5 h-5" />
              Pay Now
            </button>
            <p className="text-xs text-center" style={{ color: colors.textSecondary }}>
              You'll be able to select your payment method in the next step
            </p>
          </div>
        </div>

        <div 
          className="p-4 border-t"
          style={{ 
            backgroundColor: colors.cardBackground,
            borderColor: colors.border
          }}
        >
          <button
            onClick={onClose}
            className={`w-full text-white py-3 ${styles.button} transition-colors`}
            style={{ backgroundColor: colors.textSecondary }}
          >
            Close Bill
          </button>
        </div>
      </div>
    </div>
  );
};