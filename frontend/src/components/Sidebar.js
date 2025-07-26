import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Package, Users, BarChart3, Settings, ShoppingCart, CreditCard, X } from 'lucide-react';
const Sidebar = ({ isOpen, onClose }) => {
    const menuItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/invoices', label: 'Invoices', icon: FileText },
        { path: '/pos', label: 'Point of Sale', icon: CreditCard },
        { path: '/inventory', label: 'Inventory', icon: Package },
        { path: '/customers', label: 'Parties', icon: Users },
        { path: '/reports', label: 'Reports', icon: BarChart3 },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];
    return (_jsxs(_Fragment, { children: [isOpen && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden", onClick: onClose })), _jsxs("div", { className: `fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`, children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center", children: _jsx(ShoppingCart, { className: "w-5 h-5 text-white" }) }), _jsx("h1", { className: "text-xl font-bold text-gradient", children: "Vyapar SaaS" })] }), _jsx("button", { onClick: onClose, className: "lg:hidden p-1 rounded-md hover:bg-gray-100", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx("nav", { className: "mt-6 px-3", children: _jsx("ul", { className: "space-y-1", children: menuItems.map((item) => {
                                const Icon = item.icon;
                                return (_jsx("li", { children: _jsxs(NavLink, { to: item.path, className: ({ isActive }) => `sidebar-link group ${isActive ? 'active' : ''}`, onClick: () => onClose(), children: [_jsx(Icon, { className: "w-5 h-5 mr-3 group-hover:text-primary-600" }), item.label] }) }, item.path));
                            }) }) }), _jsx("div", { className: "absolute bottom-4 left-3 right-3", children: _jsx("div", { className: "glass-effect rounded-lg p-3 text-sm", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Status" }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("div", { className: "w-2 h-2 bg-secondary-500 rounded-full animate-pulse" }), _jsx("span", { className: "text-secondary-600 text-xs", children: "Online" })] })] }) }) })] })] }));
};
export default Sidebar;
