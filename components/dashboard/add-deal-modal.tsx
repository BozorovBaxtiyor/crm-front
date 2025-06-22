import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { Deal } from './types';
import { Customer } from '@/components/customer-modal';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deal?: Deal | null;
  mode: 'add' | 'edit';
  customers: Customer[];
}

export function DealModal({ isOpen, onClose, onSave, deal, mode, customers }: DealModalProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<Deal['status']>('new');
  const [customerId, setCustomerId] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (deal && mode === 'edit') {
      setTitle(deal.title);
      setDescription(deal.description);
      setValue(deal.value.toString());
      setStatus(deal.status);
      setCustomerId(deal.customerId);
    } else {
      setTitle('');
      setDescription('');
      setValue('');
      setStatus('new');
      setCustomerId('');
    }
  }, [deal, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        title,
        description,
        value: Number(value),
        status,
        customerId: Number(customerId),
      });
      onClose();
    } catch (error) {
      console.error('Failed to save deal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {/* <DialogTitle>{mode === 'add' ? t('deals.addNew') : t('deals.edit')}</DialogTitle> */}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              id="title"
              placeholder={t('deals.title')}
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Textarea
              id="description"
              placeholder={t('deals.description')}
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              id="value"
              type="number"
              placeholder={t('deals.value')}
              value={value}
              onChange={e => setValue(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Select value={status} onValueChange={(val: Deal['status']) => setStatus(val)}>
              <SelectTrigger>
                <SelectValue placeholder={t('deals.selectStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">{t('dealStatus.new')}</SelectItem>
                <SelectItem value="in_progress">{t('dealStatus.in_progress')}</SelectItem>
                <SelectItem value="completed">{t('dealStatus.completed')}</SelectItem>
                <SelectItem value="cancelled">{t('dealStatus.cancelled')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Select value={customerId.toString()} onValueChange={val => setCustomerId(Number(val))}>
              <SelectTrigger>
                <SelectValue placeholder={t('deals.selectCustomer')} />
              </SelectTrigger>
              <SelectContent>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('common.saving') : t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
