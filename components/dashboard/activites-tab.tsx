// /home/baxa/crm/crm-front/components/dashboard/ActivitiesTab.tsx
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
} from 'lucide@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '@@/contexts/language-context';
import { Activity } from './types';
import { getActivityIcon } from '@/lib/utils';

interface ActivitiesTabProps {
  activities: Activity[];
  isActivitiesLoading: boolean;
  activitiesError: string;
  activityTypeFilter: string | null;
  setActivityTypeFilter: (value: string | null) => void;
  activityCurrentPage: number;
  activityTotalPages: number;
  fetchActivities: (page?: number, type?: string | null) => Promise<void>;
  setIsAddActivityModalOpen: (value: boolean) => void;
  getActivityTypeColor: (type: string) => string;
  formatActivityTime: (dateString: string) => string;
}

export function ActivitiesTab({
  activities,
  isActivitiesLoading,
  activitiesError,
  activityTypeFilter,
  setActivityTypeFilter,
  activityCurrentPage,
  activityTotalPages,
  fetchActivities,
  setIsAddActivityModalOpen,
  getActivityTypeColor,
  formatActivityTime,
}: ActivitiesTabProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
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
    </div>
  );
}
