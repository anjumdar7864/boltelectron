import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Save, Building, Printer, Palette, Shield, Bell, CreditCard } from 'lucide-react';
import dataService from '../services/dataService';
const Settings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('business');
    useEffect(() => {
        loadSettings();
    }, []);
    const loadSettings = async () => {
        try {
            const data = await dataService.getBusinessSettings();
            setSettings(data);
        }
        catch (error) {
            console.error('Error loading settings:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSave = async () => {
        if (!settings)
            return;
        try {
            await dataService.saveBusinessSettings(settings);
            alert('Settings saved successfully!');
        }
        catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        }
    };
    const updateSettings = (field, value) => {
        if (!settings)
            return;
        setSettings({ ...settings, [field]: value });
    };
    const updatePrinterSettings = (field, value) => {
        if (!settings)
            return;
        setSettings({
            ...settings,
            printerSettings: { ...settings.printerSettings, [field]: value }
        });
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" }) }));
    }
    if (!settings) {
        return (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-500", children: "Failed to load settings" }) }));
    }
    const tabs = [
        { key: 'business', label: 'Business Info', icon: Building },
        { key: 'invoice', label: 'Invoice Settings', icon: CreditCard },
        { key: 'printer', label: 'Printer Settings', icon: Printer },
        { key: 'appearance', label: 'Appearance', icon: Palette },
        { key: 'notifications', label: 'Notifications', icon: Bell },
        { key: 'security', label: 'Security', icon: Shield }
    ];
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Settings" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Manage your application preferences" })] }), _jsx("div", { className: "mt-4 sm:mt-0", children: _jsxs("button", { onClick: handleSave, className: "btn-primary inline-flex items-center space-x-2", children: [_jsx(Save, { className: "w-4 h-4" }), _jsx("span", { children: "Save Changes" })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [_jsx("div", { className: "lg:col-span-1", children: _jsx("div", { className: "card", children: _jsx("nav", { className: "space-y-1", children: tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (_jsxs("button", { onClick: () => setActiveTab(tab.key), className: `w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors duration-200 ${activeTab === tab.key
                                            ? 'bg-primary-50 text-primary-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`, children: [_jsx(Icon, { className: "w-4 h-4" }), _jsx("span", { children: tab.label })] }, tab.key));
                                }) }) }) }), _jsx("div", { className: "lg:col-span-3", children: _jsxs("div", { className: "card", children: [activeTab === 'business' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-6", children: [_jsx(Building, { className: "w-5 h-5 text-gray-600" }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Business Information" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Business Name" }), _jsx("input", { type: "text", value: settings.businessName, onChange: (e) => updateSettings('businessName', e.target.value), className: "input-field", placeholder: "Enter business name" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Business Email" }), _jsx("input", { type: "email", value: settings.businessEmail, onChange: (e) => updateSettings('businessEmail', e.target.value), className: "input-field", placeholder: "business@example.com" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Business Phone" }), _jsx("input", { type: "tel", value: settings.businessPhone, onChange: (e) => updateSettings('businessPhone', e.target.value), className: "input-field", placeholder: "+91 9876543210" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "GST Number" }), _jsx("input", { type: "text", value: settings.gstNumber, onChange: (e) => updateSettings('gstNumber', e.target.value), className: "input-field", placeholder: "GST Number (optional)" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Business Address" }), _jsx("textarea", { value: settings.businessAddress, onChange: (e) => updateSettings('businessAddress', e.target.value), className: "input-field", rows: 3, placeholder: "Enter complete business address" })] })] })] })), activeTab === 'invoice' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-6", children: [_jsx(CreditCard, { className: "w-5 h-5 text-gray-600" }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Invoice Settings" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Invoice Prefix" }), _jsx("input", { type: "text", value: settings.invoicePrefix, onChange: (e) => updateSettings('invoicePrefix', e.target.value), className: "input-field", placeholder: "INV" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Next Invoice Number" }), _jsx("input", { type: "number", value: settings.invoiceCounter, onChange: (e) => updateSettings('invoiceCounter', parseInt(e.target.value) || 1), className: "input-field", min: "1" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Default Tax Rate (%)" }), _jsx("input", { type: "number", value: settings.taxRate, onChange: (e) => updateSettings('taxRate', parseFloat(e.target.value) || 0), className: "input-field", min: "0", step: "0.1" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Currency" }), _jsxs("select", { value: settings.currency, onChange: (e) => updateSettings('currency', e.target.value), className: "input-field", children: [_jsx("option", { value: "INR", children: "Indian Rupee (\u20B9)" }), _jsx("option", { value: "USD", children: "US Dollar ($)" }), _jsx("option", { value: "EUR", children: "Euro (\u20AC)" }), _jsx("option", { value: "GBP", children: "British Pound (\u00A3)" })] })] })] })] })), activeTab === 'printer' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-6", children: [_jsx(Printer, { className: "w-5 h-5 text-gray-600" }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Printer Settings" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Printer Type" }), _jsxs("select", { value: settings.printerSettings.printerType, onChange: (e) => updatePrinterSettings('printerType', e.target.value), className: "input-field", children: [_jsx("option", { value: "regular", children: "Regular Printer" }), _jsx("option", { value: "thermal", children: "Thermal Printer" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Paper Size" }), _jsx("select", { value: settings.printerSettings.paperSize, onChange: (e) => updatePrinterSettings('paperSize', e.target.value), className: "input-field", children: settings.printerSettings.printerType === 'regular' ? (_jsxs(_Fragment, { children: [_jsx("option", { value: "A4", children: "A4" }), _jsx("option", { value: "A5", children: "A5" })] })) : (_jsxs(_Fragment, { children: [_jsx("option", { value: "2inch", children: "2 inch" }), _jsx("option", { value: "3inch", children: "3 inch" }), _jsx("option", { value: "4inch", children: "4 inch" })] })) })] }), _jsx("div", { className: "md:col-span-2", children: _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: settings.printerSettings.autoprint, onChange: (e) => updatePrinterSettings('autoprint', e.target.checked), className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500" }), _jsx("span", { className: "ml-2 text-sm text-gray-700", children: "Auto-print invoices after creation" })] }) })] })] })), activeTab === 'appearance' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-6", children: [_jsx(Palette, { className: "w-5 h-5 text-gray-600" }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Appearance" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-4", children: "Choose Theme" }), _jsx("div", { className: "grid grid-cols-3 gap-4", children: ['default', 'modern', 'classic'].map((theme) => (_jsx("div", { onClick: () => updateSettings('theme', theme), className: `p-4 rounded-lg border-2 cursor-pointer transition-colors duration-200 ${settings.theme === theme
                                                            ? 'border-primary-500 bg-primary-50'
                                                            : 'border-gray-200 hover:border-gray-300'}`, children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: `w-12 h-8 rounded mb-2 mx-auto ${theme === 'default' ? 'bg-primary-500' :
                                                                        theme === 'modern' ? 'bg-gray-800' :
                                                                            'bg-amber-600'}` }), _jsx("span", { className: "text-sm font-medium capitalize", children: theme })] }) }, theme))) })] })] })), activeTab === 'notifications' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-6", children: [_jsx(Bell, { className: "w-5 h-5 text-gray-600" }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Notification Preferences" })] }), _jsx("div", { className: "space-y-4", children: [
                                                { id: 'lowStock', label: 'Low stock alerts', description: 'Get notified when products are running low' },
                                                { id: 'newOrder', label: 'New order notifications', description: 'Receive alerts for new customer orders' },
                                                { id: 'paymentReminders', label: 'Payment reminders', description: 'Send automated payment reminders to customers' },
                                                { id: 'dailyReports', label: 'Daily reports', description: 'Receive daily business summary reports' }
                                            ].map((notification) => (_jsxs("div", { className: "flex items-start space-x-3 p-4 bg-gray-50 rounded-lg", children: [_jsx("input", { type: "checkbox", defaultChecked: true, className: "mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500" }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900", children: notification.label }), _jsx("p", { className: "text-sm text-gray-500", children: notification.description })] })] }, notification.id))) })] })), activeTab === 'security' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-6", children: [_jsx(Shield, { className: "w-5 h-5 text-gray-600" }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Security Settings" })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 mb-4", children: "Data Backup" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", defaultChecked: true, className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500" }), _jsx("span", { className: "ml-2 text-sm text-gray-700", children: "Enable automatic daily backups" })] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500" }), _jsx("span", { className: "ml-2 text-sm text-gray-700", children: "Backup to cloud storage" })] })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 mb-4", children: "Access Control" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500" }), _jsx("span", { className: "ml-2 text-sm text-gray-700", children: "Require password to access app" })] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500" }), _jsx("span", { className: "ml-2 text-sm text-gray-700", children: "Enable fingerprint authentication" })] })] })] })] })] }))] }) })] })] }));
};
export default Settings;
