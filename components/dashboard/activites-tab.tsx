// /home/baxa/crm/crm-front/components/dashboard/ActivitiesTab.tsx
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
import { getActivityIcon } from '@/lib/utils1';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  RefreshCw,
} from 'lucide-react'; 
import { Pagination } from './pagination';
import { Activity } from './types';

interface ActivitiesTabProps {
  activities: Activity[];
  isActivitiesLoading: boolean;
  activitiesError: string;
  activityTypeFilter: string | null;
  setActivityTypeFilter: (value: string | null) => void;
  activityCurrentPage: number;
  activityTotalPages: number;
  activityLimit?: number;
  setActivityLimit: (limit: number) => void;
  fetchActivities: (page?: number, type?: string | null, limit?: number) => Promise<void>;
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
  getActivityTypeColor,
  formatActivityTime,
  activityLimit,
  setActivityLimit,
}: ActivitiesTabProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex space-x-2 flex-1">
          <Select
            value={activityTypeFilter || 'all'}
            onValueChange={(val: string) => setActivityTypeFilter(val === 'all' ? null : val)}
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
              {activityTotalPages >= 1 && (
                <Pagination
                  currentPage={activityCurrentPage}
                  totalPages={activityTotalPages}
                  limit={activityLimit ?? 10}
                  limits={[10, 25, 50, 100]} // Limit variantlari
                  onPageChange={page => fetchActivities(page, null, activityLimit)}
                  onLimitChange={limit => {
                    setActivityLimit(limit);
                    fetchActivities(1, null, limit);
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
