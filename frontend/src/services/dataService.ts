import { Invoice, Product, Party, Customer, BusinessSettings, DashboardData } from '../types';
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

  // Party methods
  async getParties(): Promise<Party[]> {
    const parties = storageService.getItem<Party[]>('parties') || [];
    return parties;
  }

  async saveParty(party: Party): Promise<void> {
    const parties = await this.getParties();
    const existingIndex = parties.findIndex(p => p.id === party.id);
    
    if (existingIndex >= 0) {
      parties[existingIndex] = party;
    } else {
      parties.push(party);
    }
    
    storageService.setItem('parties', parties);
    await storageService.saveToElectron('parties', parties);
  }

  async deleteParty(id: string): Promise<void> {
    const parties = await this.getParties();
    const filtered = parties.filter(p => p.id !== id);
    storageService.setItem('parties', filtered);
    await storageService.saveToElectron('parties', filtered);
  }

  // Keep backward compatibility methods
  async getCustomers(): Promise<Customer[]> {
    return this.getParties();
  }

  async saveCustomer(customer: Customer): Promise<void> {
    return this.saveParty(customer);
  }

  async deleteCustomer(id: string): Promise<void> {
    return this.deleteParty(id);
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
    const parties = await this.getParties();
    const products = await this.getProducts();

    // Update party totals based on invoices
    for (const party of parties) {
      const partyInvoices = invoices.filter(inv => inv.partyId === party.id);
      party.totalPurchases = partyInvoices.reduce((sum, inv) => sum + inv.total, 0);
      party.outstandingAmount = partyInvoices
        .filter(inv => inv.status !== 'paid')
        .reduce((sum, inv) => sum + inv.total, 0);
      
      if (partyInvoices.length > 0) {
        const latestInvoice = partyInvoices.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
        party.lastPurchaseDate = latestInvoice.date;
      }
    }

    // Save updated parties back to storage
    for (const party of parties) {
      await this.saveParty(party);
    }
    // Calculate totals
    const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalInvoices = invoices.length;
    const totalParties = parties.length;
    const totalProducts = products.length;
    const outstandingAmount = invoices
      .filter(inv => inv.status !== 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);
    const lowStockItems = products.filter(prod => prod.stock <= prod.minStock).length;

    // Recent invoices (last 10)
    const recentInvoices = invoices
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(invoice => ({
        ...invoice,
        customerName: invoice.partyName // For backward compatibility
      }));

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
      totalParties,
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