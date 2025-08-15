import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMenuTheme } from '../hooks/useMenuTheme';
import { useCart } from '../hooks/useCart';
import { useSettings } from '../hooks/useSettings';
import { CategoryFilter } from '../components/CategoryFilter';
import { MenuCard } from '../components/MenuCard';
import { CartModal } from '../components/CartModal';
import { PaymentModal } from '../components/PaymentModal';
import { BillModal } from '../components/BillModal';
import { SettingsModal } from '../components/SettingsModal';
import { MenuDetail } from '../components/MenuDetail';
import { FeedbackModal } from '../components/FeedbackModal';
import { BottomNav } from '../components/BottomNav';
import { MenuItem, User } from '../types';
import { firebaseService } from '../services/firebase';
import { Utensils, MapPin, Clock } from 'lucide-react';

export const MenuPage: React.FC = () => {
  const { userId, tableNumber } = useParams<{ userId: string; tableNumber: string }>();
  const { theme, colors, loading: themeLoading } = useMenuTheme(userId || '');
  const { settings } = useSettings();
  const { items: cartItems, addItem, updateQuantity, removeItem, clearCart, getTotalAmount } = useCart();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [businessInfo, setBusinessInfo] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('menu');
  
  // Modal states
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (userId) {
      loadMenuData();
    }
  }, [userId]);

  const loadMenuData = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const [items, cats, userInfo] = await Promise.all([
        firebaseService.getMenuItems(userId),
        firebaseService.getCategories(userId),
        firebaseService.getUserProfile(userId)
      ]);
      
      setMenuItems(items);
      const categoryNames = cats.map(cat => cat.name);
      setCategories(['all', ...categoryNames]);
      setBusinessInfo(userInfo);
    } catch (error) {
      console.error('Error loading menu data:', error);
    } finally {
      setLoading(false);
    }
  };

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
    try {
      // Create payment confirmation
      const subtotal = getTotalAmount();
      const tax = subtotal * 0.15;
      const total = subtotal + tax;
      
      await firebaseService.addPaymentConfirmation({
        tableNumber: tableNumber || '',
        items: cartItems,
        subtotal,
        tax,
        total,
        method: paymentData.method as 'bank_transfer' | 'mobile_money',
        screenshotUrl: paymentData.screenshotUrl,
        status: 'pending',
        userId: userId || ''
      });
      
      setShowPayment(false);
      clearCart();
      alert('Payment submitted for verification!');
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('Failed to submit payment. Please try again.');
    }
  };

  const handleWaiterCall = () => {
    alert('Waiter has been called! They will be with you shortly.');
  };

  return (
    <div className="min-h-screen" style={{ background: colors.background }}>
      {/* Modern Header with Business Info */}
      <div 
        className="px-6 py-8 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {businessInfo?.logo ? (
                <img 
                  src={businessInfo.logo} 
                  alt={businessInfo.businessName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white border-opacity-30"
                />
              ) : (
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Utensils className="w-6 h-6" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">
                  {businessInfo?.businessName || 'Restaurant'}
                </h1>
                <div className="flex items-center space-x-4 text-sm opacity-90">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>Table {tableNumber}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">
                {settings?.orderType === 'dine-in' ? 'Dine In' : 'Takeaway'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 pb-24">
        <CategoryFilter
          categories={categories}
          activeCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          theme={theme}
          colors={colors}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onAddToCart={addItem}
              onClick={() => setSelectedMenuItem(item)}
              theme={theme}
              colors={colors}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.surface }}>
              <Utensils className="w-12 h-12" style={{ color: colors.textSecondary }} />
            </div>
            <p style={{ color: colors.textSecondary }}>No items found in this category</p>
          </div>
        )}
      </div>

      <BottomNav
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCartClick={() => setShowCart(true)}
        onBillClick={() => setShowBill(true)}
        onWaiterCall={handleWaiterCall}
        onSettingsClick={() => setShowSettings(true)}
        language={settings?.language || 'en'}
        theme={theme}
        colors={colors}
      />

      {/* Modals */}
      {showCart && (
        <CartModal
          items={cartItems}
          totalAmount={getTotalAmount()}
          tableNumber={tableNumber || ''}
          theme={theme}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onPlaceOrder={() => {
            setShowCart(false);
            // Handle place order logic here
          }}
          onPaymentOrder={() => {
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
          tableBill={null}
          tableNumber={tableNumber || ''}
          businessName={businessInfo?.businessName || 'Restaurant'}
          theme={theme}
          onClose={() => setShowBill(false)}
          onPaymentOrder={() => {
            setShowBill(false);
            setShowPayment(true);
          }}
          colors={colors}
        />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          onClose={() => setShowSettings(false)}
          onUpdateSettings={updateSettings}
        />
      )}

      {showFeedback && (
        <FeedbackModal
          orderId="temp"
          tableNumber={tableNumber || ''}
          language={settings?.language || 'en'}
          onClose={() => setShowFeedback(false)}
          onSubmit={(feedback) => {
            console.log('Feedback submitted:', feedback);
            setShowFeedback(false);
          }}
        />
      )}

      {selectedMenuItem && (
        <MenuDetail
          item={selectedMenuItem}
          theme={theme}
          colors={colors}
          onClose={() => setSelectedMenuItem(null)}
          onAddToCart={(item, quantity) => {
            for (let i = 0; i < quantity; i++) {
              addItem(item);
            }
          }}
        />
      )}
    </div>
  );
};