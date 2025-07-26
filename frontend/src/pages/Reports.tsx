import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Users,
  Package
} from 'lucide-react';
import { DashboardData } from '../types';
import dataService from '../services/dataService';

const Reports: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');
  const [reportType, setReportType] = useState('overview');

  useEffect(() => {
    loadReportsData();
  }, [dateRange]);

  const loadReportsData = async () => {
    try {
      const data = await dataService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load reports data</p>
      </div>
    );
  }

  const pieData = dashboardData.topProducts.map((product, index) => ({
    name: product.name,
    value: product.sales,
    color: `hsl(${index * 60}, 70%, 50%)`
  }));

  const COLORS = ['#3b82f6', '#059669', '#f97316', '#8b5cf6', '#ef4444'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Detailed insights into your business performance</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="3months">Last 3 months</option>
            <option value="1year">Last year</option>
          </select>
          <button className="btn-outline inline-flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="card">
        <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'sales', label: 'Sales' },
            { key: 'inventory', label: 'Inventory' },
            { key: 'customers', label: 'Customers' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setReportType(tab.key)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
                reportType === tab.key
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Report */}
      {reportType === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: 'Total Revenue',
                value: `₹${dashboardData.totalSales.toLocaleString()}`,
                change: '+12.5%',
                changeType: 'positive' as const,
                icon: DollarSign,
                color: 'text-secondary-600'
              },
              {
                title: 'Total Orders',
                value: dashboardData.totalInvoices.toLocaleString(),
                change: '+8.2%',
                changeType: 'positive' as const,
                icon: FileText,
                color: 'text-primary-600'
              },
              {
                title: 'Active Customers',
                value: dashboardData.totalParties.toLocaleString(),
                change: '+15.3%',
                changeType: 'positive' as const,
                icon: Users,
                color: 'text-accent-600'
              },
              {
                title: 'Products Sold',
                value: dashboardData.totalProducts.toLocaleString(),
                change: '+3.1%',
                changeType: 'positive' as const,
                icon: Package,
                color: 'text-purple-600'
              }
            ].map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                      <div className="flex items-center mt-2">
                        {metric.changeType === 'positive' ? (
                          <TrendingUp className="w-4 h-4 text-secondary-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-error-500" />
                        )}
                        <span className={`text-sm font-medium ml-1 ${
                          metric.changeType === 'positive' ? 'text-secondary-600' : 'text-error-600'
                        }`}>
                          {metric.change}
                        </span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center ${metric.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData.salesChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products Distribution */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products by Revenue</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) => `${entry.name}: ₹${entry.value.toLocaleString()}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sales Report */}
      {reportType === 'sales' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Performance</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.salesChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Bar dataKey="sales" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Party</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.recentInvoices.slice(0, 10).map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.partyName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{invoice.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          invoice.status === 'paid' 
                            ? 'bg-secondary-100 text-secondary-800'
                            : invoice.status === 'sent'
                            ? 'bg-primary-100 text-primary-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for other report types */}
      {(reportType === 'inventory' || reportType === 'customers') && (
        <div className="card text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
          </h3>
          <p className="text-gray-500">
            This report section is coming soon. Stay tuned for detailed {reportType} analytics.
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;