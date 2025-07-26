import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  FileText,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { DashboardData } from '../types';
import dataService from '../services/dataService';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await dataService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Sales',
      value: `₹${dashboardData.totalSales.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-secondary-600'
    },
    {
      title: 'Total Invoices',
      value: dashboardData.totalInvoices.toLocaleString(),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: FileText,
      color: 'text-primary-600'
    },
    {
      title: 'Total Parties',
      value: dashboardData.totalParties.toLocaleString(),
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-accent-600'
    },
    {
      title: 'Products',
      value: dashboardData.totalProducts.toLocaleString(),
      change: '+3.1%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'text-purple-600'
    }
  ];

  const alerts = [
    {
      title: 'Low Stock Items',
      value: dashboardData.lowStockItems,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
      icon: AlertTriangle
    },
    {
      title: 'Outstanding Amount',
      value: `₹${dashboardData.outstandingAmount.toLocaleString()}`,
      color: 'text-error-600',
      bgColor: 'bg-error-50',
      icon: TrendingUp
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-primary-100">Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card hover:shadow-lg transition-all duration-200 animate-slide-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="w-4 h-4 text-secondary-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-error-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-secondary-600' : 'text-error-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      {(dashboardData.lowStockItems > 0 || dashboardData.outstandingAmount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alerts.map((alert, index) => {
            const Icon = alert.icon;
            return (
              <div key={index} className={`${alert.bgColor} rounded-xl p-4 border border-opacity-20`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${alert.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${alert.color}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${alert.color}`}>{alert.title}</h3>
                    <p className="text-lg font-bold text-gray-900">{alert.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
            <select className="text-sm border border-gray-300 rounded-md px-3 py-1">
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.salesChart}>
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
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#2563eb" 
                  fill="url(#colorSales)" 
                />
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']} />
                <Bar dataKey="sales" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.recentInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.customerName}
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
                        : invoice.status === 'overdue'
                        ? 'bg-error-100 text-error-800'
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
  );
};

export default Dashboard;