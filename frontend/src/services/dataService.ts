import { Invoice, Product, Customer, BusinessSettings, DashboardData } from '../types';
import storageService from './storage';

class DataService {
  // Invoice methods
  async getInvoices(): Promise<Invoice[]> {
    const invoices = storageService.getItem<Invoice[]>('invoices') || [];
    return invoices;
  }

  async saveInvoice(invoice: Invoice): Promise<void> {
    const invoices = await this.getInvoices();
    const existingIndex = invoices.findIndex(inv => inv.id === invoice.id);
    
    if (existingIndex >= 0) {
      invoices[existingIndex] = invoice;
    } else {
      invoices.push(invoice);
    }
    
    storageService.setItem('invoices', invoices);
    await storageService.saveToElectron('invoices', invoices);
  }

  async deleteInvoice(id: string): Promise<void> {
    const invoices = await this.getInvoices();
    const filtered = invoices.filter(inv => inv.id !== id);
    storageService.setItem('invoices', filtered);
    await storageService.saveToElectron('invoices', filtered);
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    const products = storageService.getItem<Product[]>('products') || [];
    return products;
  }

  async saveProduct(product: Product): Promise<void> {
    const products = await this.getProducts();
    const existingIndex = products.findIndex(prod => prod.id === product.id);
    
    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      products.push(product);
    }
    
    storageService.setItem('products', products);
    await storageService.saveToElectron('products', products);
  }

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    const filtered = products.filter(prod => prod.id !== id);
    storageService.setItem('products', filtered);
    await storageService.saveToElectron('products', filtered);
  }

  // Customer methods
  async getCustomers(): Promise<Customer[]> {
    const customers = storageService.getItem<Customer[]>('customers') || [];
    return customers;
  }

  async saveCustomer(customer: Customer): Promise<void> {
    const customers = await this.getCustomers();
    const existingIndex = customers.findIndex(cust => cust.id === customer.id);
    
    if (existingIndex >= 0) {
      customers[existingIndex] = customer;
    } else {
      customers.push(customer);
    }
    
    storageService.setItem('customers', customers);
    await storageService.saveToElectron('customers', customers);
  }

  async deleteCustomer(id: string): Promise<void> {
    const customers = await this.getCustomers();
    const filtered = customers.filter(cust => cust.id !== id);
    storageService.setItem('customers', filtered);
    await storageService.saveToElectron('customers', filtered);
  }

  // Business settings
  async getBusinessSettings(): Promise<BusinessSettings> {
    const settings = storageService.getItem<BusinessSettings>('businessSettings');
    
    if (!settings) {
      const defaultSettings: BusinessSettings = {
        id: '1',
        businessName: 'My Business',
        businessAddress: '',
        businessPhone: '',
        businessEmail: '',
        gstNumber: '',
        logo: '',
        invoicePrefix: 'INV',
        invoiceCounter: 1,
        taxRate: 18,
        currency: 'INR',
        theme: 'default',
        printerSettings: {
          printerType: 'regular',
          paperSize: 'A4',
          autoprint: false
        }
      };
      
      await this.saveBusinessSettings(defaultSettings);
      return defaultSettings;
    }
    
    return settings;
  }

  async saveBusinessSettings(settings: BusinessSettings): Promise<void> {
    storageService.setItem('businessSettings', settings);
    await storageService.saveToElectron('businessSettings', settings);
  }

  // Dashboard data
  async getDashboardData(): Promise<DashboardData> {
    const invoices = await this.getInvoices();
    const customers = await this.getCustomers();
    const products = await this.getProducts();

    // Calculate totals
    const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalInvoices = invoices.length;
    const totalCustomers = customers.length;
    const totalProducts = products.length;
    const outstandingAmount = invoices
      .filter(inv => inv.status !== 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);
    const lowStockItems = products.filter(prod => prod.stock <= prod.minStock).length;

    // Recent invoices (last 10)
    const recentInvoices = invoices
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    // Sales chart data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const salesChart = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const daySales = invoices
        .filter(inv => inv.date === dateStr)
        .reduce((sum, inv) => sum + inv.total, 0);
        
      salesChart.push({
        date: dateStr,
        sales: daySales
      });
    }

    // Top products by sales
    const productSales: { [key: string]: { name: string; sales: number } } = {};
    
    invoices.forEach(invoice => {
      invoice.items.forEach(item => {
        if (productSales[item.productId]) {
          productSales[item.productId].sales += item.amount;
        } else {
          productSales[item.productId] = {
            name: item.name,
            sales: item.amount
          };
        }
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    return {
      totalSales,
      totalInvoices,
      totalCustomers,
      totalProducts,
      outstandingAmount,
      lowStockItems,
      recentInvoices,
      salesChart,
      topProducts
    };
  }

  // Sync with server
  async syncData(): Promise<boolean> {
    return await storageService.syncData();
  }
}

export default new DataService();