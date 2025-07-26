import React, { useState, useEffect } from 'react';
import {
  Plus,
  Minus,
  Search,
  ShoppingCart,
  CreditCard,
  Trash2,
  Calculator,
  Scan
} from 'lucide-react';
import { Product, InvoiceItem } from '../types';
import dataService from '../services/dataService';

const POS: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<InvoiceItem[]>([]);
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
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1, amount: (item.quantity + 1) * item.rate }
          : item
      ));
    } else {
      const newItem: InvoiceItem = {
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

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(cart.map(item =>
      item.id === itemId
        ? { ...item, quantity, amount: quantity * item.rate }
        : item
    ));
  };

  const removeFromCart = (itemId: string) => {
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
    if (cart.length === 0) return;

    // Here you would typically create an invoice and process payment
    alert('Checkout functionality will be implemented');
    setCart([]);
  };

  const clearCart = () => {
    setCart([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
          <p className="text-gray-600 mt-1">Quick billing and checkout system</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn-outline inline-flex items-center space-x-2">
            <Scan className="w-4 h-4" />
            <span>Scan Barcode</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search */}
          <div className="card">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="card cursor-pointer hover:shadow-lg transition-all duration-200 p-4"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-primary-600">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{product.sku}</p>
                  <p className="text-lg font-bold text-primary-600">₹{product.sellingPrice}</p>
                  <p className="text-xs text-gray-500">Stock: {product.stock} {product.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Cart ({cart.length})</h3>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-error-600 hover:text-error-700 text-sm"
                >
                  Clear All
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500">₹{item.rate} × {item.quantity}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-6 h-6 rounded-full bg-error-100 flex items-center justify-center hover:bg-error-200 ml-2"
                        >
                          <Trash2 className="w-3 h-3 text-error-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      ₹{cart.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                        min="0"
                        step="0.1"
                      />
                      <span className="text-xs">%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={tax}
                        onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                        min="0"
                        step="0.1"
                      />
                      <span className="text-xs">%</span>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary-600">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="mt-6">
                  <button
                    onClick={handleCheckout}
                    className="w-full btn-primary inline-flex items-center justify-center space-x-2 py-3"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Checkout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;