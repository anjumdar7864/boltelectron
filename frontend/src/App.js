import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import POS from './pages/POS';
import { useElectronAPI } from './hooks/useElectronAPI';
function App() {
    const { electronAPI } = useElectronAPI();
    useEffect(() => {
        if (electronAPI) {
            electronAPI.onMenuAction((action) => {
                // Handle menu actions from Electron
                console.log('Menu action received:', action);
                // You can navigate programmatically here based on the action
            });
            return () => {
                electronAPI.removeAllListeners('menu-action');
            };
        }
    }, [electronAPI]);
    return (_jsx(Router, { children: _jsx("div", { className: "min-h-screen bg-gray-50", children: _jsx(Routes, { children: _jsxs(Route, { path: "/", element: _jsx(Layout, {}), children: [_jsx(Route, { index: true, element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "invoices", element: _jsx(Invoices, {}) }), _jsx(Route, { path: "invoices/create", element: _jsx(CreateInvoice, {}) }), _jsx(Route, { path: "inventory", element: _jsx(Inventory, {}) }), _jsx(Route, { path: "customers", element: _jsx(Customers, {}) }), _jsx(Route, { path: "reports", element: _jsx(Reports, {}) }), _jsx(Route, { path: "pos", element: _jsx(POS, {}) }), _jsx(Route, { path: "settings", element: _jsx(Settings, {}) })] }) }) }) }));
}
export default App;
