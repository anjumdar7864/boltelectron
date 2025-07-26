import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, TrendingDown, DollarSign, FileText, Users, Package } from 'lucide-react';
import dataService from '../services/dataService';
const Reports = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30days');
    const [reportType, setReportType] = useState('overview');
    useEffect(() => {
        loadReportsData();
    }, [dateRange]);
    const loadReportsData = async () => {
        try {
            const data = await dataService.getDashboardData();
            setDashboardData(data);
        }
        catch (error) {
            console.error('Error loading reports data:', error);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" }) }));
    }
    if (!dashboardData) {
        return (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-500", children: "Failed to load reports data" }) }));
    }
    const pieData = dashboardData.topProducts.map((product, index) => ({
        name: product.name,
        value: product.sales,
        color: `hsl(${index * 60}, 70%, 50%)`
    }));
    const COLORS = ['#3b82f6', '#059669', '#f97316', '#8b5cf6', '#ef4444'];
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Reports & Analytics" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Detailed insights into your business performance" })] }), _jsxs("div", { className: "mt-4 sm:mt-0 flex space-x-3", children: [_jsxs("select", { value: dateRange, onChange: (e) => setDateRange(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500", children: [_jsx("option", { value: "7days", children: "Last 7 days" }), _jsx("option", { value: "30days", children: "Last 30 days" }), _jsx("option", { value: "3months", children: "Last 3 months" }), _jsx("option", { value: "1year", children: "Last year" })] }), _jsxs("button", { className: "btn-outline inline-flex items-center space-x-2", children: [_jsx(Download, { className: "w-4 h-4" }), _jsx("span", { children: "Export" })] })] })] }), _jsx("div", { className: "card", children: _jsx("div", { className: "flex space-x-1 p-1 bg-gray-100 rounded-lg", children: [
                        { key: 'overview', label: 'Overview' },
                        { key: 'sales', label: 'Sales' },
                        { key: 'inventory', label: 'Inventory' },
                        { key: 'customers', label: 'Customers' }
                    ].map((tab) => (_jsx("button", { onClick: () => setReportType(tab.key), className: `flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${reportType === tab.key
                            ? 'bg-white text-primary-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'}`, children: tab.label }, tab.key))) }) }), reportType === 'overview' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
                            {
                                title: 'Total Revenue',
                                value: `₹${dashboardData.totalSales.toLocaleString()}`,
                                change: '+12.5%',
                                changeType: 'positive',
                                icon: DollarSign,
                                color: 'text-secondary-600'
                            },
                            {
                                title: 'Total Orders',
                                value: dashboardData.totalInvoices.toLocaleString(),
                                change: '+8.2%',
                                changeType: 'positive',
                                icon: FileText,
                                color: 'text-primary-600'
                            },
                            {
                                title: 'Active Customers',
                                value: dashboardData.totalCustomers.toLocaleString(),
                                change: '+15.3%',
                                changeType: 'positive',
                                icon: Users,
                                color: 'text-accent-600'
                            },
                            {
                                title: 'Products Sold',
                                value: dashboardData.totalProducts.toLocaleString(),
                                change: '+3.1%',
                                changeType: 'positive',
                                icon: Package,
                                color: 'text-purple-600'
                            }
                        ].map((metric, index) => {
                            const Icon = metric.icon;
                            return (_jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: metric.title }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: metric.value }), _jsxs("div", { className: "flex items-center mt-2", children: [metric.changeType === 'positive' ? (_jsx(TrendingUp, { className: "w-4 h-4 text-secondary-500" })) : (_jsx(TrendingDown, { className: "w-4 h-4 text-error-500" })), _jsx("span", { className: `text-sm font-medium ml-1 ${metric.changeType === 'positive' ? 'text-secondary-600' : 'text-error-600'}`, children: metric.change })] })] }), _jsx("div", { className: `w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center ${metric.color}`, children: _jsx(Icon, { className: "w-6 h-6" }) })] }) }, index));
                        }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Sales Trend" }), _jsx("div", { className: "h-80", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: dashboardData.salesChart, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date", tick: { fontSize: 12 }, tickFormatter: (value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }), _jsx(YAxis, { tick: { fontSize: 12 } }), _jsx(Tooltip, { formatter: (value) => [`₹${value.toLocaleString()}`, 'Sales'], labelFormatter: (label) => new Date(label).toLocaleDateString() }), _jsx(Line, { type: "monotone", dataKey: "sales", stroke: "#2563eb", strokeWidth: 2, dot: { fill: '#2563eb', strokeWidth: 2, r: 4 } })] }) }) })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Top Products by Revenue" }), _jsx("div", { className: "h-80", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: pieData, cx: "50%", cy: "50%", outerRadius: 80, fill: "#8884d8", dataKey: "value", label: (entry) => `${entry.name}: ₹${entry.value.toLocaleString()}`, children: pieData.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, { formatter: (value) => [`₹${value.toLocaleString()}`, 'Revenue'] })] }) }) })] })] })] })), reportType === 'sales' && (_jsxs("div", { className: "grid grid-cols-1 gap-6", children: [_jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Sales Performance" }), _jsx("div", { className: "h-96", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: dashboardData.salesChart, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date", tick: { fontSize: 12 }, tickFormatter: (value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }), _jsx(YAxis, { tick: { fontSize: 12 } }), _jsx(Tooltip, { formatter: (value) => [`₹${value.toLocaleString()}`, 'Sales'], labelFormatter: (label) => new Date(label).toLocaleDateString() }), _jsx(Bar, { dataKey: "sales", fill: "#059669", radius: [4, 4, 0, 0] })] }) }) })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Recent Transactions" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Invoice" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Party" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Date" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Amount" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Status" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: dashboardData.recentInvoices.slice(0, 10).map((invoice) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: invoice.invoiceNumber }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: invoice.partyName }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: new Date(invoice.date).toLocaleDateString() }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: ["\u20B9", invoice.total.toLocaleString()] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${invoice.status === 'paid'
                                                                ? 'bg-secondary-100 text-secondary-800'
                                                                : invoice.status === 'sent'
                                                                    ? 'bg-primary-100 text-primary-800'
                                                                    : 'bg-gray-100 text-gray-800'}`, children: invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) }) })] }, invoice.id))) })] }) })] })] })), (reportType === 'inventory' || reportType === 'customers') && (_jsxs("div", { className: "card text-center py-12", children: [_jsxs("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: [reportType.charAt(0).toUpperCase() + reportType.slice(1), " Report"] }), _jsxs("p", { className: "text-gray-500", children: ["This report section is coming soon. Stay tuned for detailed ", reportType, " analytics."] })] }))] }));
};
export default Reports;
