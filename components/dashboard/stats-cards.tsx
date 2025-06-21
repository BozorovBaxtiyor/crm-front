// /home/baxa/crm/crm-front/components/dashboard/StatsCards.tsx
import { Card } from '@/components/ui/card';
import { CardContentComponent } from '@/components/ui/cardContent';
import { Stat } from './types';

interface StatsCardsProps {
  stats: Stat[];
  analyticsLoading: boolean;
}

export function StatsCards({ stats, analyticsLoading }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContentComponent loading={analyticsLoading} item={stat} index={index} />
        </Card>
      ))}
    </div>
  );
}
