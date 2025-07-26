import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, Send, FileText } from 'lucide-react';
import dataService from '../services/dataService';
const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    useEffect(() => {
        loadInvoices();
    }, []);
    const loadInvoices = async () => {
        try {
            const data = await dataService.getInvoices();
            setInvoices(data);
        }
        catch (error) {
            console.error('Error loading invoices:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDeleteInvoice = async (id) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            try {
                await dataService.deleteInvoice(id);
                setInvoices(invoices.filter(inv => inv.id !== id));
            }
            catch (error) {
                console.error('Error deleting invoice:', error);
            }
        }
    };
    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.partyName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-secondary-100 text-secondary-800';
            case 'sent':
                return 'bg-primary-100 text-primary-800';
            case 'overdue':
                return 'bg-error-100 text-error-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" }) }));
    }
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Invoices" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Manage your invoices and billing" })] }), _jsx("div", { className: "mt-4 sm:mt-0", children: _jsxs(Link, { to: "/invoices/create", className: "btn-primary inline-flex items-center space-x-2", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Create Invoice" })] }) })] }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), _jsx("input", { type: "text", placeholder: "Search invoices...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" })] }), _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "sent", children: "Sent" }), _jsx("option", { value: "paid", children: "Paid" }), _jsx("option", { value: "overdue", children: "Overdue" })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("button", { className: "btn-outline inline-flex items-center space-x-2", children: [_jsx(Filter, { className: "w-4 h-4" }), _jsx("span", { children: "Filter" })] }), _jsxs("button", { className: "btn-outline inline-flex items-center space-x-2", children: [_jsx(Download, { className: "w-4 h-4" }), _jsx("span", { children: "Export" })] })] })] }) }), _jsx("div", { className: "card", children: filteredInvoices.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(FileText, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No invoices found" }), _jsx("p", { className: "text-gray-500 mb-6", children: searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your search or filter criteria.'
                                : 'Get started by creating your first invoice.' }), _jsx(Link, { to: "/invoices/create", className: "btn-primary", children: "Create Your First Invoice" })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Invoice #" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Party" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Due Date" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Amount" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredInvoices.map((invoice) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: invoice.invoiceNumber }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: invoice.partyName }), invoice.partyEmail && (_jsx("div", { className: "text-sm text-gray-500", children: invoice.partyEmail }))] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: new Date(invoice.date).toLocaleDateString() }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-' }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: ["\u20B9", invoice.total.toLocaleString()] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`, children: invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { className: "text-primary-600 hover:text-primary-900", title: "View Invoice", children: _jsx(Eye, { className: "w-4 h-4" }) }), _jsx("button", { className: "text-gray-600 hover:text-gray-900", title: "Edit Invoice", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { className: "text-secondary-600 hover:text-secondary-900", title: "Send Invoice", children: _jsx(Send, { className: "w-4 h-4" }) }), _jsx("button", { className: "text-gray-600 hover:text-gray-900", title: "Download PDF", children: _jsx(Download, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDeleteInvoice(invoice.id), className: "text-error-600 hover:text-error-900", title: "Delete Invoice", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, invoice.id))) })] }) })) })] }));
};
export default Invoices;
