// /home/baxa/crm/crm-front/components/dashboard/AddActivityModal.tsx
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from 'recharts';
import { useLanguage } from '@/contexts/language-context';
import { Customer } from './types';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityType: 'call' | 'email' | 'meeting' | 'deal';
  setActivityType: (value: 'call' | 'email' | 'meeting' | 'deal') => void;
  activityDescription: string;
  setActivityDescription: (value: string) => void;
  activityCustomerId: number | null;
  setActivityCustomerId: (value: number | null) => void;
  handleAddActivity: () => Promise<void>;
  customers: Customer[];
}

export function AddActivityModal({
  isOpen,
  onClose,
  activityType,
  setActivityType,
  activityDescription,
  setActivityDescription,
  activityCustomerId,
  setActivityCustomerId,
  handleAddActivity,
  customers,
}: AddActivityModalProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('activities.addNew')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t('activities.type')}</Label>
            <Select value={activityType} onValueChange={(value: any) => setActivityType(value)}>
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
            <Label className="text-right">{t('activities.description')}</Label>
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
            <Label className="text-right">{t('activities.customer')}</Label>
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
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleAddActivity}>{t('common.save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
