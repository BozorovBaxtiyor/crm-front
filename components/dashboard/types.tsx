// /home/baxa/crm/crm-front/components/dashboard/types.ts
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { LucideProps } from 'lucide-react';

export interface Customer {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'active' | 'potential' | 'waiting'; // string o'rniga aniq qiymatlar
  value: string;
}

export interface Deal {
  id: number;
  title: string;
  description: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled'; // string o'rniga aniq qiymatlar
  value: number;
  customer?: Customer;
  customerId: number; // Added missing property

  createdAt?: string;
  updatedAt?: string;
}



export interface Activity {
  id: number;
  type: string;
  description: string;
  createdAt: string;
  customer?: Customer;
}

export interface AnalyticsData {
  salesTrend: { period: string; sales: number }[];
  customersByStatus: { active: number; potential: number; waiting: number };
}

export interface SalesAnalytics {
  topCustomers: { customerName: string; totalValue: number }[];
}

export interface Stat {
  title: string;
  value: any;
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  change: string;
  color: string;
}

export interface CRMDashboardProps {
  onLogout: () => void;
}
