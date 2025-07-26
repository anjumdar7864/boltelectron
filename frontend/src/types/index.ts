export interface Invoice {
  id: string;
  invoiceNumber: string;
  partyId: string;
  partyName: string;
  partyEmail?: string;
  partyPhone?: string;
  partyAddress?: string;
  date: string;
  dueDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  discount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  gstNumber?: string;
  isGST: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  rate: number;
  taxRate: number;
  amount: number;
  hsnCode?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  category: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  maxStock?: number;
  taxRate: number;
  hsnCode?: string;
  expiryDate?: string;
  batchNumber?: string;
  serialNumber?: string;
  brand?: string;
  color?: string;
  size?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Party {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  gstNumber?: string;
  gstType?: 'unregistered' | 'consumer' | 'registered';
  state?: string;
  billingAddress?: string;
  shippingAddress?: string;
  enableShippingAddress?: boolean;
  creditLimit?: number;
  openingBalance?: number;
  asOfDate?: string;
  outstandingAmount: number;
  totalPurchases: number;
  lastPurchaseDate?: string;
  loyaltyPoints: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Keep Customer as alias for backward compatibility
export type Customer = Party;
export interface BusinessSettings {
  id: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  gstNumber?: string;
  logo?: string;
  invoicePrefix: string;
  invoiceCounter: number;
  taxRate: number;
  currency: string;
  theme: string;
  printerSettings: PrinterSettings;
}

export interface PrinterSettings {
  printerType: 'regular' | 'thermal';
  paperSize: 'A4' | 'A5' | '2inch' | '3inch' | '4inch';
  autoprint: boolean;
}

export interface SalesReport {
  totalSales: number;
  totalInvoices: number;
  averageOrderValue: number;
  topProducts: Array<{
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  salesByDate: Array<{
    date: string;
    sales: number;
    invoices: number;
  }>;
}

export interface DashboardData {
  totalSales: number;
  totalInvoices: number;
  totalParties: number;
  totalProducts: number;
  outstandingAmount: number;
  lowStockItems: number;
  recentInvoices: Invoice[];
  salesChart: Array<{
    date: string;
    sales: number;
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
  }>;
}