// /home/baxa/crm/crm-front/components/dashboard/DealsTab.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/language-context';
import { DollarSign, RefreshCw, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Pagination } from './pagination';
import { Customer, Deal } from './types';

interface DealsTabProps {
  deals: Deal[];
  isDealsLoading: boolean;
  dealsError: string;
  dealStatusFilter: string | null;
  setDealStatusFilter: (value: string | null) => void;
  currentPage: number;
  totalPages: number;
  dealLimit?: number;
  setDealLimit: (limit: number) => void;
  fetchDeals: (page?: number, status?: string | null, limit?: number) => Promise<void>;
  handleAddDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  handleEditDeal: (deal: Deal) => void;
  handleDeleteDeal: (dealId: number) => Promise<void>;
  getStatusColor: (status: string) => string;
  customers: Customer[];
}

export function DealsTab({
  currentPage,
  deals,
  isDealsLoading,
  dealsError,
  dealStatusFilter,
  setDealStatusFilter,
  totalPages,
  fetchDeals,
  dealLimit,
  handleAddDeal,
  setDealLimit,
  handleDeleteDeal,
  handleEditDeal,
  customers,
}: DealsTabProps) {
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const handleAddNewDeal = () => {
    setSelectedDeal(null);
    setModalMode('add');
    setIsDealModalOpen(true);
  };

  const handleEditDealLocal = (deal: Deal) => {
    setSelectedDeal(deal);
    setModalMode('edit');
    setIsDealModalOpen(true);
  };
  const handleSaveLocal = async (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (modalMode === 'add') {
        await handleAddDeal(dealData);
      } else {
        await handleEditDeal({ ...dealData, id: selectedDeal!.id });
      }
      setIsDealModalOpen(false);
      fetchDeals(currentPage);
    } catch (error) {
      console.error('Failed to save deal:', error);
    }
  };
  const { t } = useLanguage();

  const getStatusColor = (status: Deal['status']): string => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'; // New deals for blue
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'; // In progress deals for yellow
      case 'completed':
        return 'bg-green-100 text-green-800'; // Completed deals for green
      case 'cancelled':
        return 'bg-red-100 text-red-800'; // Cancelled deals for red
      default:
        return 'bg-gray-100 text-gray-800'; // Default case for any unexpected status
    }
  };
  useEffect(() => {
    console.log('Current dealLimit:', dealLimit);
  }, [dealLimit]);

  return (
    <div className="space-y-6">
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
                      <h3 className="font-semibold text-gray-900 dark:text-white">{deal.title}</h3>
                      <Badge className={`${getStatusColor(deal.status)} ml-2`} variant="outline">
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
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t('deals.value')}</p>
                    </div>
                  </div>
                </div>
              ))}
              {/* TotalPages */}
              {totalPages >= 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  limit={dealLimit ?? 10}
                  limits={[10, 25, 50, 100]} // Limit variantlari
                  onPageChange={page => fetchDeals(page, null, dealLimit)}
                  onLimitChange={limit => {
                    console.log('Selected limit:', limit);
                    setDealLimit(limit);
                    fetchDeals(1, null, limit);
                  }}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
