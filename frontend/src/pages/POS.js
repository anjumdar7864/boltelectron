import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Plus, Minus, Search, ShoppingCart, CreditCard, Trash2, Scan } from 'lucide-react';
import dataService from '../services/dataService';
const POS = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(18);
    useEffect(() => {
        loadProducts();
    }, []);
    useEffect(() => {
        calculateTotal();
    }, [cart, discount, tax]);
    const loadProducts = async () => {
        try {
            const data = await dataService.getProducts();
            setProducts(data.filter(p => p.isActive && p.stock > 0));
        }
        catch (error) {
            console.error('Error loading products:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const addToCart = (product) => {
        const existingItem = cart.find(item => item.productId === product.id);
        if (existingItem) {
            setCart(cart.map(item => item.productId === product.id
                ? { ...item, quantity: item.quantity + 1, amount: (item.quantity + 1) * item.rate }
                : item));
        }
        else {
            const newItem = {
                id: Date.now().toString(),
                productId: product.id,
                name: product.name,
                quantity: 1,
                unit: product.unit,
                rate: product.sellingPrice,
                taxRate: product.taxRate,
                amount: product.sellingPrice
            };
            setCart([...cart, newItem]);
        }
    };
    const updateQuantity = (itemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        setCart(cart.map(item => item.id === itemId
            ? { ...item, quantity, amount: quantity * item.rate }
            : item));
    };
    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item.id !== itemId));
    };
    const calculateTotal = () => {
        const subtotal = cart.reduce((sum, item) => sum + item.amount, 0);
        const discountAmount = (subtotal * discount) / 100;
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = (taxableAmount * tax) / 100;
        setTotal(taxableAmount + taxAmount);
    };
    const handleCheckout = async () => {
        if (cart.length === 0)
            return;
        // Here you would typically create an invoice and process payment
        alert('Checkout functionality will be implemented');
        setCart([]);
    };
    const clearCart = () => {
        setCart([]);
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" }) }));
    }
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Point of Sale" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Quick billing and checkout system" })] }), _jsx("div", { className: "mt-4 sm:mt-0", children: _jsxs("button", { className: "btn-outline inline-flex items-center space-x-2", children: [_jsx(Scan, { className: "w-4 h-4" }), _jsx("span", { children: "Scan Barcode" })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsx("div", { className: "card", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }), _jsx("input", { type: "text", placeholder: "Search products...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg" })] }) }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4", children: filteredProducts.map((product) => (_jsx("div", { onClick: () => addToCart(product), className: "card cursor-pointer hover:shadow-lg transition-all duration-200 p-4", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3", children: _jsx("span", { className: "text-2xl font-bold text-primary-600", children: product.name.charAt(0) }) }), _jsx("h3", { className: "font-medium text-gray-900 text-sm mb-1", children: product.name }), _jsx("p", { className: "text-xs text-gray-500 mb-2", children: product.sku }), _jsxs("p", { className: "text-lg font-bold text-primary-600", children: ["\u20B9", product.sellingPrice] }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Stock: ", product.stock, " ", product.unit] })] }) }, product.id))) })] }), _jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "card sticky top-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(ShoppingCart, { className: "w-5 h-5 text-gray-600" }), _jsxs("h3", { className: "text-lg font-semibold text-gray-900", children: ["Cart (", cart.length, ")"] })] }), cart.length > 0 && (_jsx("button", { onClick: clearCart, className: "text-error-600 hover:text-error-700 text-sm", children: "Clear All" }))] }), cart.length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(ShoppingCart, { className: "w-12 h-12 text-gray-400 mx-auto mb-3" }), _jsx("p", { className: "text-gray-500", children: "Your cart is empty" })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto mb-4", children: cart.map((item) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-medium text-gray-900 text-sm", children: item.name }), _jsxs("p", { className: "text-xs text-gray-500", children: ["\u20B9", item.rate, " \u00D7 ", item.quantity] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => updateQuantity(item.id, item.quantity - 1), className: "w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300", children: _jsx(Minus, { className: "w-3 h-3" }) }), _jsx("span", { className: "w-8 text-center text-sm font-medium", children: item.quantity }), _jsx("button", { onClick: () => updateQuantity(item.id, item.quantity + 1), className: "w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300", children: _jsx(Plus, { className: "w-3 h-3" }) }), _jsx("button", { onClick: () => removeFromCart(item.id), className: "w-6 h-6 rounded-full bg-error-100 flex items-center justify-center hover:bg-error-200 ml-2", children: _jsx(Trash2, { className: "w-3 h-3 text-error-600" }) })] })] }, item.id))) }), _jsxs("div", { className: "space-y-3 border-t pt-4", children: [_jsxs("div", { className: "flex justify-between items-center text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Subtotal:" }), _jsxs("span", { className: "font-medium", children: ["\u20B9", cart.reduce((sum, item) => sum + item.amount, 0).toLocaleString()] })] }), _jsxs("div", { className: "flex justify-between items-center text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Discount:" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "number", value: discount, onChange: (e) => setDiscount(parseFloat(e.target.value) || 0), className: "w-16 px-2 py-1 text-xs border border-gray-300 rounded", min: "0", step: "0.1" }), _jsx("span", { className: "text-xs", children: "%" })] })] }), _jsxs("div", { className: "flex justify-between items-center text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Tax:" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "number", value: tax, onChange: (e) => setTax(parseFloat(e.target.value) || 0), className: "w-16 px-2 py-1 text-xs border border-gray-300 rounded", min: "0", step: "0.1" }), _jsx("span", { className: "text-xs", children: "%" })] })] }), _jsx("div", { className: "border-t pt-3", children: _jsxs("div", { className: "flex justify-between items-center text-lg font-bold", children: [_jsx("span", { children: "Total:" }), _jsxs("span", { className: "text-primary-600", children: ["\u20B9", total.toLocaleString()] })] }) })] }), _jsx("div", { className: "mt-6", children: _jsxs("button", { onClick: handleCheckout, className: "w-full btn-primary inline-flex items-center justify-center space-x-2 py-3", children: [_jsx(CreditCard, { className: "w-5 h-5" }), _jsx("span", { children: "Checkout" })] }) })] }))] }) })] })] }));
};
export default POS;
