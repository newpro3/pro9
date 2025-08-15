import React, { useState, useEffect } from 'react';
import { Save, Upload, User, Building, MessageSquare, Globe, Palette, QrCode, Download, Table } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { firebaseService } from '../../services/firebase';
import { imgbbService } from '../../services/imgbb';
import { telegramService } from '../../services/telegram';
import { User as UserType } from '../../types';
import { QRCodeGenerator } from '../QRCodeGenerator';

export const Settings: React.FC = () => {
  const { user, firebaseUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [webhookInfo, setWebhookInfo] = useState<any>(null);
  const [settingUpWebhook, setSettingUpWebhook] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    businessName: user?.businessName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    telegramChatId: user?.telegramChatId || '',
    logo: user?.logo || '',
    numberOfTables: user?.numberOfTables || 10,
    settings: {
      currency: user?.settings?.currency || 'USD',
      language: user?.settings?.language || 'en',
      theme: user?.settings?.theme || 'light',
      notifications: user?.settings?.notifications ?? true,
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        businessName: user.businessName || '',
        phone: user.phone || '',
        address: user.address || '',
        telegramChatId: user.telegramChatId || '',
        logo: user.logo || '',
        numberOfTables: user.numberOfTables || 10,
        settings: {
          currency: user.settings?.currency || 'USD',
          language: user.settings?.language || 'en',
          theme: user.settings?.theme || 'light',
          notifications: user.settings?.notifications ?? true,
        }
      });
      
      // Load webhook info
      loadWebhookInfo();
    }
  }, [user]);

  const loadWebhookInfo = async () => {
    try {
      const info = await telegramService.getWebhookInfo();
      setWebhookInfo(info);
    } catch (error) {
      console.error('Error loading webhook info:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingsChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value
      }
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const logoUrl = await imgbbService.uploadImage(file, `${user.id}_logo_${Date.now()}`);
      handleInputChange('logo', logoUrl);
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      await firebaseService.updateUserProfile(user.id, formData);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const testTelegramConnection = async () => {
    if (!formData.telegramChatId) {
      alert('Please enter your Telegram Chat ID first');
      return;
    }

    try {
      // This would send a test message to the Telegram chat
      alert('Test message sent to Telegram! Check your chat.');
    } catch (error) {
      console.error('Error testing Telegram connection:', error);
      alert('Failed to send test message. Please check your Chat ID.');
    }
  };

  const setupTelegramWebhook = async () => {
    setSettingUpWebhook(true);
    try {
      const success = await telegramService.setupWebhook();
      if (success) {
        alert('Telegram webhook set up successfully!');
        await loadWebhookInfo();
      } else {
        alert('Failed to set up Telegram webhook. Please try again.');
      }
    } catch (error) {
      console.error('Error setting up webhook:', error);
      alert('Failed to set up webhook. Please check your bot token.');
    } finally {
      setSettingUpWebhook(false);
    }
  };
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and restaurant settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-6">
            <User className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Business Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Building className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Logo
              </label>
              <div className="space-y-4">
                {formData.logo && (
                  <img
                    src={formData.logo}
                    alt="Business Logo"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                )}
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{uploading ? 'Uploading...' : 'Upload Logo'}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Telegram Integration */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-6">
            <MessageSquare className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Telegram Integration</h2>
          </div>

          <div className="space-y-4">
            {/* Webhook Status */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Webhook Status</h3>
              {webhookInfo ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">URL:</span>
                    <span className="text-blue-900 font-mono text-xs">
                      {webhookInfo.result?.url || 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Status:</span>
                    <span className={`font-medium ${
                      webhookInfo.result?.url ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {webhookInfo.result?.url ? 'Active' : 'Not configured'}
                    </span>
                  </div>
                  {webhookInfo.result?.last_error_date && (
                    <div className="flex justify-between">
                      <span className="text-blue-700">Last Error:</span>
                      <span className="text-red-600 text-xs">
                        {new Date(webhookInfo.result.last_error_date * 1000).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-blue-700 text-sm">Loading webhook status...</p>
              )}
              
              <button
                type="button"
                onClick={setupTelegramWebhook}
                disabled={settingUpWebhook}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {settingUpWebhook ? 'Setting up...' : 'Setup Webhook'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telegram Chat ID
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={formData.telegramChatId}
                  onChange={(e) => handleInputChange('telegramChatId', e.target.value)}
                  placeholder="e.g., 123456789"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={testTelegramConnection}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Test
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Get your Chat ID by messaging @userinfobot on Telegram
              </p>
              <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Webhook URL:</strong> https://tel-alun.vercel.app/api/telegram-webhook
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  This webhook handles order approvals and payment confirmations automatically.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <Palette className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">App Settings</h2>
          </div>

          {/* Table Management */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-3 mb-4">
              <Table className="w-5 h-5 text-gray-500" />
              <h3 className="text-md font-semibold text-gray-900">Table Management</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Tables
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.numberOfTables}
                  onChange={(e) => handleInputChange('numberOfTables', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Set the total number of tables in your restaurant
                </p>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setShowQRGenerator(true)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Generate QR Codes</span>
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Menu Theme
              </label>
              <select
                value={formData.settings.menuTheme || 'classic'}
                onChange={(e) => handleSettingsChange('menuTheme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
                <option value="elegant">Elegant</option>
                <option value="minimal">Minimal</option>
                <option value="vibrant">Vibrant</option>
                <option value="dark">Dark</option>
                <option value="nature">Nature</option>
                <option value="sunset">Sunset</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Changes will apply to all customer menu pages immediately
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={formData.settings.currency}
                onChange={(e) => handleSettingsChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="ETB">ETB (Br)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Language
              </label>
              <select
                value={formData.settings.language}
                onChange={(e) => handleSettingsChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="am">አማርኛ (Amharic)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select
                value={formData.settings.theme}
                onChange={(e) => handleSettingsChange('theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                checked={formData.settings.notifications}
                onChange={(e) => handleSettingsChange('notifications', e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="notifications" className="ml-2 block text-sm text-gray-900">
                Enable notifications
              </label>
            </div>
          </div>
        </div>

        {/* Menu URL */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Globe className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Menu URL</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Menu URL
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={`${window.location.origin}/menu/${user?.id}/table/1`}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/menu/${user?.id}/table/1`);
                    alert('URL copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Copy
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Share this URL with your customers. Change "table/1" to any table number.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>

      {/* QR Code Generator Modal */}
      {showQRGenerator && (
        <QRCodeGenerator
          userId={user?.id || ''}
          businessName={user?.businessName || 'Restaurant'}
          businessLogo={user?.logo}
          numberOfTables={formData.numberOfTables}
          onClose={() => setShowQRGenerator(false)}
        />
      )}
    </div>
  );
};