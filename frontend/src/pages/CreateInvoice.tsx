import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Minus,
  Save,
  Send,
  Eye,
  Calculator,
  User,
  Package
} from 'lucide-react';
import { Invoice, InvoiceItem, Customer, Product } from '../types';
import dataService from '../services/dataService';

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoice, setInvoice] = useState<Partial<Invoice>>({
    invoiceNumber: '',
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
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
      const [customersData, productsData] = await Promise.all([
        dataService.getCustomers(),
        dataService.getProducts()
      ]);
      setCustomers(customersData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const generateInvoiceNumber = async () => {
    const settings = await dataService.getBusinessSettings();
    const invoiceNumber = `${settings.invoicePrefix}-${String(settings.invoiceCounter).padStart(4, '0')}`;
    setInvoice(prev => ({ ...prev, invoiceNumber }));
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setInvoice(prev => ({
        ...prev,
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email || '',
        customerPhone: customer.phone || '',
        customerAddress: customer.address || ''
      }));
    }
  };

  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
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

  const removeInvoiceItem = (itemId: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items?.filter(item => item.id !== itemId) || []
    }));
    calculateTotals();
  };

  const updateInvoiceItem = (itemId: string, field: keyof InvoiceItem, value: any) => {
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

  const handleSaveInvoice = async (status: 'draft' | 'sent') => {
    try {
      const newInvoice: Invoice = {
        ...invoice,
        id: Date.now().toString(),
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Invoice;

      await dataService.saveInvoice(newInvoice);
      
      // Update invoice counter
      const settings = await dataService.getBusinessSettings();
      await dataService.saveBusinessSettings({
        ...settings,
        invoiceCounter: settings.invoiceCounter + 1
      });

      navigate('/invoices');
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>
          <p className="text-gray-600 mt-1">Create a new invoice for your customer</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => handleSaveInvoice('draft')}
            className="btn-outline inline-flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
          <button className="btn-outline inline-flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => handleSaveInvoice('sent')}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Save & Send</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Details */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) => setInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                  className="input-field"
                  placeholder="INV-0001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={invoice.date}
                  onChange={(e) => setInvoice(prev => ({ ...prev, date: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={invoice.taxRate}
                  onChange={(e) => setInvoice(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                  className="input-field"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={invoice.isGST}
                  onChange={(e) => setInvoice(prev => ({ ...prev, isGST: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">GST Invoice</span>
              </label>
            </div>
          </div>

          {/* Customer Details */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">Customer Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Customer
                </label>
                <select
                  value={invoice.customerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select a customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={invoice.customerName}
                  onChange={(e) => setInvoice(prev => ({ ...prev, customerName: e.target.value }))}
                  className="input-field"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={invoice.customerEmail}
                  onChange={(e) => setInvoice(prev => ({ ...prev, customerEmail: e.target.value }))}
                  className="input-field"
                  placeholder="customer@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={invoice.customerPhone}
                  onChange={(e) => setInvoice(prev => ({ ...prev, customerPhone: e.target.value }))}
                  className="input-field"
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={invoice.customerAddress}
                  onChange={(e) => setInvoice(prev => ({ ...prev, customerAddress: e.target.value }))}
                  className="input-field"
                  rows={2}
                  placeholder="Customer address"
                />
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900">Invoice Items</h3>
              </div>
              <button
                onClick={addInvoiceItem}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-4">
              {invoice.items?.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product
                      </label>
                      <select
                        value={item.productId}
                        onChange={(e) => updateInvoiceItem(item.id, 'productId', e.target.value)}
                        className="input-field"
                      >
                        <option value="">Select product</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} - ₹{product.sellingPrice}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateInvoiceItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="input-field"
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rate
                      </label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateInvoiceItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="input-field"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={item.amount}
                        readOnly
                        className="input-field bg-gray-50"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => removeInvoiceItem(item.id)}
                        className="p-2 text-error-600 hover:text-error-700 hover:bg-error-50 rounded-lg"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                      className="input-field"
                      placeholder="Item description (optional)"
                    />
                  </div>
                </div>
              ))}

              {(!invoice.items || invoice.items.length === 0) && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No items added yet</p>
                  <button
                    onClick={addInvoiceItem}
                    className="mt-2 btn-primary"
                  >
                    Add Your First Item
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
            <textarea
              value={invoice.notes}
              onChange={(e) => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
              className="input-field"
              rows={3}
              placeholder="Additional notes or terms..."
            />
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calculator className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">Invoice Summary</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{invoice.subtotal?.toLocaleString() || '0'}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Discount:</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={invoice.discount}
                    onChange={(e) => {
                      setInvoice(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }));
                      setTimeout(calculateTotals, 100);
                    }}
                    className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                    min="0"
                    step="0.1"
                  />
                  <span className="text-xs text-gray-500">%</span>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                <span className="font-medium">₹{invoice.taxAmount?.toLocaleString() || '0'}</span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary-600">₹{invoice.total?.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => handleSaveInvoice('draft')}
                className="w-full btn-outline"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleSaveInvoice('sent')}
                className="w-full btn-primary"
              >
                Save & Send Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;