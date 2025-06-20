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
    // Login page
    "login.title": "CRM Tizimiga Kirish",
    "login.description": "Hisobingizga kirish uchun email va parolingizni kiriting",
    "login.email": "Email manzil",
    "login.password": "Parol",
    "login.button": "Tizimga Kirish",
    "login.loading": "Kirish...",
    "login.error": "Email yoki parol noto'g'ri. Qaytadan urinib ko'ring.",
    "login.demo": "Demo hisobi:",

    // Dashboard
    "dashboard.title": "CRM Dashboard",
    "dashboard.logout": "Chiqish",
    "dashboard.customers": "Jami Mijozlar",
    "dashboard.sales": "Oylik Sotuv",
    "dashboard.deals": "Faol Kelishuvlar",
    "dashboard.conversion": "Konversiya",
    "dashboard.lastMonth": "o'tgan oyga nisbatan",

    // Tabs
    "tabs.customers": "Mijozlar",
    "tabs.deals": "Kelishuvlar",
    "tabs.activities": "Faoliyat",
    "tabs.analytics": "Analitika",

    // Customers
    "customers.search": "Mijozlarni qidirish...",
    "customers.addNew": "Yangi Mijoz",
    "customers.list": "Mijozlar Ro'yxati",
    "customers.manage": "Barcha mijozlaringizni boshqaring",
    "customers.value": "Qiymat",
    "customers.name": "Ism",
    "customers.email": "Email",
    "customers.phone": "Telefon",
    "customers.company": "Kompaniya",
    "customers.status": "Holat",
    "customers.actions": "Amallar",
    "customers.edit": "Tahrirlash",
    "customers.delete": "O'chirish",
    "customers.save": "Saqlash",
    "customers.cancel": "Bekor qilish",
    "customers.addTitle": "Yangi Mijoz Qo'shish",
    "customers.editTitle": "Mijozni Tahrirlash",
    "customers.deleteConfirm": "Haqiqatan ham bu mijozni o'chirmoqchimisiz?",
    "customers.deleteSuccess": "Mijoz muvaffaqiyatli o'chirildi",
    "customers.saveSuccess": "Mijoz muvaffaqiyatli saqlandi",

    // Status
    "status.active": "Faol",
    "status.potential": "Potensial",
    "status.waiting": "Kutilmoqda",

    // Common
    "common.yes": "Ha",
    "common.no": "Yo'q",
    "common.close": "Yopish",
  },

  ru: {
    // Login page
    "login.title": "Вход в CRM Систему",
    "login.description": "Введите email и пароль для входа в аккаунт",
    "login.email": "Email адрес",
    "login.password": "Пароль",
    "login.button": "Войти в Систему",
    "login.loading": "Вход...",
    "login.error": "Неверный email или пароль. Попробуйте снова.",
    "login.demo": "Демо аккаунт:",

    // Dashboard
    "dashboard.title": "CRM Панель",
    "dashboard.logout": "Выйти",
    "dashboard.customers": "Всего Клиентов",
    "dashboard.sales": "Месячные Продажи",
    "dashboard.deals": "Активные Сделки",
    "dashboard.conversion": "Конверсия",
    "dashboard.lastMonth": "по сравнению с прошлым месяцем",

    // Tabs
    "tabs.customers": "Клиенты",
    "tabs.deals": "Сделки",
    "tabs.activities": "Активность",
    "tabs.analytics": "Аналитика",

    // Customers
    "customers.search": "Поиск клиентов...",
    "customers.addNew": "Новый Клиент",
    "customers.list": "Список Клиентов",
    "customers.manage": "Управляйте всеми своими клиентами",
    "customers.value": "Стоимость",
    "customers.name": "Имя",
    "customers.email": "Email",
    "customers.phone": "Телефон",
    "customers.company": "Компания",
    "customers.status": "Статус",
    "customers.actions": "Действия",
    "customers.edit": "Редактировать",
    "customers.delete": "Удалить",
    "customers.save": "Сохранить",
    "customers.cancel": "Отмена",
    "customers.addTitle": "Добавить Нового Клиента",
    "customers.editTitle": "Редактировать Клиента",
    "customers.deleteConfirm": "Вы действительно хотите удалить этого клиента?",
    "customers.deleteSuccess": "Клиент успешно удален",
    "customers.saveSuccess": "Клиент успешно сохранен",

    // Status
    "status.active": "Активный",
    "status.potential": "Потенциальный",
    "status.waiting": "Ожидание",

    // Common
    "common.yes": "Да",
    "common.no": "Нет",
    "common.close": "Закрыть",
  },

  en: {
    // Login page
    "login.title": "Login to CRM System",
    "login.description": "Enter your email and password to access your account",
    "login.email": "Email address",
    "login.password": "Password",
    "login.button": "Login to System",
    "login.loading": "Logging in...",
    "login.error": "Invalid email or password. Please try again.",
    "login.demo": "Demo account:",

    // Dashboard
    "dashboard.title": "CRM Dashboard",
    "dashboard.logout": "Logout",
    "dashboard.customers": "Total Customers",
    "dashboard.sales": "Monthly Sales",
    "dashboard.deals": "Active Deals",
    "dashboard.conversion": "Conversion",
    "dashboard.lastMonth": "compared to last month",

    // Tabs
    "tabs.customers": "Customers",
    "tabs.deals": "Deals",
    "tabs.activities": "Activities",
    "tabs.analytics": "Analytics",

    // Customers
    "customers.search": "Search customers...",
    "customers.addNew": "New Customer",
    "customers.list": "Customer List",
    "customers.manage": "Manage all your customers",
    "customers.value": "Value",
    "customers.name": "Name",
    "customers.email": "Email",
    "customers.phone": "Phone",
    "customers.company": "Company",
    "customers.status": "Status",
    "customers.actions": "Actions",
    "customers.edit": "Edit",
    "customers.delete": "Delete",
    "customers.save": "Save",
    "customers.cancel": "Cancel",
    "customers.addTitle": "Add New Customer",
    "customers.editTitle": "Edit Customer",
    "customers.deleteConfirm": "Are you sure you want to delete this customer?",
    "customers.deleteSuccess": "Customer deleted successfully",
    "customers.saveSuccess": "Customer saved successfully",

    // Status
    "status.active": "Active",
    "status.potential": "Potential",
    "status.waiting": "Waiting",

    // Common
    "common.yes": "Yes",
    "common.no": "No",
    "common.close": "Close",
  },
}

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
