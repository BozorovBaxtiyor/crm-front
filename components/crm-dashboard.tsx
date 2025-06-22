// /home/baxa/crm/crm-front/components/crm-dashboard.tsx
'use client';

import { Customer, CustomerModal } from '@/components/customer-modal';
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/language-context';
import { toast } from '@/hooks/use-toast';
import { fetchWithAuth } from '@/lib/api';
import { createActivity, getActivities } from '@/lib/api/activities';
import { getDashboardAnalytics, getSalesAnalytics } from '@/lib/api/analytics';
import { createDeal, deleteDeal, getDeals, updateDeal } from '@/lib/api/deals';
import { DollarSign, Target, TrendingUp, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ActivitiesTab } from './dashboard/activites-tab';
import { AddActivityModal } from './dashboard/add-activity-modal';
import { AnalyticsTab } from './dashboard/analytics-tab';
import { CustomersTab } from './dashboard/customers-tab';
import { DealsTab } from './dashboard/deals-tab';
import { Header } from './dashboard/header';
import { StatsCards } from './dashboard/stats-cards';
import {
  Activity,
  AnalyticsData,
  CRMDashboardProps,
  Deal,
  SalesAnalytics,
  Stat,
} from './dashboard/types';

export default function CRMDashboard({ onLogout }: CRMDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState('');
  const [salesAnalytics, setSalesAnalytics] = useState<SalesAnalytics | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [salesPeriod, setSalesPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>(
    'monthly',
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCustomersLoading, setIsCustomersLoading] = useState(true);
  const [customersError, setCustomersError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState<string | null>(null);
  // const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
  const [activityDescription, setActivityDescription] = useState('');
  const [activityType, setActivityType] = useState<'call' | 'email' | 'meeting' | 'deal'>('call');
  const [activityCustomerId, setActivityCustomerId] = useState<number | null>(null);
  const [activityCurrentPage, setActivityCurrentPage] = useState(1);
  const [activityTotalPages, setActivityTotalPages] = useState(1);
  const [dealsError, setDealsError] = useState('');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isDealsLoading, setIsDealsLoading] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [dealStatusFilter, setDealStatusFilter] = useState<string | null>(null);
  const [activeFeaturesTab, setActiveFeaturesTab] = useState(() => {
    if (typeof window !== 'undefined') {
      // URL dan tab qiymatini olish
      const tabFromUrl = searchParams.get('tab');
      if (tabFromUrl) {
        localStorage.setItem('activeTab', tabFromUrl);
        return tabFromUrl;
      }

      // LocalStorage dan olish
      const savedTab = localStorage.getItem('activeTab');
      return savedTab || 'customers';
    }
    return 'customers';
  });
  const [stats, setStats] = useState<Stat[]>([
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

  const handleTabChange = (value: string) => {
    setActiveFeaturesTab(value);
    localStorage.setItem('activeTab', value);

    // URL ni yangilash
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    router.push(url.pathname + url.search);
  };

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

  const getActivityTypeColor = (type: string) => {
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
  };

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

  const fetchCustomers = async (
    page = currentPage,
    searchQuery = searchTerm,
    status = statusFilter,
  ) => {
    setIsCustomersLoading(true);
    setCustomersError('');
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', itemsPerPage.toString());
      if (searchQuery) params.append('search', searchQuery);
      if (status) params.append('status', status);

      const response = await fetchWithAuth(`/customers?${params}`);
      setCustomers(response.data.customers);
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

  const fetchActivities = async (page = activityCurrentPage, type = activityTypeFilter) => {
    setIsActivitiesLoading(true);
    setActivitiesError('');
    try {
      const params: any = { page, limit: 10 };
      if (type) params.type = type;
      const response = await getActivities(params);
      setActivities(response.data.activities);
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

  const handleAddActivity = async () => {
    try {
      if (!activityDescription.trim() || !activityCustomerId) {
        toast({
          title: t('activities.validationError'),
          description: t('activities.fillAllFields'),
          variant: 'destructive',
        });
        return;
      }
      await createActivity({
        type: activityType,
        description: activityDescription,
        customerId: activityCustomerId,
      });
      toast({
        title: t('activities.addSuccess'),
        description: t('activities.activityAdded'),
      });
      setActivityDescription('');
      setActivityType('call');
      setActivityCustomerId(null);
      // setIsAddActivityModalOpen(false);
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

  const loadDashboardAnalytics = async () => {
    setAnalyticsLoading(true);
    setAnalyticsError('');
    try {
      const response = await getDashboardAnalytics();
      setAnalyticsData(response.data);
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

  const fetchDeals = async (page = currentPage, status = statusFilter) => {
    setIsDealsLoading(true);
    setDealsError('');
    try {
      const params: any = { page, limit: 10 };
      if (status) params.status = status;
      const response = await getDeals(params);
      setDeals(response.data.deals);
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
      setIsDealsLoading(false);
    }
  };

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
        await createDeal(dealData as Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>);
        toast({
          title: t('deals.saveSuccess'),
          description: t('deals.addSuccess'),
        });
      } else {
        const id = (dealData as Deal).id;
        await updateDeal(id, dealData as Partial<Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>>);
        toast({
          title: t('deals.saveSuccess'),
          description: t('deals.updateSuccess'),
        });
      }
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
        const response = await fetchWithAuth('/customers', {
          method: 'POST',
          body: JSON.stringify(customerData),
        });
        toast({
          title: t('customers.saveSuccess'),
          description: t('customers.addSuccess'),
        });
        fetchCustomers(1);
      } else {
        const id = (customerData as Customer).id;
        await fetchWithAuth(`/customers/${id}`, {
          method: 'PUT',
          body: JSON.stringify(customerData),
        });
        toast({
          title: t('customers.saveSuccess'),
          description: t('customers.updateSuccess'),
        });
        fetchCustomers(currentPage);
      }
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
        fetchCustomers(currentPage);
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
      await fetchWithAuth('/auth/logout', { method: 'POST' });
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      onLogout();
      toast({
        title: t('logout.success'),
        description: t('logout.successMessage'),
      });
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      onLogout();
      toast({
        title: t('logout.error'),
        description: t('logout.errorFallback'),
        variant: 'destructive',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    loadDashboardAnalytics();
    loadSalesAnalytics();
    fetchCustomers();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCustomers(1, searchTerm, statusFilter);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    if (activeFeaturesTab === 'deals') {
      fetchDeals();
    }
  }, [activeFeaturesTab]);

  useEffect(() => {
    if (activeFeaturesTab === 'deals') {
      const delayDebounce = setTimeout(() => {
        fetchDeals(1, statusFilter);
      }, 500);
      return () => clearTimeout(delayDebounce);
    }
  }, [statusFilter, activeFeaturesTab]);

  useEffect(() => {
    if (activeFeaturesTab === 'activities') {
      fetchActivities();
    }
  }, [activeFeaturesTab]);

  useEffect(() => {
    if (activeFeaturesTab === 'activities') {
      const delayDebounce = setTimeout(() => {
        fetchActivities(1, activityTypeFilter);
      }, 500);
      return () => clearTimeout(delayDebounce);
    }
  }, [activityTypeFilter, activeFeaturesTab]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onLogout={handleLogout} isLoggingOut={isLoggingOut} />
      <div className="p-6 space-y-6">
        <StatsCards stats={stats} analyticsLoading={analyticsLoading} />
        <Tabs value={activeFeaturesTab} className="space-y-6" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="customers">{t('tabs.customers')}</TabsTrigger>
            <TabsTrigger value="deals">{t('tabs.deals')}</TabsTrigger>
            <TabsTrigger value="activities">{t('tabs.activities')}</TabsTrigger>
            <TabsTrigger value="analytics">{t('tabs.analytics')}</TabsTrigger>
          </TabsList>
          <TabsContent value="customers">
            <CustomersTab
              customers={customers}
              isCustomersLoading={isCustomersLoading}
              customersError={customersError}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              currentPage={currentPage}
              totalPages={totalPages}
              fetchCustomers={fetchCustomers}
              handleAddCustomer={handleAddCustomer}
              handleEditCustomer={handleEditCustomer}
              handleDeleteCustomer={handleDeleteCustomer}
              getStatusColor={getStatusColor}
            />
          </TabsContent>
          <TabsContent value="deals">
            <DealsTab
              deals={deals}
              isDealsLoading={isDealsLoading}
              dealsError={dealsError}
              dealStatusFilter={dealStatusFilter}
              setDealStatusFilter={setDealStatusFilter}
              currentPage={currentPage}
              totalPages={totalPages}
              fetchDeals={fetchDeals}
              handleAddDeal={handleAddDeal}
              handleEditDeal={handleEditDeal}
              handleDeleteDeal={handleDeleteDeal}
              getStatusColor={getStatusColor}
              customers={customers}
            />
          </TabsContent>
          <TabsContent value="activities">
            <ActivitiesTab
              activities={activities}
              isActivitiesLoading={isActivitiesLoading}
              activitiesError={activitiesError}
              activityTypeFilter={activityTypeFilter}
              setActivityTypeFilter={setActivityTypeFilter}
              activityCurrentPage={activityCurrentPage}
              activityTotalPages={activityTotalPages}
              fetchActivities={fetchActivities}
              // setIsAddActivityModalOpen={setIsAddActivityModalOpen}
              getActivityTypeColor={getActivityTypeColor}
              formatActivityTime={formatActivityTime}
            />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsTab
              analyticsError={analyticsError}
              analyticsLoading={analyticsLoading}
              analyticsData={analyticsData}
              salesAnalytics={salesAnalytics}
              salesPeriod={salesPeriod}
              setSalesPeriod={setSalesPeriod}
              loadDashboardAnalytics={loadDashboardAnalytics}
              calculatePercentage={calculatePercentage}
              getTotalCustomers={getTotalCustomers}
            />
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
      {/* <AddActivityModal
        // isOpen={isAddActivityModalOpen}
        // onClose={() => setIsAddActivityModalOpen(false)}
        activityType={activityType}
        setActivityType={setActivityType}
        activityDescription={activityDescription}
        setActivityDescription={setActivityDescription}
        activityCustomerId={activityCustomerId}
        setActivityCustomerId={setActivityCustomerId}
        handleAddActivity={handleAddActivity}
        customers={customers}
      /> */}
    </div>
  );
}
