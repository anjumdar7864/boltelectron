import React, { useState, useEffect } from 'react';
import {
  Save,
  Building,
  Printer,
  Palette,
  Shield,
  Bell,
  Globe,
  CreditCard
} from 'lucide-react';
import { BusinessSettings } from '../types';
import dataService from '../services/dataService';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('business');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await dataService.getBusinessSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      await dataService.saveBusinessSettings(settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  const updateSettings = (field: keyof BusinessSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const updatePrinterSettings = (field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      printerSettings: { ...settings.printerSettings, [field]: value }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load settings</p>
      </div>
    );
  }

  const tabs = [
    { key: 'business', label: 'Business Info', icon: Building },
    { key: 'invoice', label: 'Invoice Settings', icon: CreditCard },
    { key: 'printer', label: 'Printer Settings', icon: Printer },
    { key: 'appearance', label: 'Appearance', icon: Palette },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your application preferences</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleSave}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors duration-200 ${
                      activeTab === tab.key
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {/* Business Info */}
            {activeTab === 'business' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Building className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={settings.businessName}
                      onChange={(e) => updateSettings('businessName', e.target.value)}
                      className="input-field"
                      placeholder="Enter business name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Email
                    </label>
                    <input
                      type="email"
                      value={settings.businessEmail}
                      onChange={(e) => updateSettings('businessEmail', e.target.value)}
                      className="input-field"
                      placeholder="business@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Phone
                    </label>
                    <input
                      type="tel"
                      value={settings.businessPhone}
                      onChange={(e) => updateSettings('businessPhone', e.target.value)}
                      className="input-field"
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Number
                    </label>
                    <input
                      type="text"
                      value={settings.gstNumber}
                      onChange={(e) => updateSettings('gstNumber', e.target.value)}
                      className="input-field"
                      placeholder="GST Number (optional)"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address
                    </label>
                    <textarea
                      value={settings.businessAddress}
                      onChange={(e) => updateSettings('businessAddress', e.target.value)}
                      className="input-field"
                      rows={3}
                      placeholder="Enter complete business address"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Invoice Settings */}
            {activeTab === 'invoice' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-medium text-gray-900">Invoice Settings</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Invoice Prefix
                    </label>
                    <input
                      type="text"
                      value={settings.invoicePrefix}
                      onChange={(e) => updateSettings('invoicePrefix', e.target.value)}
                      className="input-field"
                      placeholder="INV"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Next Invoice Number
                    </label>
                    <input
                      type="number"
                      value={settings.invoiceCounter}
                      onChange={(e) => updateSettings('invoiceCounter', parseInt(e.target.value) || 1)}
                      className="input-field"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={settings.taxRate}
                      onChange={(e) => updateSettings('taxRate', parseFloat(e.target.value) || 0)}
                      className="input-field"
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => updateSettings('currency', e.target.value)}
                      className="input-field"
                    >
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="GBP">British Pound (£)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Printer Settings */}
            {activeTab === 'printer' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Printer className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-medium text-gray-900">Printer Settings</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Printer Type
                    </label>
                    <select
                      value={settings.printerSettings.printerType}
                      onChange={(e) => updatePrinterSettings('printerType', e.target.value)}
                      className="input-field"
                    >
                      <option value="regular">Regular Printer</option>
                      <option value="thermal">Thermal Printer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paper Size
                    </label>
                    <select
                      value={settings.printerSettings.paperSize}
                      onChange={(e) => updatePrinterSettings('paperSize', e.target.value)}
                      className="input-field"
                    >
                      {settings.printerSettings.printerType === 'regular' ? (
                        <>
                          <option value="A4">A4</option>
                          <option value="A5">A5</option>
                        </>
                      ) : (
                        <>
                          <option value="2inch">2 inch</option>
                          <option value="3inch">3 inch</option>
                          <option value="4inch">4 inch</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.printerSettings.autoprint}
                        onChange={(e) => updatePrinterSettings('autoprint', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Auto-print invoices after creation</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Palette className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-medium text-gray-900">Appearance</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Choose Theme
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['default', 'modern', 'classic'].map((theme) => (
                      <div
                        key={theme}
                        onClick={() => updateSettings('theme', theme)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-colors duration-200 ${
                          settings.theme === theme
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className={`w-12 h-8 rounded mb-2 mx-auto ${
                            theme === 'default' ? 'bg-primary-500' :
                            theme === 'modern' ? 'bg-gray-800' :
                            'bg-amber-600'
                          }`}></div>
                          <span className="text-sm font-medium capitalize">{theme}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'lowStock', label: 'Low stock alerts', description: 'Get notified when products are running low' },
                    { id: 'newOrder', label: 'New order notifications', description: 'Receive alerts for new customer orders' },
                    { id: 'paymentReminders', label: 'Payment reminders', description: 'Send automated payment reminders to customers' },
                    { id: 'dailyReports', label: 'Daily reports', description: 'Receive daily business summary reports' }
                  ].map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{notification.label}</h4>
                        <p className="text-sm text-gray-500">{notification.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Data Backup</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Enable automatic daily backups</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Backup to cloud storage</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Access Control</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Require password to access app</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Enable fingerprint authentication</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;