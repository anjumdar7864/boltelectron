import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Users,
  Phone,
  Mail,
  MapPin,
  X,
  Settings,
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Party, Invoice } from '../types';
import dataService from '../services/dataService';

const AddPartyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (party: Partial<Party>) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('gst');
  const [formData, setFormData] = useState<Partial<Party>>({
    name: '',
    phone: '',
    gstNumber: '',
    gstType: 'unregistered',
    state: '',
    email: '',
    billingAddress: '',
    shippingAddress: '',
    enableShippingAddress: false,
    isActive: true
  });

  const handleSubmit = (saveAndNew = false) => {
    if (!formData.name?.trim()) {
      alert('Party name is required');
      return;
    }

    const newParty: Party = {
      ...formData,
      id: Date.now().toString(),
      outstandingAmount: 0,
      totalPurchases: 0,
      loyaltyPoints: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Party;

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
        isActive: true
      });
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Party</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 text-gray-500" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Party Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Party Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GSTIN
              </label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, gstNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="GSTIN"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Phone Number"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {[
                { key: 'gst', label: 'GST & Address' },
                { key: 'credit', label: 'Credit & Balance' },
                { key: 'additional', label: 'Additional Fields' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'gst' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GST Type
                  </label>
                  <select
                    value={formData.gstType}
                    onChange={(e) => setFormData(prev => ({ ...prev, gstType: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="unregistered">Unregistered/Consumer</option>
                    <option value="registered">Registered Business</option>
                    <option value="consumer">Consumer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">State</option>
                    <option value="maharashtra">Maharashtra</option>
                    <option value="gujarat">Gujarat</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="delhi">Delhi</option>
                    <option value="tamil-nadu">Tamil Nadu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email ID
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Address
                </label>
                <textarea
                  value={formData.billingAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, billingAddress: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Billing Address"
                />
              </div>

              <div>
                <label className="flex items-center text-sm text-blue-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableShippingAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, enableShippingAddress: e.target.checked }))}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  + Enable Shipping Address
                </label>
              </div>

              {formData.enableShippingAddress && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Address
                  </label>
                  <textarea
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, shippingAddress: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Shipping Address"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'credit' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credit Limit
                </label>
                <input
                  type="number"
                  value={formData.creditLimit || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, creditLimit: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter credit limit"
                />
              </div>
            </div>
          )}

          {activeTab === 'additional' && (
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <p>Additional fields can be configured here</p>
                <p className="text-sm">Custom fields, tags, and other metadata</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => handleSubmit(true)}
            className="px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
          >
            Save & New
          </button>
          <button
            onClick={() => handleSubmit(false)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const PartyTransactions: React.FC<{
  party: Party;
  onBack: () => void;
}> = ({ party, onBack }) => {
  const [transactions, setTransactions] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartyTransactions();
  }, [party.id]);

  const loadPartyTransactions = async () => {
    try {
      const allInvoices = await dataService.getInvoices();
      const partyTransactions = allInvoices.filter(invoice => invoice.partyId === party.id);
      setTransactions(partyTransactions);
    } catch (error) {
      console.error('Error loading party transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{party.name}</h1>
          <p className="text-gray-600">All transactions for this party</p>
        </div>
      </div>

      {/* Party Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Purchases</p>
              <p className="text-2xl font-bold text-gray-900">₹{party.totalPurchases.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">₹{party.outstandingAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Purchase</p>
              <p className="text-lg font-bold text-gray-900">
                {party.lastPurchaseDate 
                  ? new Date(party.lastPurchaseDate).toLocaleDateString()
                  : 'Never'
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-accent-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
          <div className="flex items-center space-x-2">
            <button className="btn-outline inline-flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500">This party hasn't made any purchases yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.dueDate ? new Date(transaction.dueDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{transaction.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-primary-600 hover:text-primary-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const Parties: React.FC = () => {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);

  useEffect(() => {
    loadParties();
  }, []);

  const loadParties = async () => {
    try {
      const data = await dataService.getParties();
      setParties(data);
    } catch (error) {
      console.error('Error loading parties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteParty = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this party?')) {
      try {
        await dataService.deleteParty(id);
        setParties(parties.filter(party => party.id !== id));
      } catch (error) {
        console.error('Error deleting party:', error);
      }
    }
  };

  const handleSaveParty = async (partyData: Partial<Party>) => {
    try {
      await dataService.saveParty(partyData as Party);
      await loadParties();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error saving party:', error);
    }
  };

  const handlePartyClick = (party: Party) => {
    setSelectedParty(party);
  };

  const handleBackToParties = () => {
    setSelectedParty(null);
  };

  const filteredParties = parties.filter(party => {
    return party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (party.email && party.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (party.phone && party.phone.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  if (selectedParty) {
    return <PartyTransactions party={selectedParty} onBack={handleBackToParties} />;
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Parties</h1>
          <p className="text-gray-600 mt-1">Manage your business parties</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Party</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search parties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-80"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button className="btn-outline inline-flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="btn-outline inline-flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Parties List - Exact same as video */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="space-y-4">
            {filteredParties.map((party) => (
              <div
                key={party.id}
                onClick={() => handlePartyClick(party)}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-700">
                      {party.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{party.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {party.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {party.phone}
                        </div>
                      )}
                      {party.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {party.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Sales</p>
                    <p className="font-semibold text-gray-900">₹{party.totalPurchases.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Outstanding</p>
                    <p className="font-semibold text-gray-900">₹{party.outstandingAmount.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle edit
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteParty(party.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filteredParties.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No parties found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? 'Try adjusting your search criteria.'
              : 'Get started by adding your first party.'
            }
          </p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            Add Your First Party
          </button>
        </div>
      )}

      {/* Add Party Modal */}
      <AddPartyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveParty}
      />
    </div>
  );
};

export default Parties;