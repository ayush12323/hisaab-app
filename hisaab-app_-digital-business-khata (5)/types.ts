
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  date: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export interface Udhaar {
  id: string;
  customerName: string;
  amount: number;
  date: string;
  status: 'pending' | 'settled';
}

export interface BulkOffer {
  id: string;
  name: string;
  unit: string;
  bulkPrice: number;
  mrp: number;
  minQty: number;
  savings: number;
  category: string;
  distance: string;
  sellerPhone: string;
}

export interface User {
  email: string;
  name?: string;
}

export interface BusinessInsight {
  summary: string;
  recommendations: string[];
  trend: 'up' | 'down' | 'stable';
}

export type ViewMode = 'auth' | 'onboarding' | 'dashboard' | 'sales' | 'expenses' | 'khata' | 'inventory' | 'profile' | 'reports' | 'market';

export interface ShopDetails {
  name: string;
  owner: string;
  phone: string;
}
