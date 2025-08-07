"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus, X, Save, ArrowLeft } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { cn } from "@/lib/utils"

export default function EditOrderPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string

  // Mock existing order data - in real app, fetch based on orderId
  const [formData, setFormData] = useState({
    customer: "Rajesh Textiles",
    status: "processing",
    orderDate: new Date("2024-01-15"),
    dueDate: new Date("2024-01-25"),
    notes: "Rush order for upcoming fashion show. Please ensure quality check before dispatch.",
  })

  const [orderItems, setOrderItems] = useState([
    { id: 1, product: "Premium Cotton Blend", color: "Blue", quantity: 120, price: 450, total: 54000 },
    { id: 2, product: "Silk Designer Print", color: "Red", quantity: 60, price: 800, total: 48000 },
    { id: 3, product: "Polyester Mix Fabric", color: "Green", quantity: 90, price: 320, total: 28800 },
  ])

  // Mock data
  const customers = [
    { id: "CUST-001", name: "Rajesh Textiles", city: "Mumbai" },
    { id: "CUST-002", name: "Fashion Hub", city: "Delhi" },
    { id: "CUST-003", name: "Style Point", city: "Bangalore" },
    { id: "CUST-004", name: "Modern Fabrics", city: "Chennai" },
  ]

  const products = [
    { id: "PRD-001", name: "Premium Cotton Blend", price: 450 },
    { id: "PRD-002", name: "Silk Designer Print", price: 800 },
    { id: "PRD-003", name: "Polyester Mix Fabric", price: 320 },
    { id: "PRD-004", name: "Cotton Casual Wear", price: 380 },
    { id: "PRD-005", name: "Linen Summer Collection", price: 650 },
  ]

  const colors = ["Red", "Blue", "Green", "Yellow", "Black", "White", "Purple", "Orange", "Pink", "Brown"]

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ]

  const handleInputChange = (field: string, value: string | Date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addOrderItem = () => {
    const newId = Math.max(...orderItems.map((item) => item.id)) + 1
    setOrderItems([...orderItems, { id: newId, product: "", color: "", quantity: 0, price: 0, total: 0 }])
  }

  const removeOrderItem = (id: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((item) => item.id !== id))
    }
  }

  const updateOrderItem = (id: number, field: string, value: string | number) => {
    setOrderItems(
      orderItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Auto-populate price when product is selected
          if (field === "product") {
            const selectedProduct = products.find((p) => p.name === value)
            if (selectedProduct) {
              updatedItem.price = selectedProduct.price
            }
          }

          // Calculate total
          updatedItem.total = updatedItem.quantity * updatedItem.price

          return updatedItem
        }
        return item
      }),
    )
  }

  const getOrderTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const orderData = {
      ...formData,
      items: orderItems.filter((item) => item.product && item.quantity > 0),
      total: getOrderTotal(),
    }

    console.log("Updated order data:", orderData)
    router.push(`/orders/${orderId}`)
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/orders">Orders</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/orders/${orderId}`}>{orderId}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Edit Order</h2>
            <p className="text-muted-foreground">Update order information and items</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Order Information */}
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
                <CardDescription>Basic order details and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer *</Label>
                  <Select value={formData.customer} onValueChange={(value) => handleInputChange("customer", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.name}>
                          <div className="flex flex-col">
                            <span>{customer.name}</span>
                            <span className="text-xs text-muted-foreground">{customer.city}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Order Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Order Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.orderDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.orderDate ? format(formData.orderDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.orderDate}
                          onSelect={(date) => date && handleInputChange("orderDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.dueDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.dueDate}
                          onSelect={(date) => date && handleInputChange("dueDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Order totals and pricing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span>{orderItems.filter((item) => item.quantity > 0).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Quantity:</span>
                    <span>{orderItems.reduce((sum, item) => sum + item.quantity, 0)} meters</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span>₹{getOrderTotal().toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>Products in this order</CardDescription>
              </div>
              <Button type="button" onClick={addOrderItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderItems.map((item, index) => (
                  <div key={item.id} className="grid gap-4 p-4 border rounded-lg md:grid-cols-6">
                    <div className="space-y-2">
                      <Label>Product *</Label>
                      <Select
                        value={item.product}
                        onValueChange={(value) => updateOrderItem(item.id, "product", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.name}>
                              <div className="flex flex-col">
                                <span>{product.name}</span>
                                <span className="text-xs text-muted-foreground">₹{product.price}/m</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Color *</Label>
                      <Select value={item.color} onValueChange={(value) => updateOrderItem(item.id, "color", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          {colors.map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Quantity (m) *</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={item.quantity || ""}
                        onChange={(e) => updateOrderItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Price/meter (₹)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={item.price || ""}
                        onChange={(e) => updateOrderItem(item.id, "price", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Total (₹)</Label>
                      <Input value={item.total.toLocaleString()} disabled className="bg-muted" />
                    </div>

                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOrderItem(item.id)}
                        disabled={orderItems.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Order Notes</CardTitle>
              <CardDescription>Additional information or special instructions</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter any special instructions or notes for this order..."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </SidebarInset>
  )
}
