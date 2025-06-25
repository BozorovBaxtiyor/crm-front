// /home/baxa/crm/crm-front/components/dashboard/Header.tsx
import { ThemeLanguageSwitcher } from '@/components/theme-language-switcher';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { Building2, LogOut } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
  isLoggingOut: boolean;
}

export function Header({ onLogout, isLoggingOut }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="bg-white dark:bg-[#1e1e2d] border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.title')}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeLanguageSwitcher />
          <Button
            variant="outline"
            onClick={onLogout}
            className="bg-background"
            disabled={isLoggingOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isLoggingOut ? t('dashboard.loggingOut') : t('dashboard.logout')}
          </Button>
        </div>
      </div>
    </header>
  );
}
