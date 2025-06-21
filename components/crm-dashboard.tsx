'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  DollarSign,
  Edit,
  LogOut,
  LucideProps,
  Mail,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Target,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes, useEffect, useState } from 'react';

import { CustomerModal, type Customer } from '@/components/customer-modal';
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal';
import { ThemeLanguageSwitcher } from '@/components/theme-language-switcher';
import { useLanguage } from '@/contexts/language-context';
import { toast } from '@/hooks/use-toast';
import { fetchWithAuth } from '@/lib/api';
import { getDashboardAnalytics, getSalesAnalytics } from '@/lib/api/analytics';
import { createDeal, deleteDeal, getDeals, updateDeal, type Deal } from '@/lib/api/deals';
import { CardContentComponent } from './ui/cardContent';
import { Activity, createActivity, getActivities } from '@/lib/api/activities';
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { DialogFooter, DialogHeader } from './ui/dialog';
import { Label } from 'recharts';
import { Textarea } from './ui/textarea';

interface CRMDashboardProps {
  onLogout: () => void;
}

export default function CRMDashboard({ onLogout }: CRMDashboardProps) {
  const calculatePercentage = (value: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const getTotalCustomers = (customersByStatus: {
    active: number;
    potential: number;
    waiting: number;
  }): number => {
    return customersByStatus.active + customersByStatus.potential + customersByStatus.waiting;
  };
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  interface SalesAnalytics {
    topCustomers: { customerName: string; totalValue: number }[];
  }

  const [salesAnalytics, setSalesAnalytics] = useState<SalesAnalytics | null>(null);
  const [analyticsError, setAnalyticsError] = useState('');
  interface AnalyticsData {
    salesTrend: { month: string; sales: number }[];
    customersByStatus: { active: number; potential: number; waiting: number };
  }

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [salesPeriod, setSalesPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>(
    'monthly',
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  // crm-dashboard.tsx faylida, state e'lonlari qismida qo'shing
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCustomersLoading, setIsCustomersLoading] = useState(true);
  const [customersError, setCustomersError] = useState('');

  // Pagination uchun
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState<string | null>(null);
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
  const [activityDescription, setActivityDescription] = useState('');
  const [activityType, setActivityType] = useState<'call' | 'email' | 'meeting' | 'deal'>('call');
  const [activityCustomerId, setActivityCustomerId] = useState<number | null>(null);
  const [activityCurrentPage, setActivityCurrentPage] = useState(1);
  const [activityTotalPages, setActivityTotalPages] = useState(1);

  const fetchActivities = async (page = activityCurrentPage, type = activityTypeFilter) => {
    setIsActivitiesLoading(true);
    setActivitiesError('');
    try {
      // Query parametrlarini tuzish
      const params: any = { page, limit: 10 };
      if (type) params.type = type;

      // API so'rovini yuborish
      const response = await getActivities(params);

      // Ma'lumotlarni state'ga saqlash
      setActivities(response.data.activities);

      // Pagination ma'lumotlarini saqlash (agar mavjud bo'lsa)
      if (response.data.pagination) {
        const pagination = response.data.pagination;
        setActivityCurrentPage(pagination.currentPage);
        setActivityTotalPages(pagination.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      setActivitiesError(t('activities.fetchError'));
      toast({
        title: t('activities.fetchError'),
        description: t('common.tryAgain'),
        variant: 'destructive',
      });
    } finally {
      setIsActivitiesLoading(false);
    }
  };

  // Yangi faoliyat qo'shish funksiyasi
  const handleAddActivity = async () => {
    try {
      // Validatsiya
      if (!activityDescription.trim() || !activityCustomerId) {
        toast({
          title: t('activities.validationError'),
          description: t('activities.fillAllFields'),
          variant: 'destructive',
        });
        return;
      }

      // API so'rovini yuborish
      await createActivity({
        type: activityType,
        description: activityDescription,
        customerId: activityCustomerId,
      });

      // Muvaffaqiyatli qo'shilgandan so'ng
      toast({
        title: t('activities.addSuccess'),
        description: t('activities.activityAdded'),
      });

      // Formani tozalash va modalni yopish
      setActivityDescription('');
      setActivityType('call');
      setActivityCustomerId(null);
      setIsAddActivityModalOpen(false);

      // Faoliyatlar ro'yxatini yangilash
      fetchActivities();
    } catch (error) {
      console.error('Failed to add activity:', error);
      toast({
        title: t('activities.addError'),
        description: t('common.tryAgain'),
        variant: 'destructive',
      });
    }
  };
  const [activeFeaturesTab, setActiveFeaturesTab] = useState('customers');

  // Component mount bo'lganda va tab o'zgarganda faoliyatlarni yuklash
  useEffect(() => {
    if (activeFeaturesTab === 'activities') {
      fetchActivities();
    }
  }, [activeFeaturesTab]);

  // Filter o'zgarganda faoliyatlarni qayta yuklash
  useEffect(() => {
    if (activeFeaturesTab === 'activities') {
      const delayDebounce = setTimeout(() => {
        fetchActivities(1, activityTypeFilter);
      }, 500);

      return () => clearTimeout(delayDebounce);
    }
  }, [activityTypeFilter, activeFeaturesTab]);

  // Vaqtni formatlash uchun yordamchi funksiya
  const formatActivityTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${t('time.minutesAgo')}`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${t('time.hoursAgo')}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} ${t('time.daysAgo')}`;
    }
  };

  // Faoliyat turi ikonkasi uchun yordamchi funksiya
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="w-4 h-4 text-blue-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'deal':
        return <DollarSign className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  // Mijozlarni backend'dan olish funksiyasi
  const fetchCustomers: (
    page?: number,
    searchQuery?: string,
    status?: string | null,
  ) => Promise<void> = async (
    page = currentPage,
    searchQuery = searchTerm,
    status = statusFilter,
  ) => {
    setIsCustomersLoading(true);
    setCustomersError('');
    try {
      // Query parametrlarini tuzish
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', itemsPerPage.toString());

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      if (status) {
        params.append('status', status);
      }

      // API so'rovini yuborish
      const response = await fetchWithAuth(`/customers?${params}`);

      // Ma'lumotlarni state'ga saqlash
      setCustomers(response.data.customers);

      // Pagination ma'lumotlarini saqlash
      const pagination = response.data.pagination;
      setCurrentPage(pagination.currentPage);
      setTotalPages(pagination.totalPages);
      setTotalItems(pagination.totalItems);
      setItemsPerPage(pagination.itemsPerPage);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      setCustomersError(t('customers.fetchError'));
      toast({
        title: t('customers.fetchError'),
        description: t('customers.tryAgain'),
        variant: 'destructive',
      });
    } finally {
      setIsCustomersLoading(false);
    }
  };
  const loadDashboardAnalytics = async () => {
    setAnalyticsLoading(true);
    setAnalyticsError('');
    try {
      const response = await getDashboardAnalytics();
      setAnalyticsData(response.data);

      // Statistikalarni yangilash
      const newStats = [
        {
          title: t('dashboard.customers'),
          value: response.data.totalCustomers.toLocaleString(),
          icon: Users,
          change: '+12%',
          color: 'text-blue-600',
        },
        {
          title: t('dashboard.sales'),
          value: `$${response.data.monthlySales.toLocaleString()}`,
          icon: DollarSign,
          change: '+8%',
          color: 'text-green-600',
        },
        {
          title: t('dashboard.deals'),
          value: response.data.activeDeals.toString(),
          icon: Target,
          change: '+23%',
          color: 'text-purple-600',
        },
        {
          title: t('dashboard.conversion'),
          value: `${response.data.conversionRate}%`,
          icon: TrendingUp,
          change: '+5%',
          color: 'text-orange-600',
        },
      ];

      setStats(newStats);
    } catch (error) {
      console.error('Analytics loading error:', error);
      setAnalyticsError(t('analytics.loadError'));
      toast({
        title: t('analytics.loadError'),
        description: t('analytics.tryAgain'),
        variant: 'destructive',
      });
    } finally {
      setAnalyticsLoading(false);
    }
  };
  function getActivityTypeColor(type: string) {
    switch (type) {
      case 'call':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'email':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'meeting':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'deal':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  }

  const loadSalesAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const response = await getSalesAnalytics({ period: salesPeriod });
      setSalesAnalytics(response.data);
    } catch (error) {
      console.error('Sales analytics loading error:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };
  const [dealsError, setDealsError] = useState('');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isDealsLoading, setIsDealsLoading] = useState(false);

  const fetchDeals = async (page = currentPage, status = statusFilter) => {
    setIsLoading(true);
    setDealsError('');
    try {
      // Build query params
      const params: any = { page, limit: 10 };
      if (status) params.status = status;

      // Make API request
      const response = await getDeals(params);

      // Update state with response data
      setDeals(response.data.deals);

      // Update pagination
      const pagination = response.data.pagination;
      setCurrentPage(pagination.currentPage);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch deals:', error);
      setDealsError(t('deals.fetchError'));
      toast({
        title: t('deals.fetchError'),
        description: t('common.tryAgain'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add useEffect to load deals when component mounts

  // Removed duplicate declaration of activeFeaturesTab


  useEffect(() => {
    if (activeFeaturesTab === 'deals') {
      fetchDeals();
    }
  }, [activeFeaturesTab]);

  useEffect(() => {
    loadDashboardAnalytics();
    loadSalesAnalytics();
    fetchCustomers(); // Mijozlarni yuklash
  }, []);

  useEffect(() => {
    // Qidiruv matnini terishda bir oz kechikish qilish
    const delayDebounce = setTimeout(() => {
      fetchCustomers(1, searchTerm, statusFilter);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, statusFilter]);

  // Add useEffect to reload deals when filter changes
  useEffect(() => {
    if (activeFeaturesTab === 'deals') {
      const delayDebounce = setTimeout(() => {
        fetchDeals(1, statusFilter);
      }, 500);

      return () => clearTimeout(delayDebounce);
    }
  }, [statusFilter, activeFeaturesTab]);

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [dealStatusFilter, setDealStatusFilter] = useState<string | null>(null);

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteDeal = async (dealId: number) => {
    try {
      await deleteDeal(dealId);
      toast({
        title: t('deals.deleteSuccess'),
        description: t('deals.wasDeleted'),
      });
      fetchDeals(currentPage);
    } catch (error) {
      console.error('Failed to delete deal:', error);
      toast({
        title: t('deals.deleteError'),
        description: t('common.tryAgain'),
        variant: 'destructive',
      });
    }
  };

  const handleSaveDeal = async (dealData: Deal | Omit<Deal, 'id'>) => {
    try {
      if (modalMode === 'add') {
        // Create new deal
        await createDeal(dealData as Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>);
        toast({
          title: t('deals.saveSuccess'),
          description: t('deals.addSuccess'),
        });
      } else {
        // Update existing deal
        const id = (dealData as Deal).id;
        await updateDeal(id, dealData as Partial<Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>>);
        toast({
          title: t('deals.saveSuccess'),
          description: t('deals.updateSuccess'),
        });
      }

      // Close modal and refresh deals
      setIsModalOpen(false);
      fetchDeals(currentPage);
    } catch (error) {
      console.error('Failed to save deal:', error);
      toast({
        title: t('deals.saveError'),
        description: t('common.tryAgain'),
        variant: 'destructive',
      });
    }
  };

  // Add active tab tracking
  const [stats, setStats] = useState([
    {
      title: t('dashboard.customers'),
      value: '0',
      icon: Users,
      change: '0%',
      color: 'text-blue-600',
    },
    {
      title: t('dashboard.sales'),
      value: '$0',
      icon: DollarSign,
      change: '0%',
      color: 'text-green-600',
    },
    {
      title: t('dashboard.deals'),
      value: '0',
      icon: Target,
      change: '0%',
      color: 'text-purple-600',
    },
    {
      title: t('dashboard.conversion'),
      value: '0%',
      icon: TrendingUp,
      change: '0%',
      color: 'text-orange-600',
    },
  ]);
  // function setStats(newStats: { title: string; value: any; icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>; change: string; color: string }[]) {
  //   throw new Error("Function not implemented.")
  // }

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const handleSaveCustomer = async (customerData: Omit<Customer, 'id'> | Customer) => {
    try {
      if (modalMode === 'add') {
        // Yangi mijoz qo'shish
        const response = await fetchWithAuth('/customers', {
          method: 'POST',
          body: JSON.stringify(customerData),
        });

        // Muvaffaqiyatli qo'shilgandan so'ng ro'yxatni yangilash
        toast({
          title: t('customers.saveSuccess'),
          description: t('customers.addSuccess'),
        });

        // Ro'yxatni yangilash (birinchi sahifaga qaytish)
        fetchCustomers(1);
      } else {
        // Mavjud mijozni yangilash
        const id = (customerData as Customer).id;
        await fetchWithAuth(`/customers/${id}`, {
          method: 'PUT',
          body: JSON.stringify(customerData),
        });

        toast({
          title: t('customers.saveSuccess'),
          description: t('customers.updateSuccess'),
        });

        // Joriy sahifani qayta yuklash
        fetchCustomers(currentPage);
      }

      // Modalni yopish
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save customer:', error);
      toast({
        title: t('customers.saveError'),
        description: t('customers.tryAgain'),
        variant: 'destructive',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedCustomer) {
      try {
        await fetchWithAuth(`/customers/${selectedCustomer.id}`, {
          method: 'DELETE',
        });

        toast({
          title: t('customers.deleteSuccess'),
          description: `${selectedCustomer.name} ${t('customers.wasDeleted')}`,
        });

        // Ro'yxatni yangilash
        fetchCustomers(currentPage);

        // Modalni yopish
        setIsDeleteModalOpen(false);
        setSelectedCustomer(null);
      } catch (error) {
        console.error('Failed to delete customer:', error);
        toast({
          title: t('customers.deleteError'),
          description: t('customers.tryAgain'),
          variant: 'destructive',
        });
      }
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call the logout API endpoint
      await fetchWithAuth('/auth/logout', { method: 'POST' });

      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');

      // Update state
      onLogout();

      // Optional: Show success message
      toast({
        title: t('logout.success'),
        description: t('logout.successMessage'),
      });
    } catch (error) {
      console.error('Logout error:', error);

      // Still logout the user locally even if the API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      onLogout();

      // Optional: Show error message
      toast({
        title: t('logout.error'),
        description: t('logout.errorFallback'),
        variant: 'destructive',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const recentActivities = [
    {
      id: 1,
      type: 'call',
      description: "Alisher Karimov bilan qo'ng'iroq",
      time: '10 daqiqa oldin',
    },
    {
      id: 2,
      type: 'email',
      description: 'Malika Toshevaga taklif yuborildi',
      time: '1 soat oldin',
    },
    {
      id: 3,
      type: 'meeting',
      description: 'Bobur Rahimov bilan uchrashuv',
      time: '2 soat oldin',
    },
    {
      id: 4,
      type: 'deal',
      description: 'Yangi kelishuv yaratildi - $15,000',
      time: '3 soat oldin',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'potential':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const filteredCustomers = customers.filter(
    customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('dashboard.title')}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeLanguageSwitcher />
            <Button
              variant="outline"
              onClick={async () => await handleLogout()}
              className="bg-background"
              disabled={isLoggingOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLoggingOut ? t('dashboard.loggingOut') : t('dashboard.logout')}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Cards - update the change text */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContentComponent loading={analyticsLoading} item={stat} index={index} />
            </Card>
          ))}
        </div>

        <Tabs defaultValue="customers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="customers">{t('tabs.customers')}</TabsTrigger>
            <TabsTrigger value="deals">{t('tabs.deals')}</TabsTrigger>
            <TabsTrigger value="activities">{t('tabs.activities')}</TabsTrigger>
            <TabsTrigger value="analytics">{t('tabs.analytics')}</TabsTrigger>
          </TabsList>
          {/* Customer Tab */}
          <TabsContent value="customers" className="space-y-6">
            {/* Search and Add Customer */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('customers.search')}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddCustomer}>
                <Plus className="w-4 h-4 mr-2" />
                {t('customers.addNew')}
              </Button>
            </div>

            {/* Customers Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t('customers.list')}</CardTitle>
                  <CardDescription>{t('customers.manage')}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    value={statusFilter || 'all'}
                    onValueChange={val => setStatusFilter(val === 'all' ? null : val)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={t('customers.filterByStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('customers.allStatuses')}</SelectItem>
                      <SelectItem value="active">{t('status.active')}</SelectItem>
                      <SelectItem value="potential">{t('status.potential')}</SelectItem>
                      <SelectItem value="waiting">{t('status.waiting')}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={() => fetchCustomers(currentPage)}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {isCustomersLoading ? (
                  // Loading holati
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : customersError ? (
                  // Xatolik holati
                  <div className="text-center py-8">
                    <p className="text-red-500">{customersError}</p>
                    <Button onClick={() => fetchCustomers(currentPage)} className="mt-4">
                      {t('common.tryAgain')}
                    </Button>
                  </div>
                ) : customers.length === 0 ? (
                  // Bo'sh ro'yxat holati
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium">{t('customers.noCustomers')}</h3>
                    <p className="text-gray-500">{t('customers.addYourFirst')}</p>
                    <Button className="mt-4" onClick={handleAddCustomer}>
                      <Plus className="w-4 h-4 mr-2" />
                      {t('customers.addNew')}
                    </Button>
                  </div>
                ) : (
                  // Mijozlar ro'yxati
                  <div className="space-y-4">
                    {customers.map(customer => (
                      <div
                        key={customer.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={`/image.png?height=40&width=40`} />
                            <AvatarFallback>
                              {customer.name
                                .split(' ')
                                .map(n => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {customer.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {customer.company}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <Mail className="w-3 h-3 mr-1" />
                                {customer.email}
                              </div>
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <Phone className="w-3 h-3 mr-1" />
                                {customer.phone}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={getStatusColor(customer.status)}>
                            {t(`status.${customer.status}`)}
                          </Badge>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {customer.value}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {t('customers.value')}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCustomer(customer)}
                              className="bg-background"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCustomer(customer)}
                              className="bg-background text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center space-x-2 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchCustomers(1)}
                          disabled={currentPage <= 1}
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchCustomers(currentPage - 1)}
                          disabled={currentPage <= 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <span className="text-sm px-4">
                          {t('pagination.page')} {currentPage} {t('pagination.of')} {totalPages}
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchCustomers(currentPage + 1)}
                          disabled={currentPage >= totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchCustomers(totalPages)}
                          disabled={currentPage >= totalPages}
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {/* Deals Tab */}
          <TabsContent value="deals" className="space-y-6">
            {/* Search and Add Deal */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex space-x-2 flex-1">
                <Select
                  value={dealStatusFilter || 'all'}
                  onValueChange={val => setDealStatusFilter(val === 'all' ? null : val)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={t('deals.filterByStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('deals.allStatuses')}</SelectItem>
                    <SelectItem value="new">{t('dealStatus.new')}</SelectItem>
                    <SelectItem value="in_progress">{t('dealStatus.in_progress')}</SelectItem>
                    <SelectItem value="completed">{t('dealStatus.completed')}</SelectItem>
                    <SelectItem value="cancelled">{t('dealStatus.cancelled')}</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={() => fetchDeals(currentPage)}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddDeal}>
                <Plus className="w-4 h-4 mr-2" />
                {t('deals.addNew')}
              </Button>
            </div>

            {/* Deals List */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t('deals.list')}</CardTitle>
                  <CardDescription>{t('deals.manage')}</CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                {isDealsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : dealsError ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">{dealsError}</p>
                    <Button onClick={() => fetchDeals(currentPage)} className="mt-4">
                      {t('common.tryAgain')}
                    </Button>
                  </div>
                ) : deals.length === 0 ? (
                  <div className="text-center py-12">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium">{t('deals.noDeals')}</h3>
                    <p className="text-gray-500">{t('deals.addYourFirst')}</p>
                    <Button className="mt-4" onClick={handleAddDeal}>
                      <Plus className="w-4 h-4 mr-2" />
                      {t('deals.addNew')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deals.map(deal => (
                      <div
                        key={deal.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700"
                      >
                        <div className="mb-3 sm:mb-0">
                          <div className="flex items-center">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {deal.title}
                            </h3>
                            <Badge
                              className={`${getStatusColor(deal.status)} ml-2`}
                              variant="outline"
                            >
                              {t(`dealStatus.${deal.status}`)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {deal.description}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <Users className="w-3 h-3 mr-1" />
                            {deal.customer?.name || t('deals.noCustomer')}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                          <div className="text-right sm:mr-6">
                            <p className="font-semibold text-lg text-green-600">
                              ${deal.value.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {t('deals.value')}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditDeal(deal)}
                              className="bg-background"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteDeal(deal.id)}
                              className="bg-background text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center space-x-2 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchDeals(1)}
                          disabled={currentPage <= 1}
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchDeals(currentPage - 1)}
                          disabled={currentPage <= 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <span className="text-sm px-4">
                          {t('pagination.page')} {currentPage} {t('pagination.of')} {totalPages}
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchDeals(currentPage + 1)}
                          disabled={currentPage >= totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchDeals(totalPages)}
                          disabled={currentPage >= totalPages}
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex space-x-2 flex-1">
                <Select
                  value={activityTypeFilter || 'all'}
                  onValueChange={val => setActivityTypeFilter(val === 'all' ? null : val)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={t('activities.filterByType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('activities.allTypes')}</SelectItem>
                    <SelectItem value="call">{t('activityType.call')}</SelectItem>
                    <SelectItem value="email">{t('activityType.email')}</SelectItem>
                    <SelectItem value="meeting">{t('activityType.meeting')}</SelectItem>
                    <SelectItem value="deal">{t('activityType.deal')}</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={() => fetchActivities(activityCurrentPage)}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsAddActivityModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('activities.addNew')}
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t('activities.list')}</CardTitle>
                <CardDescription>{t('activities.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                {isActivitiesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : activitiesError ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">{activitiesError}</p>
                    <Button onClick={() => fetchActivities(activityCurrentPage)} className="mt-4">
                      {t('common.tryAgain')}
                    </Button>
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium">{t('activities.noActivities')}</h3>
                    <p className="text-gray-500">{t('activities.addYourFirst')}</p>
                    <Button className="mt-4" onClick={() => setIsAddActivityModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      {t('activities.addNew')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map(activity => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700"
                      >
                        <div className="p-2 bg-blue-100 rounded-full">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {activity.description}
                          </p>
                          {activity.customer && (
                            <p className="text-sm text-blue-600">{activity.customer.name}</p>
                          )}
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatActivityTime(activity.createdAt)}
                          </p>
                        </div>
                        <Badge className={getActivityTypeColor(activity.type)}>
                          {t(`activityType.${activity.type}`)}
                        </Badge>
                      </div>
                    ))}

                    {/* Pagination */}
                    {activityTotalPages > 1 && (
                      <div className="flex items-center justify-center space-x-2 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchActivities(1)}
                          disabled={activityCurrentPage <= 1}
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchActivities(activityCurrentPage - 1)}
                          disabled={activityCurrentPage <= 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <span className="text-sm px-4">
                          {t('pagination.page')} {activityCurrentPage} {t('pagination.of')}{' '}
                          {activityTotalPages}
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchActivities(activityCurrentPage + 1)}
                          disabled={activityCurrentPage >= activityTotalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchActivities(activityTotalPages)}
                          disabled={activityCurrentPage >= activityTotalPages}
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <Dialog open={isAddActivityModalOpen} onOpenChange={setIsAddActivityModalOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{t('activities.addNew')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label  className="text-right">
                    {t('activities.type')}
                  </Label>
                  <Select
                    value={activityType}
                    onValueChange={(value: any) => setActivityType(value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={t('activities.selectType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">{t('activityType.call')}</SelectItem>
                      <SelectItem value="email">{t('activityType.email')}</SelectItem>
                      <SelectItem value="meeting">{t('activityType.meeting')}</SelectItem>
                      <SelectItem value="deal">{t('activityType.deal')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label  className="text-right">
                    {t('activities.description')}
                  </Label>
                  <Textarea
                    id="activity-description"
                    value={activityDescription}
                    onChange={e => setActivityDescription(e.target.value)}
                    className="col-span-3"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label  className="text-right">
                    {t('activities.customer')}
                  </Label>
                  <Select
                    value={activityCustomerId?.toString() || ''}
                    onValueChange={value => setActivityCustomerId(parseInt(value))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={t('activities.selectCustomer')} />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.name} ({customer.company})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setIsAddActivityModalOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleAddActivity}>{t('common.save')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {analyticsError ? (
              <div className="text-center py-8">
                <p className="text-red-500">{analyticsError}</p>
                <Button onClick={loadDashboardAnalytics} className="mt-4">
                  {t('common.tryAgain')}
                </Button>
              </div>
            ) : (
              <>
                {/* Sotuvlar davri tanlash */}
                <div className="flex justify-end mb-4">
                  <Select value={salesPeriod} onValueChange={(value: any) => setSalesPeriod(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Davr" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">{t('analytics.daily')}</SelectItem>
                      <SelectItem value="weekly">{t('analytics.weekly')}</SelectItem>
                      <SelectItem value="monthly">{t('analytics.monthly')}</SelectItem>
                      <SelectItem value="yearly">{t('analytics.yearly')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Oylik Sotuv Trendi */}
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('analytics.salesTrend')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analyticsLoading ? (
                        <div className="h-64 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      ) : analyticsData &&
                        analyticsData.salesTrend &&
                        analyticsData.salesTrend.length > 0 ? (
                        <div className="h-64">
                          {/* Bu yerga chart kutubxonasi yordamida grafikni chizish mumkin */}
                          <div className="h-full flex flex-col justify-end space-y-2">
                            <div className="flex justify-between">
                              {analyticsData.salesTrend.map((item, index) => (
                                <div key={index} className="flex flex-col items-center">
                                  <div
                                    className="bg-blue-600 w-8"
                                    style={{
                                      height: `${
                                        (item.sales /
                                          Math.max(...analyticsData.salesTrend.map(i => i.sales))) *
                                        200
                                      }px`,
                                    }}
                                  ></div>
                                  <span className="text-xs mt-1">{item.month}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                          <div className="text-center">
                            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">{t('analytics.noData')}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Mijozlar Taqsimoti */}
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('analytics.customerDistribution')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analyticsLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Faol mijozlar */}
                          <div className="flex justify-between items-center">
                            <span>{t('status.active')}</span>
                            <span className="font-semibold">
                              {calculatePercentage(
                                analyticsData?.customersByStatus.active || 0,
                                getTotalCustomers(
                                  analyticsData?.customersByStatus || {
                                    active: 0,
                                    potential: 0,
                                    waiting: 0,
                                  },
                                ),
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{
                                width: `${calculatePercentage(
                                  analyticsData?.customersByStatus.active || 0,
                                  getTotalCustomers(
                                    analyticsData?.customersByStatus || {
                                      active: 0,
                                      potential: 0,
                                      waiting: 0,
                                    },
                                  ),
                                )}%`,
                              }}
                            ></div>
                          </div>

                          {/* Potensial mijozlar */}
                          <div className="flex justify-between items-center">
                            <span>{t('status.potential')}</span>
                            <span className="font-semibold">
                              {calculatePercentage(
                                analyticsData?.customersByStatus.active || 0,
                                getTotalCustomers(
                                  analyticsData?.customersByStatus || {
                                    active: 0,
                                    potential: 0,
                                    waiting: 0,
                                  },
                                ),
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${calculatePercentage(
                                  analyticsData?.customersByStatus.active || 0,
                                  getTotalCustomers(
                                    analyticsData?.customersByStatus || {
                                      active: 0,
                                      potential: 0,
                                      waiting: 0,
                                    },
                                  ),
                                )}%`,
                              }}
                            ></div>
                          </div>

                          {/* Kutilayotgan mijozlar */}
                          <div className="flex justify-between items-center">
                            <span>{t('status.waiting')}</span>
                            <span className="font-semibold">
                              {calculatePercentage(
                                analyticsData?.customersByStatus.active || 0,
                                getTotalCustomers(
                                  analyticsData?.customersByStatus || {
                                    active: 0,
                                    potential: 0,
                                    waiting: 0,
                                  },
                                ),
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-600 h-2 rounded-full"
                              style={{
                                width: `${calculatePercentage(
                                  analyticsData?.customersByStatus.active || 0,
                                  getTotalCustomers(
                                    analyticsData?.customersByStatus || {
                                      active: 0,
                                      potential: 0,
                                      waiting: 0,
                                    },
                                  ),
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Top Customers Card */}
                {salesAnalytics &&
                  salesAnalytics.topCustomers &&
                  salesAnalytics.topCustomers.length > 0 && (
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>{t('analytics.topCustomers')}</CardTitle>
                        <CardDescription>{t('analytics.mostValuable')}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {salesAnalytics.topCustomers.map((customer, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                  <span className="font-bold">{index + 1}</span>
                                </div>
                                <div>
                                  <p className="font-semibold">{customer.customerName}</p>
                                </div>
                              </div>
                              <div>
                                <p className="font-bold text-green-600">
                                  ${customer.totalValue.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomer}
        customer={selectedCustomer}
        mode={modalMode}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        customerName={selectedCustomer?.name || ''}
      />
    </div>
  );
}
function setStats(
  newStats: {
    title: string;
    value: any;
    icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
    change: string;
    color: string;
  }[],
) {
  throw new Error('Function not implemented.');
}
