"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Search,
  Plus,
  Phone,
  Mail,
  LogOut,
  Building2,
  BarChart3,
  Target,
  Clock,
  Edit,
  Trash2,
} from "lucide-react"

import { useLanguage } from "@/contexts/language-context"
import { ThemeLanguageSwitcher } from "@/components/theme-language-switcher"
import { CustomerModal, type Customer } from "@/components/customer-modal"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { toast } from "@/hooks/use-toast"

interface CRMDashboardProps {
  onLogout: () => void
}

export default function CRMDashboard({ onLogout }: CRMDashboardProps) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")

  // Sample data
  const stats = [
    { title: t("dashboard.customers"), value: "2,847", icon: Users, change: "+12%", color: "text-blue-600" },
    { title: t("dashboard.sales"), value: "$45,231", icon: DollarSign, change: "+8%", color: "text-green-600" },
    { title: t("dashboard.deals"), value: "127", icon: Target, change: "+23%", color: "text-purple-600" },
    { title: t("dashboard.conversion"), value: "24.5%", icon: TrendingUp, change: "+5%", color: "text-orange-600" },
  ]

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: "Alisher Karimov",
      email: "alisher@example.com",
      phone: "+998901234567",
      company: "Tech Solutions",
      status: "active",
      value: "$12,500",
    },
    {
      id: 2,
      name: "Malika Tosheva",
      email: "malika@example.com",
      phone: "+998907654321",
      company: "Digital Agency",
      status: "potential",
      value: "$8,300",
    },
    {
      id: 3,
      name: "Bobur Rahimov",
      email: "bobur@example.com",
      phone: "+998909876543",
      company: "StartUp Inc",
      status: "active",
      value: "$15,700",
    },
    {
      id: 4,
      name: "Nilufar Saidova",
      email: "nilufar@example.com",
      phone: "+998905432109",
      company: "Marketing Pro",
      status: "waiting",
      value: "$6,200",
    },
    {
      id: 5,
      name: "Sardor Umarov",
      email: "sardor@example.com",
      phone: "+998902468135",
      company: "Web Studio",
      status: "active",
      value: "$9,800",
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")

  const handleAddCustomer = () => {
    setSelectedCustomer(null)
    setModalMode("add")
    setIsModalOpen(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDeleteModalOpen(true)
  }

  const handleSaveCustomer = (customerData: Omit<Customer, "id"> | Customer) => {
    if (modalMode === "add") {
      const newCustomer: Customer = {
        ...(customerData as Omit<Customer, "id">),
        id: Math.max(...customers.map((c) => c.id)) + 1,
      }
      setCustomers([...customers, newCustomer])
      toast({
        title: t("customers.saveSuccess"),
        description: "Yangi mijoz qo'shildi",
      })
    } else {
      setCustomers(customers.map((c) => (c.id === (customerData as Customer).id ? (customerData as Customer) : c)))
      toast({
        title: t("customers.saveSuccess"),
        description: "Mijoz ma'lumotlari yangilandi",
      })
    }
  }

  const handleConfirmDelete = () => {
    if (selectedCustomer) {
      setCustomers(customers.filter((c) => c.id !== selectedCustomer.id))
      toast({
        title: t("customers.deleteSuccess"),
        description: `${selectedCustomer.name} o'chirildi`,
      })
      setIsDeleteModalOpen(false)
      setSelectedCustomer(null)
    }
  }

  const recentActivities = [
    { id: 1, type: "call", description: "Alisher Karimov bilan qo'ng'iroq", time: "10 daqiqa oldin" },
    { id: 2, type: "email", description: "Malika Toshevaga taklif yuborildi", time: "1 soat oldin" },
    { id: 3, type: "meeting", description: "Bobur Rahimov bilan uchrashuv", time: "2 soat oldin" },
    { id: 4, type: "deal", description: "Yangi kelishuv yaratildi - $15,000", time: "3 soat oldin" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "potential":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "waiting":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("dashboard.title")}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeLanguageSwitcher />
            <Button variant="outline" onClick={onLogout} className="bg-background">
              <LogOut className="w-4 h-4 mr-2" />
              {t("dashboard.logout")}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Cards - update the change text */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className={`text-sm ${stat.color}`}>
                      {stat.change} {t("dashboard.lastMonth")}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="customers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="customers">{t("tabs.customers")}</TabsTrigger>
            <TabsTrigger value="deals">{t("tabs.deals")}</TabsTrigger>
            <TabsTrigger value="activities">{t("tabs.activities")}</TabsTrigger>
            <TabsTrigger value="analytics">{t("tabs.analytics")}</TabsTrigger>
          </TabsList>

          <TabsContent value="customers" className="space-y-6">
            {/* Search and Add Customer */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t("customers.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddCustomer}>
                <Plus className="w-4 h-4 mr-2" />
                {t("customers.addNew")}
              </Button>
            </div>

            {/* Customers Table */}
            <Card>
              <CardHeader>
                <CardTitle>{t("customers.list")}</CardTitle>
                <CardDescription>{t("customers.manage")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                          <AvatarFallback>
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{customer.name}</h3>
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
                        <Badge className={getStatusColor(customer.status)}>{t(`status.${customer.status}`)}</Badge>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">{customer.value}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{t("customers.value")}</p>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Faol Kelishuvlar</CardTitle>
                <CardDescription>Joriy kelishuvlaringizni kuzatib boring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Yangi</h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                        <p className="font-medium">Tech Solutions</p>
                        <p className="text-sm text-gray-600">$12,500</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                        <p className="font-medium">StartUp Inc</p>
                        <p className="text-sm text-gray-600">$8,300</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Jarayonda</h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-500">
                        <p className="font-medium">Digital Agency</p>
                        <p className="text-sm text-gray-600">$15,700</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Yakunlangan</h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                        <p className="font-medium">Web Studio</p>
                        <p className="text-sm text-gray-600">$9,800</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>So'nggi Faoliyatlar</CardTitle>
                <CardDescription>Oxirgi harakatlar va o'zgarishlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-full">
                        {activity.type === "call" && <Phone className="w-4 h-4 text-blue-600" />}
                        {activity.type === "email" && <Mail className="w-4 h-4 text-blue-600" />}
                        {activity.type === "meeting" && <Calendar className="w-4 h-4 text-blue-600" />}
                        {activity.type === "deal" && <DollarSign className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Oylik Sotuv Trendi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Grafik bu yerda ko'rsatiladi</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Mijozlar Taqsimoti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Faol mijozlar</span>
                      <span className="font-semibold">60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Potensial mijozlar</span>
                      <span className="font-semibold">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Kutilayotgan mijozlar</span>
                      <span className="font-semibold">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomer}
        customer={selectedCustomer}
        mode={modalMode}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        customerName={selectedCustomer?.name || ""}
      />
    </div>
  )
}
