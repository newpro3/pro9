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
import { Utensils, MapPin, Clock, Star, Flame, ChefHat } from 'lucide-react';

export const MenuPage: React.FC = () => {
  const { userId, tableNumber } = useParams<{ userId: string; tableNumber: string }>();
  const { theme, colors, loading: themeLoading } = useMenuTheme(userId || '');
  const { settings, updateSettings } = useSettings();
  const { items: cartItems, addItem, updateQuantity, removeItem, clearCart, getTotalAmount } = useCart();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [businessInfo, setBusinessInfo] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('home');
  
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

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  // Get today's special items (highest popularity score)
  const todaysSpecials = menuItems
    .filter(item => item.available && item.popularity_score > 85)
    .sort((a, b) => b.popularity_score - a.popularity_score)
    .slice(0, 3);

  // Get new dishes (recently added items)
  const newDishes = menuItems
    .filter(item => item.available)
    .sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime())
    .slice(0, 4);

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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {businessInfo?.logo ? (
                <img 
                  src={businessInfo.logo} 
                  alt={businessInfo.businessName}
                  className="w-16 h-16 rounded-full object-cover border-3 border-white border-opacity-30 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center shadow-lg">
                  <Utensils className="w-8 h-8" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold mb-1">
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
                <div className="mt-2">
                  <span className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    {settings?.orderType === 'dine-in' ? 'Dine In' : 'Takeaway'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90 mb-1">Welcome!</div>
              <div className="text-xs opacity-75">Scan • Order • Enjoy</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 pb-24">
        {/* Today's Special Section */}
        {todaysSpecials.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-full" style={{ backgroundColor: colors.primary }}>
                <Flame className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                Today's Special
              </h2>
            </div>
            <div className="overflow-x-auto">
              <div className="flex space-x-4 pb-2">
                {todaysSpecials.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex-shrink-0 w-80 rounded-3xl overflow-hidden shadow-xl relative cursor-pointer transform transition-all duration-300 hover:scale-105"
                    style={{ 
                      backgroundColor: colors.cardBackground,
                      border: `2px solid ${colors.primary}20`
                    }}
                    onClick={() => setSelectedMenuItem(item)}
                  >
                    <div className="relative h-48">
                      <img
                        src={item.photo || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Special</span>
                      </div>
                      <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                        <span className="text-yellow-500">⭐</span>
                        <span>{item.popularity_score}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addItem(item);
                        }}
                        className="absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl transform transition-all duration-300 hover:scale-110 shadow-2xl"
                        style={{ backgroundColor: colors.primary }}
                      >
                        +
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2" style={{ color: colors.text }}>
                        {item.name}
                      </h3>
                      <p className="text-sm mb-3 opacity-80 line-clamp-2" style={{ color: colors.textSecondary }}>
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black" style={{ color: colors.primary }}>
                          ${item.price.toFixed(2)}
                        </span>
                        {item.preparation_time > 0 && (
                          <div className="flex items-center text-xs" style={{ color: colors.textSecondary }}>
                            <Clock className="w-3 h-3 mr-1" />
                            {item.preparation_time}min
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* New Dishes Section */}
        {newDishes.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-full" style={{ backgroundColor: colors.accent }}>
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold" style={{ color: colors.text }}>
                New Dishes
              </h2>
              <span 
                className="text-sm px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: colors.accent + '20',
                  color: colors.accent
                }}
              >
                {newDishes.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {newDishes.map((item) => (
                <div 
                  key={item.id}
                  className="rounded-2xl overflow-hidden shadow-lg relative cursor-pointer transform transition-all duration-300 hover:scale-105"
                  style={{ 
                    backgroundColor: colors.cardBackground,
                    border: `1px solid ${colors.cardBorder}`
                  }}
                  onClick={() => setSelectedMenuItem(item)}
                >
                  <div className="relative h-32">
                    <img
                      src={item.photo || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      New
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem(item);
                      }}
                      className="absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold transform transition-all duration-300 hover:scale-110 shadow-lg"
                      style={{ backgroundColor: colors.primary }}
                    >
                      +
                    </button>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1" style={{ color: colors.text }}>
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold" style={{ color: colors.primary }}>
                        ${item.price.toFixed(2)}
                      </span>
                      {item.preparation_time > 0 && (
                        <span className="text-xs" style={{ color: colors.textSecondary }}>
                          {item.preparation_time}min
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          activeCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          theme={theme}
          colors={colors}
        />

        {/* Menu Items Grid */}
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