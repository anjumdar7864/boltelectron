import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Save, Send, Eye, Calculator, User, Package } from 'lucide-react';
import dataService from '../services/dataService';
const CreateInvoice = () => {
    const navigate = useNavigate();
    const [parties, setParties] = useState([]);
    const [products, setProducts] = useState([]);
    const [invoice, setInvoice] = useState({
        invoiceNumber: '',
        partyId: '',
        partyName: '',
        partyEmail: '',
        partyPhone: '',
        partyAddress: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: '',
        items: [],
        subtotal: 0,
        taxAmount: 0,
        taxRate: 18,
        discount: 0,
        total: 0,
        status: 'draft',
        isGST: true,
        notes: ''
    });
    useEffect(() => {
        loadInitialData();
        generateInvoiceNumber();
    }, []);
    const loadInitialData = async () => {
        try {
            const [partiesData, productsData] = await Promise.all([
                dataService.getParties(),
                dataService.getProducts()
            ]);
            setParties(partiesData);
            setProducts(productsData);
        }
        catch (error) {
            console.error('Error loading initial data:', error);
        }
    };
    const generateInvoiceNumber = async () => {
        const settings = await dataService.getBusinessSettings();
        const invoiceNumber = `${settings.invoicePrefix}-${String(settings.invoiceCounter).padStart(4, '0')}`;
        setInvoice(prev => ({ ...prev, invoiceNumber }));
    };
    const handlePartyChange = (partyId) => {
        const party = parties.find(p => p.id === partyId);
        if (party) {
            setInvoice(prev => ({
                ...prev,
                partyId: party.id,
                partyName: party.name,
                partyEmail: party.email || '',
                partyPhone: party.phone || '',
                partyAddress: party.address || ''
            }));
        }
    };
    const addInvoiceItem = () => {
        const newItem = {
            id: Date.now().toString(),
            productId: '',
            name: '',
            description: '',
            quantity: 1,
            unit: 'pcs',
            rate: 0,
            taxRate: invoice.taxRate || 18,
            amount: 0
        };
        setInvoice(prev => ({
            ...prev,
            items: [...(prev.items || []), newItem]
        }));
    };
    const removeInvoiceItem = (itemId) => {
        setInvoice(prev => ({
            ...prev,
            items: prev.items?.filter(item => item.id !== itemId) || []
        }));
        calculateTotals();
    };
    const updateInvoiceItem = (itemId, field, value) => {
        setInvoice(prev => ({
            ...prev,
            items: prev.items?.map(item => {
                if (item.id === itemId) {
                    const updatedItem = { ...item, [field]: value };
                    // If product is selected, update item details
                    if (field === 'productId' && value) {
                        const product = products.find(p => p.id === value);
                        if (product) {
                            updatedItem.name = product.name;
                            updatedItem.description = product.description || '';
                            updatedItem.rate = product.sellingPrice;
                            updatedItem.unit = product.unit;
                            updatedItem.taxRate = product.taxRate;
                            updatedItem.hsnCode = product.hsnCode;
                        }
                    }
                    // Calculate amount
                    updatedItem.amount = updatedItem.quantity * updatedItem.rate;
                    return updatedItem;
                }
                return item;
            }) || []
        }));
        // Recalculate totals after a short delay to ensure state is updated
        setTimeout(calculateTotals, 100);
    };
    const calculateTotals = () => {
        const items = invoice.items || [];
        const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
        const discountAmount = (subtotal * (invoice.discount || 0)) / 100;
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = (taxableAmount * (invoice.taxRate || 0)) / 100;
        const total = taxableAmount + taxAmount;
        setInvoice(prev => ({
            ...prev,
            subtotal,
            taxAmount,
            total
        }));
    };
    const handleSaveInvoice = async (status) => {
        try {
            const newInvoice = {
                ...invoice,
                id: Date.now().toString(),
                status,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            await dataService.saveInvoice(newInvoice);
            // Update invoice counter
            const settings = await dataService.getBusinessSettings();
            await dataService.saveBusinessSettings({
                ...settings,
                invoiceCounter: settings.invoiceCounter + 1
            });
            navigate('/invoices');
        }
        catch (error) {
            console.error('Error saving invoice:', error);
        }
    };
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Create Invoice" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Create a new invoice for your customer" })] }), _jsxs("div", { className: "mt-4 sm:mt-0 flex space-x-3", children: [_jsxs("button", { onClick: () => handleSaveInvoice('draft'), className: "btn-outline inline-flex items-center space-x-2", children: [_jsx(Save, { className: "w-4 h-4" }), _jsx("span", { children: "Save Draft" })] }), _jsxs("button", { className: "btn-outline inline-flex items-center space-x-2", children: [_jsx(Eye, { className: "w-4 h-4" }), _jsx("span", { children: "Preview" })] }), _jsxs("button", { onClick: () => handleSaveInvoice('sent'), className: "btn-primary inline-flex items-center space-x-2", children: [_jsx(Send, { className: "w-4 h-4" }), _jsx("span", { children: "Save & Send" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Invoice Details" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Invoice Number" }), _jsx("input", { type: "text", value: invoice.invoiceNumber, onChange: (e) => setInvoice(prev => ({ ...prev, invoiceNumber: e.target.value })), className: "input-field", placeholder: "INV-0001" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Invoice Date" }), _jsx("input", { type: "date", value: invoice.date, onChange: (e) => setInvoice(prev => ({ ...prev, date: e.target.value })), className: "input-field" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Due Date" }), _jsx("input", { type: "date", value: invoice.dueDate, onChange: (e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value })), className: "input-field" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Tax Rate (%)" }), _jsx("input", { type: "number", value: invoice.taxRate, onChange: (e) => setInvoice(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 })), className: "input-field", min: "0", step: "0.1" })] })] }), _jsx("div", { className: "mt-4", children: _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: invoice.isGST, onChange: (e) => setInvoice(prev => ({ ...prev, isGST: e.target.checked })), className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500" }), _jsx("span", { className: "ml-2 text-sm text-gray-700", children: "GST Invoice" })] }) })] }), _jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-4", children: [_jsx(User, { className: "w-5 h-5 text-gray-600" }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Party Details" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Select Party" }), _jsxs("select", { value: invoice.partyId, onChange: (e) => handlePartyChange(e.target.value), className: "input-field", children: [_jsx("option", { value: "", children: "Select a party" }), parties.map(party => (_jsx("option", { value: party.id, children: party.name }, party.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Party Name" }), _jsx("input", { type: "text", value: invoice.partyName, onChange: (e) => setInvoice(prev => ({ ...prev, partyName: e.target.value })), className: "input-field", placeholder: "Enter party name" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", value: invoice.partyEmail, onChange: (e) => setInvoice(prev => ({ ...prev, partyEmail: e.target.value })), className: "input-field", placeholder: "party@example.com" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Phone" }), _jsx("input", { type: "tel", value: invoice.partyPhone, onChange: (e) => setInvoice(prev => ({ ...prev, partyPhone: e.target.value })), className: "input-field", placeholder: "+91 9876543210" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Address" }), _jsx("textarea", { value: invoice.partyAddress, onChange: (e) => setInvoice(prev => ({ ...prev, partyAddress: e.target.value })), className: "input-field", rows: 2, placeholder: "Party address" })] })] })] }), _jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Package, { className: "w-5 h-5 text-gray-600" }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Invoice Items" })] }), _jsxs("button", { onClick: addInvoiceItem, className: "btn-primary inline-flex items-center space-x-2", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Add Item" })] })] }), _jsxs("div", { className: "space-y-4", children: [invoice.items?.map((item, index) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-6 gap-4", children: [_jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Product" }), _jsxs("select", { value: item.productId, onChange: (e) => updateInvoiceItem(item.id, 'productId', e.target.value), className: "input-field", children: [_jsx("option", { value: "", children: "Select product" }), products.map(product => (_jsxs("option", { value: product.id, children: [product.name, " - \u20B9", product.sellingPrice] }, product.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Quantity" }), _jsx("input", { type: "number", value: item.quantity, onChange: (e) => updateInvoiceItem(item.id, 'quantity', parseFloat(e.target.value) || 0), className: "input-field", min: "0", step: "0.1" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Rate" }), _jsx("input", { type: "number", value: item.rate, onChange: (e) => updateInvoiceItem(item.id, 'rate', parseFloat(e.target.value) || 0), className: "input-field", min: "0", step: "0.01" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Amount" }), _jsx("input", { type: "number", value: item.amount, readOnly: true, className: "input-field bg-gray-50" })] }), _jsx("div", { className: "flex items-end", children: _jsx("button", { onClick: () => removeInvoiceItem(item.id), className: "p-2 text-error-600 hover:text-error-700 hover:bg-error-50 rounded-lg", children: _jsx(Minus, { className: "w-4 h-4" }) }) })] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("input", { type: "text", value: item.description, onChange: (e) => updateInvoiceItem(item.id, 'description', e.target.value), className: "input-field", placeholder: "Item description (optional)" })] })] }, item.id))), (!invoice.items || invoice.items.length === 0) && (_jsxs("div", { className: "text-center py-8 border-2 border-dashed border-gray-300 rounded-lg", children: [_jsx(Package, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-500", children: "No items added yet" }), _jsx("button", { onClick: addInvoiceItem, className: "mt-2 btn-primary", children: "Add Your First Item" })] }))] })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Notes" }), _jsx("textarea", { value: invoice.notes, onChange: (e) => setInvoice(prev => ({ ...prev, notes: e.target.value })), className: "input-field", rows: 3, placeholder: "Additional notes or terms..." })] })] }), _jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "card sticky top-6", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-4", children: [_jsx(Calculator, { className: "w-5 h-5 text-gray-600" }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Invoice Summary" })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Subtotal:" }), _jsxs("span", { className: "font-medium", children: ["\u20B9", invoice.subtotal?.toLocaleString() || '0'] })] }), _jsxs("div", { className: "flex justify-between items-center text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Discount:" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "number", value: invoice.discount, onChange: (e) => {
                                                                setInvoice(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }));
                                                                setTimeout(calculateTotals, 100);
                                                            }, className: "w-16 px-2 py-1 text-xs border border-gray-300 rounded", min: "0", step: "0.1" }), _jsx("span", { className: "text-xs text-gray-500", children: "%" })] })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsxs("span", { className: "text-gray-600", children: ["Tax (", invoice.taxRate, "%):"] }), _jsxs("span", { className: "font-medium", children: ["\u20B9", invoice.taxAmount?.toLocaleString() || '0'] })] }), _jsx("div", { className: "border-t pt-3", children: _jsxs("div", { className: "flex justify-between text-lg font-bold", children: [_jsx("span", { children: "Total:" }), _jsxs("span", { className: "text-primary-600", children: ["\u20B9", invoice.total?.toLocaleString() || '0'] })] }) })] }), _jsxs("div", { className: "mt-6 space-y-3", children: [_jsx("button", { onClick: () => handleSaveInvoice('draft'), className: "w-full btn-outline", children: "Save as Draft" }), _jsx("button", { onClick: () => handleSaveInvoice('sent'), className: "w-full btn-primary", children: "Save & Send Invoice" })] })] }) })] })] }));
};
export default CreateInvoice;
