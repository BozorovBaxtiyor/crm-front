"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchWithAuth } from "@/lib/api"
import type { Deal } from "@/lib/api/deals"
import type { Customer } from "@/components/customer-modal"

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dealData: any) => void;
  deal?: Deal | null;
  mode?: 'add' | 'edit';
  customerId?: number;
}

export function DealModal({ isOpen, onClose, onSave, deal, mode = "add", customerId }: DealModalProps) {
  const { t } = useLanguage()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [value, setValue] = useState("")
  const [status, setStatus] = useState<"new" | "in_progress" | "completed" | "cancelled">("new")
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)
  const [customers, setCustomers] = useState<{ id: number, name: string, company: string }[]>([])
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false)

  // Fetch customers for dropdown
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoadingCustomers(true)
      try {
        const response = await fetchWithAuth('/customers')
        setCustomers(response.data.customers)
      } catch (error) {
        console.error("Failed to fetch customers:", error)
      } finally {
        setIsLoadingCustomers(false)
      }
    }
    
    if (isOpen) {
      fetchCustomers()
    }
  }, [isOpen])

  // Set form data when editing an existing deal
  useEffect(() => {
    if (deal && mode === "edit") {
      setTitle(deal.title)
      setDescription(deal.description)
      setValue(deal.value.toString())
      setStatus(deal.status)
      setSelectedCustomerId(deal.customerId)
    } else {
      // Clear form for new deal
      setTitle("")
      setDescription("")
      setValue("")
      setStatus("new")
      setSelectedCustomerId(customerId || null)
    }
  }, [deal, mode, customerId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    const dealData: any = {
      title,
      description,
      value: parseFloat(value),
      status,
      customerId: selectedCustomerId!,
    };

    if (mode === 'edit' && deal) {
      dealData.id = deal.id;
    }

    onSave(dealData); // Promise qaytarmaslik
    onClose(); // Modal yopish
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? t("deals.addTitle") : t("deals.editTitle")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                {t("deals.title")}
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                {t("deals.description")}
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                {t("deals.value")}
              </Label>
              <Input
                id="value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                {t("deals.status")}
              </Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("deals.selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">{t("dealStatus.new")}</SelectItem>
                  <SelectItem value="in_progress">{t("dealStatus.in_progress")}</SelectItem>
                  <SelectItem value="completed">{t("dealStatus.completed")}</SelectItem>
                  <SelectItem value="cancelled">{t("dealStatus.cancelled")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-right">
                {t("deals.customer")}
              </Label>
              <Select 
                value={selectedCustomerId?.toString() || ""} 
                onValueChange={(value) => setSelectedCustomerId(parseInt(value))}
                disabled={!!customerId || isLoadingCustomers}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("deals.selectCustomer")} />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.name} ({customer.company})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" type="button" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">{t("common.save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}