import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { DollarSign, FileText, Users, Package, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import dataService from '../services/dataService';
const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadDashboardData();
    }, []);
    const loadDashboardData = async () => {
        try {
            const data = await dataService.getDashboardData();
            setDashboardData(data);
        }
        catch (error) {
            console.error('Error loading dashboard data:', error);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" }) }));
    }
    if (!dashboardData) {
        return (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-500", children: "Failed to load dashboard data" }) }));
    }
    const stats = [
        {
            title: 'Total Sales',
            value: `₹${dashboardData.totalSales.toLocaleString()}`,
            change: '+12.5%',
            changeType: 'positive',
            icon: DollarSign,
            color: 'text-secondary-600'
        },
        {
            title: 'Total Invoices',
            value: dashboardData.totalInvoices.toLocaleString(),
            change: '+8.2%',
            changeType: 'positive',
            icon: FileText,
            color: 'text-primary-600'
        },
        {
            title: 'Total Parties',
            value: dashboardData.totalParties.toLocaleString(),
            change: '+15.3%',
            changeType: 'positive',
            icon: Users,
            color: 'text-accent-600'
        },
        {
            title: 'Products',
            value: dashboardData.totalProducts.toLocaleString(),
            change: '+3.1%',
            changeType: 'positive',
            icon: Package,
            color: 'text-purple-600'
        }
    ];
    const alerts = [
        {
            title: 'Low Stock Items',
            value: dashboardData.lowStockItems,
            color: 'text-warning-600',
            bgColor: 'bg-warning-50',
            icon: AlertTriangle
        },
        {
            title: 'Outstanding Amount',
            value: `₹${dashboardData.outstandingAmount.toLocaleString()}`,
            color: 'text-error-600',
            bgColor: 'bg-error-50',
            icon: TrendingUp
        }
    ];
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { className: "bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white", children: [_jsx("h1", { className: "text-2xl font-bold mb-2", children: "Welcome back! \uD83D\uDC4B" }), _jsx("p", { className: "text-primary-100", children: "Here's what's happening with your business today." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (_jsx("div", { className: "card hover:shadow-lg transition-all duration-200 animate-slide-up", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: stat.title }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: stat.value }), _jsxs("div", { className: "flex items-center mt-2", children: [stat.changeType === 'positive' ? (_jsx(ArrowUpRight, { className: "w-4 h-4 text-secondary-500" })) : (_jsx(ArrowDownRight, { className: "w-4 h-4 text-error-500" })), _jsx("span", { className: `text-sm font-medium ${stat.changeType === 'positive' ? 'text-secondary-600' : 'text-error-600'}`, children: stat.change })] })] }), _jsx("div", { className: `w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center ${stat.color}`, children: _jsx(Icon, { className: "w-6 h-6" }) })] }) }, index));
                }) }), (dashboardData.lowStockItems > 0 || dashboardData.outstandingAmount > 0) && (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: alerts.map((alert, index) => {
                    const Icon = alert.icon;
                    return (_jsx("div", { className: `${alert.bgColor} rounded-xl p-4 border border-opacity-20`, children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: `w-10 h-10 rounded-lg ${alert.bgColor} flex items-center justify-center`, children: _jsx(Icon, { className: `w-5 h-5 ${alert.color}` }) }), _jsxs("div", { children: [_jsx("h3", { className: `font-semibold ${alert.color}`, children: alert.title }), _jsx("p", { className: "text-lg font-bold text-gray-900", children: alert.value })] })] }) }, index));
                }) })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Sales Overview" }), _jsxs("select", { className: "text-sm border border-gray-300 rounded-md px-3 py-1", children: [_jsx("option", { children: "Last 30 days" }), _jsx("option", { children: "Last 3 months" }), _jsx("option", { children: "Last year" })] })] }), _jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: dashboardData.salesChart, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date", tick: { fontSize: 12 }, tickFormatter: (value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }), _jsx(YAxis, { tick: { fontSize: 12 } }), _jsx(Tooltip, { formatter: (value) => [`₹${value.toLocaleString()}`, 'Sales'], labelFormatter: (label) => new Date(label).toLocaleDateString() }), _jsx(Area, { type: "monotone", dataKey: "sales", stroke: "#2563eb", fill: "url(#colorSales)" }), _jsx("defs", { children: _jsxs("linearGradient", { id: "colorSales", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#2563eb", stopOpacity: 0.8 }), _jsx("stop", { offset: "95%", stopColor: "#2563eb", stopOpacity: 0 })] }) })] }) }) })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Top Products" }), _jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: dashboardData.topProducts, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name", tick: { fontSize: 10 }, angle: -45, textAnchor: "end", height: 60 }), _jsx(YAxis, { tick: { fontSize: 12 } }), _jsx(Tooltip, { formatter: (value) => [`₹${value.toLocaleString()}`, 'Sales'] }), _jsx(Bar, { dataKey: "sales", fill: "#059669", radius: [4, 4, 0, 0] })] }) }) })] })] }), _jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Recent Invoices" }), _jsx("button", { className: "text-primary-600 hover:text-primary-700 text-sm font-medium", children: "View all" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Invoice" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Customer" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Amount" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: dashboardData.recentInvoices.map((invoice) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: invoice.invoiceNumber }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: invoice.customerName }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: new Date(invoice.date).toLocaleDateString() }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: ["\u20B9", invoice.total.toLocaleString()] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${invoice.status === 'paid'
                                                        ? 'bg-secondary-100 text-secondary-800'
                                                        : invoice.status === 'sent'
                                                            ? 'bg-primary-100 text-primary-800'
                                                            : invoice.status === 'overdue'
                                                                ? 'bg-error-100 text-error-800'
                                                                : 'bg-gray-100 text-gray-800'}`, children: invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) }) })] }, invoice.id))) })] }) })] })] }));
};
export default Dashboard;
