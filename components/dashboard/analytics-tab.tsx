// /home/baxa/crm/crm-front/components/dashboard/AnalyticsTab.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// Tooltip komponentlarini import qilishni unutmang
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/language-context';
import { BarChart3 } from 'lucide-react';
import { AnalyticsData, SalesAnalytics } from './types';

interface AnalyticsTabProps {
  analyticsError: string;
  analyticsLoading: boolean;
  analyticsData: AnalyticsData | null;
  salesAnalytics: SalesAnalytics | null;
  salesPeriod: 'daily' | 'weekly' | 'monthly' | 'yearly';
  setSalesPeriod: (value: 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
  loadDashboardAnalytics: () => Promise<void>;
  calculatePercentage: (value: number, total: number) => number;
  getTotalCustomers: (customersByStatus: {
    active: number;
    potential: number;
    waiting: number;
  }) => number;
}

export function AnalyticsTab({
  analyticsError,
  analyticsLoading,
  analyticsData,
  salesAnalytics,
  salesPeriod,
  setSalesPeriod,
  loadDashboardAnalytics,
  calculatePercentage,
  getTotalCustomers,
}: AnalyticsTabProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {analyticsError ? (
        <div className="text-center py-8">
          <p className="text-red-500">{analyticsError}</p>
          <Button onClick={loadDashboardAnalytics} className="mt-4">
            {t('common.tryAgain')}
          </Button>
        </div>
      ) : (
        <>
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
                  <div className="h-64 flex items-end pb-4 px-2">
                    {' '}
                    {/* items-end va padding qo'shildi */}
                    <TooltipProvider>
                      {' '}
                      {/* TooltipProvider qo'shildi */}
                      <div className="flex flex-1 justify-around items-end h-full gap-x-2">
                        {' '}
                        {/* gap-x-2 va items-end, flex-1 qo'shildi */}
                        {analyticsData.salesTrend.map((item, index) => (
                          <Tooltip key={index}>
                            {' '}
                            {/* Har bir bar uchun Tooltip */}
                            <TooltipTrigger asChild>
                              <div className="flex flex-col items-center justify-end h-full flex-grow mx-1">
                                {' '}
                                {/* mx-1 va flex-grow qo'shildi */}
                                <div
                                  className="bg-blue-600 w-8 rounded-t-sm" // rounded-t-sm qo'shildi
                                  style={{
                                    height: `${
                                      (item.sales /
                                        Math.max(...analyticsData.salesTrend.map(i => i.sales))) *
                                      200 // Maksimal balandlikni 200px da saqlaymiz
                                    }px`,
                                  }}
                                ></div>
                                <span className="text-xs mt-1 text-gray-600 font-medium">
                                  {item.month}
                                </span>{' '}
                                {/* Rang va font o'zgartirildi */}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-sm font-medium">
                                {t('analytics.sales')}: ${item.sales.toLocaleString()}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </TooltipProvider>
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
                    <div className="flex justify-between items-center">
                      <span>{t('status.potential')}</span>
                      <span className="font-semibold">
                        {calculatePercentage(
                          analyticsData?.customersByStatus.potential || 0,
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
                            analyticsData?.customersByStatus.potential || 0,
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
                    <div className="flex justify-between items-center">
                      <span>{t('status.waiting')}</span>
                      <span className="font-semibold">
                        {calculatePercentage(
                          analyticsData?.customersByStatus.waiting || 0,
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
                            analyticsData?.customersByStatus.waiting || 0,
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
    </div>
  );
}
