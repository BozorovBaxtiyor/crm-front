"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"

export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  company: string
  status: "active" | "potential" | "waiting"
  value: string
}

interface CustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (customer: Omit<Customer, "id"> | Customer) => void
  customer?: Customer | null
  mode: "add" | "edit"
}

export function CustomerModal({ isOpen, onClose, onSave, customer, mode }: CustomerModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "potential" as const,
    value: "",
  })

  useEffect(() => {
    if (customer && mode === "edit") {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
        status: customer.status,
        value: customer.value,
      })
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "potential",
        value: "",
      })
    }
  }, [customer, mode, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "edit" && customer) {
      onSave({ ...customer, ...formData })
    } else {
      onSave(formData)
    }
    onClose()
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? t("customers.addTitle") : t("customers.editTitle")}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Yangi mijoz ma'lumotlarini kiriting" : "Mijoz ma'lumotlarini tahrirlang"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t("customers.name")}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                {t("customers.email")}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                {t("customers.phone")}
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                {t("customers.company")}
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                {t("customers.status")}
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t("status.active")}</SelectItem>
                  <SelectItem value="potential">{t("status.potential")}</SelectItem>
                  <SelectItem value="waiting">{t("status.waiting")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                {t("customers.value")}
              </Label>
              <Input
                id="value"
                value={formData.value}
                onChange={(e) => handleChange("value", e.target.value)}
                className="col-span-3"
                placeholder="$0"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("customers.cancel")}
            </Button>
            <Button type="submit">{t("customers.save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
