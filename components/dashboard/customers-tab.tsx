// /home/baxa/crm/crm-front/components/dashboard/CustomersTab.tsx
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
import { useLanguage } from '@/contexts/language-context';
import { Edit, Mail, Phone, Plus, RefreshCw, Search, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { Pagination } from './pagination';
import { Customer } from './types';

interface CustomersTabProps {
  customers: Customer[];
  isCustomersLoading: boolean;
  customersError: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string | null;
  setStatusFilter: (value: string | null) => void;
  currentPage: number;
  totalPages: number;
  fetchCustomers: (
    page?: number,
    searchQuery?: string,
    status?: string | null,
    limit?: number,
  ) => Promise<void>;
  handleAddCustomer: () => void;
  handleEditCustomer: (customer: Customer) => void;
  handleDeleteCustomer: (customer: Customer) => void;
  getStatusColor: (status: string) => string;
}

export function CustomersTab({
  customers,
  isCustomersLoading,
  customersError,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  currentPage,
  totalPages,
  fetchCustomers,
  handleAddCustomer,
  handleEditCustomer,
  handleDeleteCustomer,
  getStatusColor,
}: CustomersTabProps) {
  const [customerLimit, setCustomerLimit] = useState(10); // Default limit
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
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
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : customersError ? (
            <div className="text-center py-8">
              <p className="text-red-500">{customersError}</p>
              <Button onClick={() => fetchCustomers(currentPage)} className="mt-4">
                {t('common.tryAgain')}
              </Button>
            </div>
          ) : customers.length === 0 ? (
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
                      <p className="text-sm text-gray-600 dark:text-gray-400">{customer.company}</p>
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
              {totalPages >= 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  limit={customerLimit}
                  limits={[10, 25, 50, 100]} // Limit variantlari
                  onPageChange={page =>
                    fetchCustomers(page, searchTerm, statusFilter, customerLimit)
                  }
                  onLimitChange={limit => {
                    setCustomerLimit(limit);
                    fetchCustomers(currentPage, searchTerm, statusFilter, limit);
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
