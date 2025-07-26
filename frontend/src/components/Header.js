import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Menu, Bell, Search, FolderSync as Sync, Wifi, WifiOff } from 'lucide-react';
import { useElectronAPI } from '../hooks/useElectronAPI';
import dataService from '../services/dataService';
const Header = ({ onMenuClick }) => {
    const { electronAPI } = useElectronAPI();
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSync, setLastSync] = useState(null);
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    const handleSync = async () => {
        if (!isOnline)
            return;
        setIsSyncing(true);
        try {
            const success = await dataService.syncData();
            if (success) {
                setLastSync(new Date());
            }
        }
        catch (error) {
            console.error('Sync failed:', error);
        }
        finally {
            setIsSyncing(false);
        }
    };
    const formatLastSync = (date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1)
            return 'Just now';
        if (minutes < 60)
            return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24)
            return `${hours}h ago`;
        return date.toLocaleDateString();
    };
    return (_jsx("header", { className: "bg-white shadow-sm border-b border-gray-200 px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("button", { onClick: onMenuClick, className: "lg:hidden p-2 rounded-md hover:bg-gray-100", children: _jsx(Menu, { className: "w-5 h-5" }) }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), _jsx("input", { type: "text", placeholder: "Search invoices, customers, products...", className: "pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" })] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("button", { onClick: handleSync, disabled: !isOnline || isSyncing, className: "flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50", title: isOnline ? 'Sync data' : 'Offline - Cannot sync', children: [_jsx(Sync, { className: `w-4 h-4 ${isSyncing ? 'animate-spin' : ''}` }), _jsx("span", { children: isSyncing ? 'Syncing...' : 'Sync' })] }), _jsx("div", { className: "flex items-center space-x-2", children: isOnline ? (_jsxs("div", { className: "flex items-center space-x-1 text-secondary-600", children: [_jsx(Wifi, { className: "w-4 h-4" }), _jsx("span", { className: "text-xs", children: "Online" })] })) : (_jsxs("div", { className: "flex items-center space-x-1 text-warning-600", children: [_jsx(WifiOff, { className: "w-4 h-4" }), _jsx("span", { className: "text-xs", children: "Offline" })] })) }), lastSync && (_jsxs("div", { className: "text-xs text-gray-500", children: ["Last sync: ", formatLastSync(lastSync)] })), _jsxs("button", { className: "relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg", children: [_jsx(Bell, { className: "w-5 h-5" }), _jsx("span", { className: "absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-sm font-medium text-primary-700", children: "MB" }) }), _jsxs("div", { className: "hidden md:block", children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: "My Business" }), _jsx("div", { className: "text-xs text-gray-500", children: "Administrator" })] })] })] })] }) }));
};
export default Header;
