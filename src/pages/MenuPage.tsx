import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMenuTheme } from '../hooks/useMenuTheme';
import { useCart } from '../hooks/useCart';
import { TableHeader } from '../components/TableHeader';
import { CategoryFilter } from '../components/CategoryFilter';
import { MenuCard } from '../components/MenuCard';
import { CartModal } from '../components/CartModal';
import { PaymentModal } from '../components/PaymentModal';
import { BillModal } from '../components/BillModal';
import { SettingsModal } from '../components/SettingsModal';
import { MenuDetail } from '../components/MenuDetail';
import { FeedbackModal } from '../components/FeedbackModal';
import { BottomNav } from '../components/BottomNav';
import { MenuItem } from '../types';

export const MenuPage: React.FC = () => {
  const { userId, tableNumber } = useParams<{ userId: string; tableNumber: string }>();
  const { theme, colors, loading: themeLoading } = useMenuTheme(userId || '');
  const { items: cartItems, addItem, updateQuantity, removeItem, clearCart, getTotalAmount } = useCart();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    // TODO: Fetch menu items and categories from Firebase
    // For now, using empty arrays to prevent undefined errors
    setMenuItems([]);
    setCategories(['All']);
    setLoading(false);
  }, [userId]);

  if (themeLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (!colors) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load menu theme</p>
        </div>
      </div>
    );
  }

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const handlePaymentSubmit = async (paymentData: { screenshotUrl: string; method: string }) => {
    // TODO: Handle payment submission
    console.log('Payment submitted:', paymentData);
    setShowPayment(false);
    clearCart();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <TableHeader 
        tableNumber={tableNumber || ''}
        cartItemCount={cartItems.length}
        onCartClick={() => setShowCart(true)}
        onSettingsClick={() => setShowSettings(true)}
        colors={colors}
      />

      <div className="px-4 py-6">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          colors={colors}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onAddToCart={addItem}
              onItemClick={setSelectedMenuItem}
              colors={colors}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found in this category</p>
          </div>
        )}
      </div>

      <BottomNav
        cartItemCount={cartItems.length}
        onCartClick={() => setShowCart(true)}
        onBillClick={() => setShowBill(true)}
        onFeedbackClick={() => setShowFeedback(true)}
        colors={colors}
      />

      {/* Modals */}
      {showCart && (
        <CartModal
          items={cartItems}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onCheckout={() => {
            setShowCart(false);
            setShowPayment(true);
          }}
          colors={colors}
        />
      )}

      {showPayment && (
        <PaymentModal
          items={cartItems}
          totalAmount={getTotalAmount()}
          tableNumber={tableNumber || ''}
          onClose={() => setShowPayment(false)}
          onPaymentSubmit={handlePaymentSubmit}
        />
      )}

      {showBill && (
        <BillModal
          tableNumber={tableNumber || ''}
          onClose={() => setShowBill(false)}
          colors={colors}
        />
      )}

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          colors={colors}
        />
      )}

      {showFeedback && (
        <FeedbackModal
          tableNumber={tableNumber || ''}
          onClose={() => setShowFeedback(false)}
          colors={colors}
        />
      )}

      {selectedMenuItem && (
        <MenuDetail
          item={selectedMenuItem}
          onClose={() => setSelectedMenuItem(null)}
          onAddToCart={addItem}
          colors={colors}
        />
      )}
    </div>
  );
};