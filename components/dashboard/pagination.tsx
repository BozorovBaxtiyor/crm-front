import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/language-context';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  limit: number;
  limits: number[]; // Masalan: [10, 25, 50, 100]
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  limit,
  limits,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-center space-x-2 pt-4">
      {/* Limit tanlash */}
      <Select value={limit.toString()} onValueChange={(val: string) => onLimitChange(Number(val))}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder={t('pagination.limit')} />
        </SelectTrigger>
        <SelectContent>
          {limits.map(l => (
            <SelectItem key={l} value={l.toString()}>
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Pagination tugmalari */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage <= 1}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          onPageChange(currentPage - 1);
          
        }}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm px-4">
        {t('pagination.page')} {currentPage} {t('pagination.of')} {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          onPageChange(currentPage + 1);
        }}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage >= totalPages}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
