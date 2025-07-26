import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Edit, Trash2, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import dataService from '../services/dataService';
const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    useEffect(() => {
        loadProducts();
    }, []);
    const loadProducts = async () => {
        try {
            const data = await dataService.getProducts();
            setProducts(data);
        }
        catch (error) {
            console.error('Error loading products:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await dataService.deleteProduct(id);
                setProducts(products.filter(prod => prod.id !== id));
            }
            catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    const categories = [...new Set(products.map(p => p.category))];
    const lowStockProducts = products.filter(p => p.stock <= p.minStock);
    const totalValue = products.reduce((sum, p) => sum + (p.stock * p.costPrice), 0);
    const getStockStatus = (product) => {
        if (product.stock <= 0)
            return { text: 'Out of Stock', color: 'text-error-600 bg-error-50' };
        if (product.stock <= product.minStock)
            return { text: 'Low Stock', color: 'text-warning-600 bg-warning-50' };
        return { text: 'In Stock', color: 'text-secondary-600 bg-secondary-50' };
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" }) }));
    }
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Inventory Management" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Manage your products and stock levels" })] }), _jsx("div", { className: "mt-4 sm:mt-0", children: _jsxs("button", { onClick: () => setShowAddModal(true), className: "btn-primary inline-flex items-center space-x-2", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Add Product" })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Products" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: products.length })] }), _jsx("div", { className: "w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center", children: _jsx(Package, { className: "w-6 h-6 text-primary-600" }) })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Low Stock Items" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: lowStockProducts.length })] }), _jsx("div", { className: "w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center", children: _jsx(AlertTriangle, { className: "w-6 h-6 text-warning-600" }) })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Value" }), _jsxs("p", { className: "text-2xl font-bold text-gray-900", children: ["\u20B9", totalValue.toLocaleString()] })] }), _jsx("div", { className: "w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center", children: _jsx(TrendingUp, { className: "w-6 h-6 text-secondary-600" }) })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Categories" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: categories.length })] }), _jsx("div", { className: "w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center", children: _jsx(Package, { className: "w-6 h-6 text-accent-600" }) })] }) })] }), lowStockProducts.length > 0 && (_jsx("div", { className: "bg-warning-50 border border-warning-200 rounded-xl p-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(AlertTriangle, { className: "w-6 h-6 text-warning-600" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-warning-800", children: "Low Stock Alert" }), _jsxs("p", { className: "text-warning-700", children: [lowStockProducts.length, " products are running low on stock. Consider restocking soon."] })] })] }) })), _jsx("div", { className: "card", children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), _jsx("input", { type: "text", placeholder: "Search products...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" })] }), _jsxs("select", { value: categoryFilter, onChange: (e) => setCategoryFilter(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500", children: [_jsx("option", { value: "all", children: "All Categories" }), categories.map(category => (_jsx("option", { value: category, children: category }, category)))] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("button", { className: "btn-outline inline-flex items-center space-x-2", children: [_jsx(Filter, { className: "w-4 h-4" }), _jsx("span", { children: "Filter" })] }), _jsxs("button", { className: "btn-outline inline-flex items-center space-x-2", children: [_jsx(Download, { className: "w-4 h-4" }), _jsx("span", { children: "Export" })] })] })] }) }), _jsx("div", { className: "card", children: filteredProducts.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Package, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No products found" }), _jsx("p", { className: "text-gray-500 mb-6", children: searchTerm || categoryFilter !== 'all'
                                ? 'Try adjusting your search or filter criteria.'
                                : 'Get started by adding your first product.' }), _jsx("button", { onClick: () => setShowAddModal(true), className: "btn-primary", children: "Add Your First Product" })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Product" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "SKU" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Category" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Stock" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Cost Price" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Selling Price" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredProducts.map((product) => {
                                    const stockStatus = getStockStatus(product);
                                    return (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: product.name }), product.description && (_jsx("div", { className: "text-sm text-gray-500", children: product.description }))] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: product.sku }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: product.category }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsxs("div", { className: "text-sm font-medium text-gray-900", children: [product.stock, " ", product.unit] }), _jsxs("div", { className: "text-xs text-gray-500", children: ["Min: ", product.minStock, " ", product.unit] })] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: ["\u20B9", product.costPrice.toLocaleString()] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: ["\u20B9", product.sellingPrice.toLocaleString()] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`, children: stockStatus.text }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { className: "text-primary-600 hover:text-primary-900", title: "Edit Product", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDeleteProduct(product.id), className: "text-error-600 hover:text-error-900", title: "Delete Product", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, product.id));
                                }) })] }) })) })] }));
};
export default Inventory;
