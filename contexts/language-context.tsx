"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "uz" | "ru" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
   uz: {
    "dashboard.title": "CRM Tizimi",
    "dashboard.logout": "Chiqish",
    "dashboard.loggingOut": "Chiqilmoqda...",
    "dashboard.customers": "Mijozlar",
    "dashboard.sales": "Sotuvlar",
    "dashboard.deals": "Bitimlar",
    "dashboard.conversion": "Konversiya",

    "tabs.customers": "Mijozlar",
    "tabs.deals": "Bitimlar",
    "tabs.activities": "Faoliyatlar",
    "tabs.analytics": "Tahlil",

    "customers.search": "Mijozlarni qidiring...",
    "customers.addNew": "Yangi mijoz qo‘shish",
    "customers.list": "Mijozlar ro‘yxati",
    "customers.manage": "Mijozlarni ko‘rish va boshqarish",
    "customers.filterByStatus": "Status bo‘yicha filtrlash",
    "customers.allStatuses": "Barcha statuslar",
    "customers.fetchError": "Mijozlarni yuklashda xatolik",
    "customers.tryAgain": "Iltimos, qayta urinib ko‘ring",
    "customers.noCustomers": "Mijozlar topilmadi",
    "customers.addYourFirst": "Boshlash uchun birinchi mijozingizni qo‘shing",
    "customers.value": "Mijoz qiymati",
    "customers.saveSuccess": "Mijoz saqlandi",
    "customers.addSuccess": "Mijoz muvaffaqiyatli qo‘shildi",
    "customers.updateSuccess": "Mijoz muvaffaqiyatli yangilandi",
    "customers.saveError": "Mijozni saqlashda xatolik",
    "customers.deleteSuccess": "Mijoz o‘chirildi",
    "customers.wasDeleted": "muvaffaqiyatli o‘chirildi",
    "customers.deleteError": "Mijozni o‘chirishda xatolik",

    "status.active": "Faol",
    "status.potential": "Potensial",
    "status.waiting": "Kutilmoqda",

    "deals.addNew": "Yangi bitim qo‘shish",
    "deals.list": "Bitimlar ro‘yxati",
    "deals.manage": "Bitimlarni ko‘rish va boshqarish",
    "deals.filterByStatus": "Status bo‘yicha filtrlash",
    "deals.allStatuses": "Barcha statuslar",
    "deals.fetchError": "Bitimlarni yuklashda xatolik",
    "deals.noDeals": "Bitimlar topilmadi",
    "deals.addYourFirst": "Boshlash uchun birinchi bitimingizni qo‘shing",
    "deals.value": "Bitim qiymati",
    "deals.noCustomer": "Mijoz biriktirilmagan",
    "deals.saveSuccess": "Bitim saqlandi",
    "deals.addSuccess": "Bitim muvaffaqiyatli qo‘shildi",
    "deals.updateSuccess": "Bitim muvaffaqiyatli yangilandi",
    "deals.saveError": "Bitimni saqlashda xatolik",
    "deals.deleteSuccess": "Bitim o‘chirildi",
    "deals.wasDeleted": "Bitim muvaffaqiyatli o‘chirildi",
    "deals.deleteError": "Bitimni o‘chirishda xatolik",

    "dealStatus.new": "Yangi",
    "dealStatus.in_progress": "Jarayonda",
    "dealStatus.completed": "Yakunlangan",
    "dealStatus.cancelled": "Bekor qilingan",

    "activities.addNew": "Yangi faoliyat qo‘shish",
    "activities.list": "Faoliyatlar ro‘yxati",
    "activities.description": "Mijozlar bilan aloqalarni kuzating",
    "activities.filterByType": "Turi bo‘yicha filtrlash",
    "activities.allTypes": "Barcha turlar",
    "activities.fetchError": "Faoliyatlarni yuklashda xatolik",
    "activities.noActivities": "Faoliyatlar topilmadi",
    "activities.addYourFirst": "Boshlash uchun birinchi faoliyatingizni qo‘shing",
    "activities.validationError": "Noto‘g‘ri ma’lumot",
    "activities.fillAllFields": "Iltimos, barcha maydonlarni to‘ldiring",
    "activities.addSuccess": "Faoliyat qo‘shildi",
    "activities.activityAdded": "Faoliyat muvaffaqiyatli qo‘shildi",
    "activities.addError": "Faoliyatni qo‘shishda xatolik",
    "activities.type": "Faoliyat turi",
    "activities.selectType": "Faoliyat turini tanlang",
    "activities.customer": "Mijoz",
    "activities.selectCustomer": "Mijozni tanlang",

    "activityType.call": "Qo‘ng‘iroq",
    "activityType.email": "Email",
    "activityType.meeting": "Uchrashuv",
    "activityType.deal": "Bitim",

    "analytics.salesTrend": "Sotuvlar tendensiyasi",
    "analytics.customerDistribution": "Mijozlar taqsimoti",
    "analytics.topCustomers": "Eng yaxshi mijozlar",
    "analytics.mostValuable": "Eng qadrli mijozlar",
    "analytics.loadError": "Tahlillarni yuklashda xatolik",
    "analytics.tryAgain": "Iltimos, qayta urinib ko‘ring",
    "analytics.noData": "Ma’lumot yo‘q",
    "analytics.daily": "Kunlik",
    "analytics.weekly": "Haftalik",
    "analytics.monthly": "Oylik",
    "analytics.yearly": "Yillik",

    "time.minutesAgo": "daqiqa oldin",
    "time.hoursAgo": "soat oldin",
    "time.daysAgo": "kun oldin",

    "common.cancel": "Bekor qilish",
    "common.save": "Saqlash",
    "common.tryAgain": "Qayta urinib ko‘ring",

    "pagination.page": "Sahifa",
    "pagination.of": "dan",

    "logout.success": "Chiqildi",
    "logout.successMessage": "Siz tizimdan muvaffaqiyatli chiqdingiz",
    "logout.error": "Chiqishda xatolik",
    "logout.errorFallback": "Tizimdan chiqarildingiz, ammo xatolik yuz berdi"
  },

  ru: {
    'dashboard.title': 'CRM Система',
    'dashboard.logout': 'Выйти',
    'dashboard.loggingOut': 'Выход...',
    'dashboard.customers': 'Клиенты',
    'dashboard.sales': 'Продажи',
    'dashboard.deals': 'Сделки',
    'dashboard.conversion': 'Конверсия',

    'tabs.customers': 'Клиенты',
    'tabs.deals': 'Сделки',
    'tabs.activities': 'Активности',
    'tabs.analytics': 'Аналитика',

    'customers.search': 'Поиск клиентов...',
    'customers.addNew': 'Добавить клиента',
    'customers.list': 'Список клиентов',
    'customers.manage': 'Просмотр и управление клиентами',
    'customers.filterByStatus': 'Фильтр по статусу',
    'customers.allStatuses': 'Все статусы',
    'customers.fetchError': 'Не удалось загрузить клиентов',
    'customers.tryAgain': 'Пожалуйста, попробуйте снова',
    'customers.noCustomers': 'Клиенты не найдены',
    'customers.addYourFirst': 'Добавьте первого клиента, чтобы начать',
    'customers.value': 'Ценность клиента',
    'customers.saveSuccess': 'Клиент сохранён',
    'customers.addSuccess': 'Клиент успешно добавлен',
    'customers.updateSuccess': 'Клиент успешно обновлён',
    'customers.saveError': 'Ошибка при сохранении клиента',
    'customers.deleteSuccess': 'Клиент удалён',
    'customers.wasDeleted': 'успешно удалён',
    'customers.deleteError': 'Ошибка при удалении клиента',

    'status.active': 'Активный',
    'status.potential': 'Потенциальный',
    'status.waiting': 'В ожидании',

    'deals.addNew': 'Добавить сделку',
    'deals.list': 'Список сделок',
    'deals.manage': 'Просмотр и управление сделками',
    'deals.filterByStatus': 'Фильтр по статусу',
    'deals.allStatuses': 'Все статусы',
    'deals.fetchError': 'Не удалось загрузить сделки',
    'deals.noDeals': 'Сделки не найдены',
    'deals.addYourFirst': 'Добавьте первую сделку, чтобы начать',
    'deals.value': 'Сумма сделки',
    'deals.noCustomer': 'Клиент не назначен',
    'deals.saveSuccess': 'Сделка сохранена',
    'deals.addSuccess': 'Сделка успешно добавлена',
    'deals.updateSuccess': 'Сделка успешно обновлена',
    'deals.saveError': 'Ошибка при сохранении сделки',
    'deals.deleteSuccess': 'Сделка удалена',
    'deals.wasDeleted': 'Сделка была успешно удалена',
    'deals.deleteError': 'Ошибка при удалении сделки',

    'dealStatus.new': 'Новая',
    'dealStatus.in_progress': 'В процессе',
    'dealStatus.completed': 'Завершена',
    'dealStatus.cancelled': 'Отменена',

    'activities.addNew': 'Добавить активность',
    'activities.list': 'Список активностей',
    'activities.description': 'Отслеживайте взаимодействие с клиентами',
    'activities.filterByType': 'Фильтр по типу',
    'activities.allTypes': 'Все типы',
    'activities.fetchError': 'Не удалось загрузить активности',
    'activities.noActivities': 'Активности не найдены',
    'activities.addYourFirst': 'Добавьте первую активность, чтобы начать',
    'activities.validationError': 'Неверные данные',
    'activities.fillAllFields': 'Заполните все обязательные поля',
    'activities.addSuccess': 'Активность добавлена',
    'activities.activityAdded': 'Активность успешно добавлена',
    'activities.addError': 'Ошибка при добавлении активности',
    'activities.type': 'Тип активности',
    'activities.selectType': 'Выберите тип',
    'activities.customer': 'Клиент',
    'activities.selectCustomer': 'Выберите клиента',

    'activityType.call': 'Звонок',
    'activityType.email': 'Электронная почта',
    'activityType.meeting': 'Встреча',
    'activityType.deal': 'Сделка',

    'analytics.salesTrend': 'Тенденции продаж',
    'analytics.customerDistribution': 'Распределение клиентов',
    'analytics.topCustomers': 'Топ клиенты',
    'analytics.mostValuable': 'Самые ценные клиенты',
    'analytics.loadError': 'Не удалось загрузить аналитику',
    'analytics.tryAgain': 'Пожалуйста, попробуйте снова',
    'analytics.noData': 'Нет данных',
    'analytics.daily': 'Ежедневно',
    'analytics.weekly': 'Еженедельно',
    'analytics.monthly': 'Ежемесячно',
    'analytics.yearly': 'Ежегодно',

    'time.minutesAgo': 'минут назад',
    'time.hoursAgo': 'часов назад',
    'time.daysAgo': 'дней назад',

    'common.cancel': 'Отмена',
    'common.save': 'Сохранить',
    'common.tryAgain': 'Попробуйте снова',

    'pagination.page': 'Страница',
    'pagination.of': 'из',

    'logout.success': 'Вы вышли',
    'logout.successMessage': 'Вы успешно вышли из системы',
    'logout.error': 'Ошибка выхода',
    'logout.errorFallback': 'Вы были выведены из системы, но произошла ошибка',
  },

  en: {
    'dashboard.title': 'CRM System',
    'dashboard.logout': 'Logout',
    'dashboard.loggingOut': 'Logging out...',
    'dashboard.customers': 'Customers',
    'dashboard.sales': 'Sales',
    'dashboard.deals': 'Deals',
    'dashboard.conversion': 'Conversion',

    'tabs.customers': 'Customers',
    'tabs.deals': 'Deals',
    'tabs.activities': 'Activities',
    'tabs.analytics': 'Analytics',

    'customers.search': 'Search customers...',
    'customers.addNew': 'Add Customer',
    'customers.list': 'Customers List',
    'customers.manage': 'View and manage your customers',
    'customers.filterByStatus': 'Filter by status',
    'customers.allStatuses': 'All statuses',
    'customers.fetchError': 'Failed to load customers',
    'customers.tryAgain': 'Please try again',
    'customers.noCustomers': 'No customers found',
    'customers.addYourFirst': 'Add your first customer to get started',
    'customers.value': 'Customer value',
    'customers.saveSuccess': 'Customer saved',
    'customers.addSuccess': 'Customer added successfully',
    'customers.updateSuccess': 'Customer updated successfully',
    'customers.saveError': 'Failed to save customer',
    'customers.deleteSuccess': 'Customer deleted',
    'customers.wasDeleted': 'was deleted successfully',
    'customers.deleteError': 'Failed to delete customer',

    'status.active': 'Active',
    'status.potential': 'Potential',
    'status.waiting': 'Waiting',

    'deals.addNew': 'Add Deal',
    'deals.list': 'Deals List',
    'deals.manage': 'View and manage your deals',
    'deals.filterByStatus': 'Filter by status',
    'deals.allStatuses': 'All statuses',
    'deals.fetchError': 'Failed to load deals',
    'deals.noDeals': 'No deals found',
    'deals.addYourFirst': 'Add your first deal to get started',
    'deals.value': 'Deal value',
    'deals.noCustomer': 'No customer assigned',
    'deals.saveSuccess': 'Deal saved',
    'deals.addSuccess': 'Deal added successfully',
    'deals.updateSuccess': 'Deal updated successfully',
    'deals.saveError': 'Failed to save deal',
    'deals.deleteSuccess': 'Deal deleted',
    'deals.wasDeleted': 'Deal was deleted successfully',
    'deals.deleteError': 'Failed to delete deal',

    'dealStatus.new': 'New',
    'dealStatus.in_progress': 'In Progress',
    'dealStatus.completed': 'Completed',
    'dealStatus.cancelled': 'Cancelled',

    'activities.addNew': 'Add Activity',
    'activities.list': 'Activities List',
    'activities.description': 'Track your interactions with customers',
    'activities.filterByType': 'Filter by type',
    'activities.allTypes': 'All types',
    'activities.fetchError': 'Failed to load activities',
    'activities.noActivities': 'No activities found',
    'activities.addYourFirst': 'Add your first activity to get started',
    'activities.validationError': 'Invalid data',
    'activities.fillAllFields': 'Please fill all required fields',
    'activities.addSuccess': 'Activity added',
    'activities.activityAdded': 'Activity was added successfully',
    'activities.addError': 'Failed to add activity',
    'activities.type': 'Activity type',
    'activities.selectType': 'Select activity type',
    'activities.customer': 'Customer',
    'activities.selectCustomer': 'Select a customer',

    'activityType.call': 'Call',
    'activityType.email': 'Email',
    'activityType.meeting': 'Meeting',
    'activityType.deal': 'Deal',

    'analytics.salesTrend': 'Sales Trend',
    'analytics.customerDistribution': 'Customer Distribution',
    'analytics.topCustomers': 'Top Customers',
    'analytics.mostValuable': 'Most valuable customers',
    'analytics.loadError': 'Failed to load analytics',
    'analytics.tryAgain': 'Please try again',
    'analytics.noData': 'No data available',
    'analytics.daily': 'Daily',
    'analytics.weekly': 'Weekly',
    'analytics.monthly': 'Monthly',
    'analytics.yearly': 'Yearly',

    'time.minutesAgo': 'minutes ago',
    'time.hoursAgo': 'hours ago',
    'time.daysAgo': 'days ago',

    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.tryAgain': 'Please try again',

    'pagination.page': 'Page',
    'pagination.of': 'of',

    'logout.success': 'Logged out',
    'logout.successMessage': 'You have been logged out successfully',
    'logout.error': 'Logout error',
    'logout.errorFallback': 'You were logged out, but there might have been an error',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("uz")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("crm-language") as Language
    if (savedLanguage && ["uz", "ru", "en"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("crm-language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
