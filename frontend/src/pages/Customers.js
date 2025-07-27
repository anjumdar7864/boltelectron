import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Edit, Trash2, Users, Phone, Mail, MapPin, X, Settings } from 'lucide-react';
import dataService from '../services/dataService';
const AddPartyModal = ({ isOpen, onClose, onSave }) => {
    const [activeTab, setActiveTab] = useState('gst');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        gstNumber: '',
        gstType: 'unregistered',
        state: '',
        email: '',
        billingAddress: '',
        shippingAddress: '',
        enableShippingAddress: false,
        isActive: true,
        creditLimit: undefined,
        openingBalance: 0,
        asOfDate: ''
    });
    const [noCreditLimit, setNoCreditLimit] = useState(true);
    const handleSubmit = (saveAndNew = false) => {
        const newParty = {
            ...formData,
            creditLimit: noCreditLimit ? undefined : formData.creditLimit,
            id: Date.now().toString(),
            outstandingAmount: 0,
            totalPurchases: 0,
            loyaltyPoints: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        onSave(newParty);
        if (saveAndNew) {
            setFormData({
                name: '',
                phone: '',
                gstNumber: '',
                gstType: 'unregistered',
                state: '',
                email: '',
                billingAddress: '',
                shippingAddress: '',
                enableShippingAddress: false,
                isActive: true,
                creditLimit: undefined,
                openingBalance: 0,
                asOfDate: ''
            });
            setNoCreditLimit(true);
        }
        else {
            onClose();
        }
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Add Party" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { className: "p-2 hover:bg-gray-100 rounded-lg", children: _jsx(Settings, { className: "w-5 h-5 text-gray-500" }) }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-gray-100 rounded-lg", children: _jsx(X, { className: "w-5 h-5 text-gray-500" }) })] })] }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [_jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Party Name *" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData(prev => ({ ...prev, name: e.target.value })), className: "w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Enter party name" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Phone Number" }), _jsx("input", { type: "tel", value: formData.phone, onChange: (e) => setFormData(prev => ({ ...prev, phone: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Phone Number" })] })] }), _jsx("div", { className: "border-b border-gray-200 mb-6", children: _jsx("nav", { className: "flex space-x-8", children: [
                                    { key: 'gst', label: 'GST & Address' },
                                    { key: 'credit', label: 'Credit & Balance' },
                                    { key: 'additional', label: 'Additional Fields' }
                                ].map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab.key), className: `py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.key
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: tab.label }, tab.key))) }) }), activeTab === 'gst' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "GST Type" }), _jsxs("select", { value: formData.gstType, onChange: (e) => setFormData(prev => ({ ...prev, gstType: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: [_jsx("option", { value: "unregistered", children: "Unregistered/Consumer" }), _jsx("option", { value: "registered", children: "Registered Business" }), _jsx("option", { value: "consumer", children: "Consumer" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "State" }), _jsxs("select", { value: formData.state, onChange: (e) => setFormData(prev => ({ ...prev, state: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: [_jsx("option", { value: "", children: "Select State" }), _jsx("option", { value: "maharashtra", children: "Maharashtra" }), _jsx("option", { value: "gujarat", children: "Gujarat" }), _jsx("option", { value: "karnataka", children: "Karnataka" }), _jsx("option", { value: "delhi", children: "Delhi" }), _jsx("option", { value: "tamil-nadu", children: "Tamil Nadu" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email ID" }), _jsx("input", { type: "email", value: formData.email, onChange: (e) => setFormData(prev => ({ ...prev, email: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Email ID" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Billing Address" }), _jsx("textarea", { value: formData.billingAddress, onChange: (e) => setFormData(prev => ({ ...prev, billingAddress: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", rows: 3, placeholder: "Billing Address" })] }), _jsx("div", { children: _jsxs("label", { className: "flex items-center text-sm text-blue-600 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: formData.enableShippingAddress, onChange: (e) => setFormData(prev => ({ ...prev, enableShippingAddress: e.target.checked })), className: "mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" }), "+ Enable Shipping Address"] }) }), formData.enableShippingAddress && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Shipping Address" }), _jsx("textarea", { value: formData.shippingAddress, onChange: (e) => setFormData(prev => ({ ...prev, shippingAddress: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", rows: 3, placeholder: "Shipping Address" })] }))] })), activeTab === 'credit' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Opening Balance" }), _jsx("input", { type: "number", value: formData.openingBalance || '', onChange: (e) => setFormData(prev => ({ ...prev, openingBalance: parseFloat(e.target.value) || 0 })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Opening Balance" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "As of Date" }), _jsx("input", { type: "date", value: formData.asOfDate || '', onChange: (e) => setFormData(prev => ({ ...prev, asOfDate: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "flex items-center text-sm text-gray-700", children: [_jsx("input", { type: "checkbox", checked: noCreditLimit, onChange: (e) => setNoCreditLimit(e.target.checked), className: "mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" }), "Credit Limit (No Limit)"] }), !noCreditLimit && (_jsx("input", { type: "number", value: formData.creditLimit || '', onChange: (e) => setFormData(prev => ({ ...prev, creditLimit: parseFloat(e.target.value) || 0 })), className: "mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Credit Limit" }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "GST Number" }), _jsx("input", { type: "text", value: formData.gstNumber, onChange: (e) => setFormData(prev => ({ ...prev, gstNumber: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "GST Number (optional)" })] })] })), activeTab === 'additional' && (_jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx("p", { children: "Additional fields can be configured here" }), _jsx("p", { className: "text-sm", children: "Custom fields, tags, and other metadata" })] }) }))] }), _jsxs("div", { className: "flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50", children: [_jsx("button", { onClick: () => handleSubmit(true), className: "px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-medium", children: "Save & New" }), _jsx("button", { onClick: () => handleSubmit(false), className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium", children: "Save" })] })] }) }));
};
const Parties = () => {
    const [parties, setParties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    useEffect(() => {
        loadParties();
    }, []);
    const loadParties = async () => {
        try {
            const data = await dataService.getParties();
            setParties(data);
        }
        catch (error) {
            console.error('Error loading parties:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDeleteParty = async (id) => {
        if (window.confirm('Are you sure you want to delete this party?')) {
            try {
                await dataService.deleteParty(id);
                setParties(parties.filter(party => party.id !== id));
            }
            catch (error) {
                console.error('Error deleting party:', error);
            }
        }
    };
    const handleSaveParty = async (partyData) => {
        try {
            await dataService.saveParty(partyData);
            await loadParties();
        }
        catch (error) {
            console.error('Error saving party:', error);
        }
    };
    const filteredParties = parties.filter(party => {
        return party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (party.email && party.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (party.phone && party.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    });
    const totalParties = parties.length;
    const totalPurchases = parties.reduce((sum, p) => sum + p.totalPurchases, 0);
    const totalOutstanding = parties.reduce((sum, p) => sum + p.outstandingAmount, 0);
    const activeParties = parties.filter(p => p.isActive).length;
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" }) }));
    }
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Party Management" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Manage your party relationships" })] }), _jsx("div", { className: "mt-4 sm:mt-0", children: _jsxs("button", { onClick: () => setShowAddModal(true), className: "btn-primary inline-flex items-center space-x-2", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Add Party" })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Parties" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: totalParties })] }), _jsx("div", { className: "w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center", children: _jsx(Users, { className: "w-6 h-6 text-primary-600" }) })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Active Parties" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: activeParties })] }), _jsx("div", { className: "w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center", children: _jsx(Users, { className: "w-6 h-6 text-secondary-600" }) })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Purchases" }), _jsxs("p", { className: "text-2xl font-bold text-gray-900", children: ["\u20B9", totalPurchases.toLocaleString()] })] }), _jsx("div", { className: "w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center", children: _jsx(Users, { className: "w-6 h-6 text-accent-600" }) })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Outstanding" }), _jsxs("p", { className: "text-2xl font-bold text-gray-900", children: ["\u20B9", totalOutstanding.toLocaleString()] })] }), _jsx("div", { className: "w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center", children: _jsx(Users, { className: "w-6 h-6 text-warning-600" }) })] }) })] }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0", children: [_jsx("div", { className: "flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), _jsx("input", { type: "text", placeholder: "Search parties...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" })] }) }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("button", { className: "btn-outline inline-flex items-center space-x-2", children: [_jsx(Filter, { className: "w-4 h-4" }), _jsx("span", { children: "Filter" })] }), _jsxs("button", { className: "btn-outline inline-flex items-center space-x-2", children: [_jsx(Download, { className: "w-4 h-4" }), _jsx("span", { children: "Export" })] })] })] }) }), _jsx("div", { className: "card", children: filteredParties.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Users, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No parties found" }), _jsx("p", { className: "text-gray-500 mb-6", children: searchTerm
                                ? 'Try adjusting your search criteria.'
                                : 'Get started by adding your first party.' }), _jsx("button", { onClick: () => setShowAddModal(true), className: "btn-primary", children: "Add Your First Party" })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Party" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Contact" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Total Purchases" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Outstanding" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Last Purchase" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredParties.map((party) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3", children: _jsx("span", { className: "text-sm font-medium text-primary-700", children: party.name.charAt(0).toUpperCase() }) }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: party.name }), party.gstNumber && (_jsxs("div", { className: "text-sm text-gray-500", children: ["GST: ", party.gstNumber] }))] })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "space-y-1", children: [party.email && (_jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [_jsx(Mail, { className: "w-3 h-3 mr-1" }), party.email] })), party.phone && (_jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [_jsx(Phone, { className: "w-3 h-3 mr-1" }), party.phone] })), party.address && (_jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [_jsx(MapPin, { className: "w-3 h-3 mr-1" }), party.address.substring(0, 30), "..."] }))] }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: ["\u20B9", party.totalPurchases.toLocaleString()] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: ["\u20B9", party.outstandingAmount.toLocaleString()] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: party.lastPurchaseDate
                                                ? new Date(party.lastPurchaseDate).toLocaleDateString()
                                                : 'Never' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${party.isActive
                                                    ? 'bg-secondary-100 text-secondary-800'
                                                    : 'bg-gray-100 text-gray-800'}`, children: party.isActive ? 'Active' : 'Inactive' }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { className: "text-primary-600 hover:text-primary-900", title: "Edit Party", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDeleteParty(party.id), className: "text-error-600 hover:text-error-900", title: "Delete Party", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, party.id))) })] }) })) }), _jsx(AddPartyModal, { isOpen: showAddModal, onClose: () => setShowAddModal(false), onSave: handleSaveParty })] }));
};
export default Parties;
