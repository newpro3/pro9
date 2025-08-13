import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard } from './components/admin/Dashboard';
import MenuManagement from './components/admin/MenuManagement';
import { OrderManagement } from './components/admin/OrderManagement';
import { BillManagement } from './components/admin/BillManagement';
import { Analytics } from './components/admin/Analytics';
import { Settings } from './components/admin/Settings';
import { MenuPage } from './pages/MenuPage';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/admin" replace />} />
        <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to="/admin" replace />} />
        
        {/* Customer Menu Routes */}
        <Route path="/menu/:userId/table/:tableNumber" element={<MenuPage />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={user ? <AdminLayout /> : <Navigate to="/login" replace />}>
          <Route index element={<Dashboard />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="bills" element={<BillManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* Default Redirects */}
        <Route path="/" element={<Navigate to={user ? "/admin" : "/login"} replace />} />
        <Route path="/table/:tableNumber" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;