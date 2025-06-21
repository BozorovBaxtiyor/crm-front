// /home/baxa/crm/crm-front/components/dashboard/DealsTab.tsx
import { useState } from 'react';
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
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, DollarSign, Edit, Plus, RefreshCw, Trash2, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { Deal } from './types';

interface DealsTabProps {
  deals: Deal[];
  isDealsLoading: boolean;
  dealsError: string;
  dealStatusFilter: string | null;
  setDealStatusFilter: (value: string | null) => void;
  currentPage: number;
  totalPages: number;
  fetchDeals: (page?: number, status?: string | null) => Promise<void>;
  handleAddDeal: () => void;
  handleEditDeal: (deal: Deal) => void;
  handleDeleteDeal: (dealId: number) => Promise<void>;
  getStatusColor: (status: string) => string;
}

export function DealsTab({
  deals,
  isDealsLoading,
  dealsError,
  dealStatusFilter,
  setDealStatusFilter,
  currentPage,
  totalPages,
  fetchDeals,
  handleAddDeal,
  handleEditDeal,
  handleDeleteDeal,
  getStatusColor,
}: DealsTabProps) {
  const { t } = useLanguage();

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
                        className="bg-background">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDeal(deal.id)}
                        className="bg-background text-red-600 hover:text-red-blue700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {/* TotalPages */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center space-x-sm2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchDeals(deals1)}
                      disabled={page <= currentPage1}
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
                      {t('pagination')} {currentPage} {t('pagination.of')} {totalPages}
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
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}