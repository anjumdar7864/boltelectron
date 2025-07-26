import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Edit, Trash2, Users, Phone, Mail, MapPin } from 'lucide-react';
import dataService from '../services/dataService';
const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        loadCustomers();
    }, []);
    const loadCustomers = async () => {
        try {
            const data = await dataService.getCustomers();
            setCustomers(data);
        }
        catch (error) {
            console.error('Error loading customers:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDeleteCustomer = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await dataService.deleteCustomer(id);
                setCustomers(customers.filter(cust => cust.id !== id));
            }
            catch (error) {
                console.error('Error deleting customer:', error);
            }
        }
    };
    const filteredCustomers = customers.filter(customer => {
        return customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    });
    const totalCustomers = customers.length;
    const totalPurchases = customers.reduce((sum, c) => sum + c.totalPurchases, 0);
    const totalOutstanding = customers.reduce((sum, c) => sum + c.outstandingAmount, 0);
    const activeCustomers = customers.filter(c => c.isActive).length;
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" }) }));
    }
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Customer Management" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Manage your customer relationships" })] }), _jsx("div", { className: "mt-4 sm:mt-0", children: _jsxs("button", { className: "btn-primary inline-flex items-center space-x-2", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Add Customer" })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Customers" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: totalCustomers })] }), _jsx("div", { className: "w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center", children: _jsx(Users, { className: "w-6 h-6 text-primary-600" }) })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Active Customers" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: activeCustomers })] }), _jsx("div", { className: "w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center", children: _jsx(Users, { className: "w-6 h-6 text-secondary-600" }) })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Purchases" }), _jsxs("p", { className: "text-2xl font-bold text-gray-900", children: ["\u20B9", totalPurchases.toLocaleString()] })] }), _jsx("div", { className: "w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center", children: _jsx(Users, { className: "w-6 h-6 text-accent-600" }) })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Outstanding" }), _jsxs("p", { className: "text-2xl font-bold text-gray-900", children: ["\u20B9", totalOutstanding.toLocaleString()] })] }), _jsx("div", { className: "w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center", children: _jsx(Users, { className: "w-6 h-6 text-warning-600" }) })] }) })] }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0", children: [_jsx("div", { className: "flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), _jsx("input", { type: "text", placeholder: "Search customers...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" })] }) }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("button", { className: "btn-outline inline-flex items-center space-x-2", children: [_jsx(Filter, { className: "w-4 h-4" }), _jsx("span", { children: "Filter" })] }), _jsxs("button", { className: "btn-outline inline-flex items-center space-x-2", children: [_jsx(Download, { className: "w-4 h-4" }), _jsx("span", { children: "Export" })] })] })] }) }), _jsx("div", { className: "card", children: filteredCustomers.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Users, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No customers found" }), _jsx("p", { className: "text-gray-500 mb-6", children: searchTerm
                                ? 'Try adjusting your search criteria.'
                                : 'Get started by adding your first customer.' }), _jsx("button", { className: "btn-primary", children: "Add Your First Customer" })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Customer" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Contact" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Total Purchases" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Outstanding" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Last Purchase" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredCustomers.map((customer) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3", children: _jsx("span", { className: "text-sm font-medium text-primary-700", children: customer.name.charAt(0).toUpperCase() }) }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: customer.name }), customer.gstNumber && (_jsxs("div", { className: "text-sm text-gray-500", children: ["GST: ", customer.gstNumber] }))] })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "space-y-1", children: [customer.email && (_jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [_jsx(Mail, { className: "w-3 h-3 mr-1" }), customer.email] })), customer.phone && (_jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [_jsx(Phone, { className: "w-3 h-3 mr-1" }), customer.phone] })), customer.address && (_jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [_jsx(MapPin, { className: "w-3 h-3 mr-1" }), customer.address.substring(0, 30), "..."] }))] }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: ["\u20B9", customer.totalPurchases.toLocaleString()] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: ["\u20B9", customer.outstandingAmount.toLocaleString()] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: customer.lastPurchaseDate
                                                ? new Date(customer.lastPurchaseDate).toLocaleDateString()
                                                : 'Never' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${customer.isActive
                                                    ? 'bg-secondary-100 text-secondary-800'
                                                    : 'bg-gray-100 text-gray-800'}`, children: customer.isActive ? 'Active' : 'Inactive' }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { className: "text-primary-600 hover:text-primary-900", title: "Edit Customer", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDeleteCustomer(customer.id), className: "text-error-600 hover:text-error-900", title: "Delete Customer", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, customer.id))) })] }) })) })] }));
};
export default Customers;
