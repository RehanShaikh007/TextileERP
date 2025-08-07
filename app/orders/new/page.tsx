"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, ArrowLeft, Save, User, Package, Calculator } from "lucide-react"
import Link from "next/link"

export default function NewOrderPage() {
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [orderItems, setOrderItems] = useState([
    { id: 1, product: "", color: "", quantity: "", unit: "meters", price: "", total: 0 },
  ])
  const [customerPricing, setCustomerPricing] = useState<any>({})

  const customers = [
    { id: "CUST-001", name: "Rajesh Textiles", city: "Mumbai", type: "wholesale" },
    { id: "CUST-002", name: "Fashion Hub", city: "Delhi", type: "retail" },
    { id: "CUST-003", name: "Style Point", city: "Bangalore", type: "wholesale" },
    { id: "CUST-004", name: "Modern Fabrics", city: "Chennai", type: "wholesale" },
  ]

  const products = [
    {
      id: "PRD-001",
      name: "Premium Cotton Blend",
      colors: ["Blue", "Red", "Green"],
      basePrice: 450,
      unit: "meters",
    },
    {
      id: "PRD-002",
      name: "Silk Designer Print",
      colors: ["Gold", "Silver"],
      basePrice: 800,
      unit: "meters",
    },
    {
      id: "PRD-003",
      name: "Polyester Mix",
      colors: ["White", "Black", "Gray"],
      basePrice: 320,
      unit: "meters",
    },
  ]

  // Mock customer pricing history
  const customerPricingHistory = {
    "CUST-001": {
      "PRD-001": { Blue: 420, Red: 430, Green: 425 },
      "PRD-002": { Gold: 750, Silver: 760 },
    },
    "CUST-002": {
      "PRD-001": { Blue: 450, Red: 450, Green: 450 },
      "PRD-003": { White: 320, Black: 320 },
    },
  }

  const addOrderItem = () => {
    const newItem = {
      id: Date.now(),
      product: "",
      color: "",
      quantity: "",
      unit: "meters",
      price: "",
      total: 0,
    }
    setOrderItems([...orderItems, newItem])
  }

  const removeOrderItem = (id: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((item) => item.id !== id))
    }
  }

  const updateOrderItem = (id: number, field: string, value: string) => {
    setOrderItems(
      orderItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Auto-populate price based on customer history
          if (field === "product" || field === "color") {
            const customer = selectedCustomer
            const product = field === "product" ? value : item.product
            const color = field === "color" ? value : item.color

            if (customer && product && color && customerPricingHistory[customer]?.[product]?.[color]) {
              updatedItem.price = customerPricingHistory[customer][product][color].toString()
            } else if (product) {
              const productData = products.find((p) => p.id === product)
              if (productData) {
                updatedItem.price = productData.basePrice.toString()
              }
            }
          }

          // Calculate total
          if (updatedItem.quantity && updatedItem.price) {
            let qty = Number.parseFloat(updatedItem.quantity)
            const price = Number.parseFloat(updatedItem.price)

            // Convert sets to meters if needed
            if (updatedItem.unit === "sets") {
              const selectedProduct = products.find((p) => p.id === updatedItem.product)
              if (selectedProduct) {
                // Assume 1 set = 60 meters (can be configured per product)
                qty = qty * 60
              }
            }

            updatedItem.total = qty * price
          }

          return updatedItem
        }
        return item
      }),
    )
  }

  const getProductColors = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product ? product.colors : []
  }

  const calculateOrderTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateTax = () => {
    return calculateOrderTotal() * 0.18 // 18% GST
  }

  const calculateGrandTotal = () => {
    return calculateOrderTotal() + calculateTax()
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
              <BreadcrumbPage>New Order</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Responsive: Add extra padding on mobile, reduce on desktop */}
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/orders">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h2 className="text-2xl font-bold">Create New Order</h2>
              <p className="text-muted-foreground">Add a new order for your customer</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Save as Draft</Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Create Order
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Order Form */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            {/* Customer Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>Select customer for this order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Select Customer</Label>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{customer.name}</span>
                            <div className="flex gap-2 ml-4">
                              <Badge variant="outline" className="text-xs">
                                {customer.city}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {customer.type}
                              </Badge>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Responsive: grid-cols-1 on mobile */}
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="order-date">Order Date</Label>
                    <Input id="order-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery-date">Expected Delivery</Label>
                    <Input id="delivery-date" type="date" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order Items</CardTitle>
                    <CardDescription>Add products to this order</CardDescription>
                  </div>
                  <Button onClick={addOrderItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* --- Demo: Order Pricing Logic --- */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded mb-4">
                  <p className="text-yellow-800 text-sm font-medium">Pricing is auto-suggested from previous orders/design pricing for the selected customer. You can override the price if needed.</p>
                </div>
                {/* --- End Demo --- */}
                {orderItems.map((item, index) => (
                  <div key={item.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {orderItems.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeOrderItem(item.id)}
                          className="text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Product</Label>
                        <Select
                          value={item.product}
                          onValueChange={(value) => updateOrderItem(item.id, "product", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Color</Label>
                        <Select
                          value={item.color}
                          onValueChange={(value) => updateOrderItem(item.id, "color", value)}
                          disabled={!item.product}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select color" />
                          </SelectTrigger>
                          <SelectContent>
                            {getProductColors(item.product).map((color) => (
                              <SelectItem key={color} value={color}>
                                {color}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={item.quantity}
                          onChange={(e) => updateOrderItem(item.id, "quantity", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Select value={item.unit} onValueChange={(value) => updateOrderItem(item.id, "unit", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="meters">Meters</SelectItem>
                            <SelectItem value="sets">Sets</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Price per {item.unit}</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={item.price}
                          onChange={(e) => updateOrderItem(item.id, "price", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Total</Label>
                        <Input value={`₹${item.total.toLocaleString()}`} disabled className="bg-muted" />
                      </div>
                    </div>

                    {item.unit === "sets" && (
                      <div className="text-sm text-muted-foreground bg-blue-50 p-2 rounded">
                        <p>
                          1 Set = 60 meters (equivalent: {item.quantity ? Number.parseFloat(item.quantity) * 60 : 0}{" "}
                          meters)
                        </p>
                      </div>
                    )}

                    {selectedCustomer &&
                      item.product &&
                      item.color &&
                      customerPricingHistory[selectedCustomer]?.[item.product]?.[item.color] && (
                        <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                          <p>
                            Previous price for this customer: ₹
                            {customerPricingHistory[selectedCustomer][item.product][item.color]}
                          </p>
                        </div>
                      )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
                <CardDescription>Additional information for this order</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea placeholder="Enter any special instructions or notes..." rows={3} />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review order details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Items</span>
                    <span>{orderItems.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{calculateOrderTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST (18%)</span>
                    <span>₹{calculateTax().toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{calculateGrandTotal().toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            {selectedCustomer && (
              <Card>
                <CardHeader>
                  <CardTitle>Customer Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const customer = customers.find((c) => c.id === selectedCustomer)
                    return customer ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{customer.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>{customer.city}</p>
                          <Badge variant="outline" className="mt-1">
                            {customer.type}
                          </Badge>
                        </div>
                      </div>
                    ) : null
                  })()}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <User className="h-4 w-4 mr-2" />
                      Add New Customer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Customer</DialogTitle>
                      <DialogDescription>Create a new customer profile</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="Customer name" />
                      <Input placeholder="Email" type="email" />
                      <Input placeholder="Phone" />
                      <Button className="w-full">Add Customer</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Package className="h-4 w-4 mr-2" />
                      Add New Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                      <DialogDescription>Create a new product</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="Product name" />
                      <Input placeholder="Base price" type="number" />
                      <Button className="w-full">Add Product</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Calculator className="h-4 w-4 mr-2" />
                  Price Calculator
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
