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
  Settings
} from 'lucide-react';
import { Party } from '../types';
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
    isActive: true,
    creditLimit: undefined,
    openingBalance: 0,
    asOfDate: ''
  });
  const [noCreditLimit, setNoCreditLimit] = useState(true);

  const handleSubmit = (saveAndNew = false) => {
    const newParty: Party = {
      ...formData,
      creditLimit: noCreditLimit ? undefined : formData.creditLimit,
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
        isActive: true,
        creditLimit: undefined,
        openingBalance: 0,
        asOfDate: ''
      });
      setNoCreditLimit(true);
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Party Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter party name"
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
                    <option value="">Select State</option>
                    <option value="maharashtra">Maharashtra</option>
                    <option value="gujarat">Gujarat</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="delhi">Delhi</option>
                    <option value="tamil-nadu">Tamil Nadu</option>
                    {/* Add more states as needed */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance</label>
                  <input
                    type="number"
                    value={formData.openingBalance || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, openingBalance: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Opening Balance"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">As of Date</label>
                  <input
                    type="date"
                    value={formData.asOfDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, asOfDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Credit Limit
                  </label>
                  <div className="flex items-center">
                    <span className="mr-2 text-sm text-gray-700">No Limit</span>
                    <button
                      type="button"
                      onClick={() => setNoCreditLimit(!noCreditLimit)}
                      className={`${noCreditLimit ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                    >
                      <span
                        className={`${noCreditLimit ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                      />
                    </button>
                  </div>
                </div>
                {!noCreditLimit && (
                  <input
                    type="number"
                    value={formData.creditLimit || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, creditLimit: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Credit Limit"
                  />
                )}
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

const Parties: React.FC = () => {
  const [parties, setParties] = useState<Party[]>([]);
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
    } catch (error) {
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
          <h1 className="text-2xl font-bold text-gray-900">Party Management</h1>
          <p className="text-gray-600 mt-1">Manage your party relationships</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Parties</p>
              <p className="text-2xl font-bold text-gray-900">{totalParties}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Parties</p>
              <p className="text-2xl font-bold text-gray-900">{activeParties}</p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Purchases</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalPurchases.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-accent-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalOutstanding.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search parties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
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

      {/* Parties List */}
      <div className="card">
        {filteredParties.length === 0 ? (
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
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Party
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Purchases
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Outstanding
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Purchase
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
                {filteredParties.map((party) => (
                  <tr key={party.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-primary-700">
                            {party.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{party.name}</div>
                          {party.gstNumber && (
                            <div className="text-sm text-gray-500">GST: {party.gstNumber}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {party.email && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="w-3 h-3 mr-1" />
                            {party.email}
                          </div>
                        )}
                        {party.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="w-3 h-3 mr-1" />
                            {party.phone}
                          </div>
                        )}
                        {party.address && (
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-3 h-3 mr-1" />
                            {party.address.substring(0, 30)}...
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{party.totalPurchases.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{party.outstandingAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {party.lastPurchaseDate 
                        ? new Date(party.lastPurchaseDate).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        party.isActive 
                          ? 'bg-secondary-100 text-secondary-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {party.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit Party"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteParty(party.id)}
                          className="text-error-600 hover:text-error-900"
                          title="Delete Party"
                        >
                          <Trash2 className="w-4 h-4" />
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