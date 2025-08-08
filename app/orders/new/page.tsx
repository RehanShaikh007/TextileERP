"use client"

import { useState, useEffect } from "react"
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
import { Plus, X, ArrowLeft, Save, User, Package, Calculator, Loader2, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"

// Backend interfaces
interface Customer { _id: string; customerName: string; city: string; customerType: "Wholesale" | "Retail"; }
interface ProductVariant { color: string; pricePerMeters: number; stockInMeters: number }
interface Product { _id: string; productName: string; variants: ProductVariant[]; unit: "METERS" | "SETS" }

export default function NewOrderPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState("")
  const [orderDate, setOrderDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [deliveryDate, setDeliveryDate] = useState<string>("")
  const [notes, setNotes] = useState("")

  const [orderItems, setOrderItems] = useState([
    { id: 1, productId: "", color: "", quantity: "", unit: "meters", price: "", total: 0 },
  ])

  // Backend data
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch customers
        const custRes = await fetch("http://localhost:4000/api/v1/customer")
        if (!custRes.ok) throw new Error(`Customers fetch failed: ${custRes.status}`)
        const custData = await custRes.json()
        if (!custData.success) throw new Error(custData.message || "Failed to fetch customers")
        setCustomers(custData.customers || [])

        // Fetch products (support both /api/v1/products and /api/v1/products/products)
        let productsData: any = null
        let prodRes = await fetch("http://localhost:4000/api/v1/products")
        if (prodRes.ok) {
          const data = await prodRes.json()
          if (data?.success && Array.isArray(data.products)) {
            productsData = data.products
          }
        }
        if (!productsData) {
          // Try fallback route if backend is mounted at /api/v1/products
          prodRes = await fetch("http://localhost:4000/api/v1/products/products")
          if (!prodRes.ok) throw new Error(`Products fetch failed: ${prodRes.status}`)
          const data = await prodRes.json()
          if (!data.success) throw new Error(data.message || "Failed to fetch products")
          productsData = data.products || []
        }
        setProducts(productsData)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const addOrderItem = () => {
    const newItem = { id: Date.now(), productId: "", color: "", quantity: "", unit: "meters", price: "", total: 0 }
    setOrderItems((prev) => [...prev, newItem])
  }

  const removeOrderItem = (id: number) => {
    if (orderItems.length > 1) setOrderItems(orderItems.filter((item) => item.id !== id))
    }

  const getProductColors = (productId: string) => {
    const product = products.find((p) => p._id === productId)
    return product ? product.variants.map((v) => v.color) : []
  }

  const updateOrderItem = (id: number, field: string, value: string) => {
    setOrderItems((items) =>
      items.map((item) => {
        if (item.id !== id) return item
        const updated = { ...item, [field]: value }

        // Auto price from product variant
        if (field === "productId" || field === "color") {
          const product = products.find((p) => p._id === (field === "productId" ? value : item.productId))
            const color = field === "color" ? value : item.color
          const variant = product?.variants.find((v) => v.color === color)
          if (variant) updated.price = String(variant.pricePerMeters)
          }

          // Calculate total
        if (updated.quantity && updated.price) {
          let qty = parseFloat(updated.quantity) || 0
          const price = parseFloat(updated.price) || 0
          if (updated.unit === "sets") {
            // Default: 1 set = 60 meters
                qty = qty * 60
          }
          updated.total = qty * price
        } else {
          updated.total = 0
        }
        return updated
      }),
    )
  }

  const calculateOrderTotal = () => orderItems.reduce((sum, item) => sum + item.total, 0)
  const calculateTax = () => calculateOrderTotal() * 0.18 // 18% GST
  const calculateGrandTotal = () => calculateOrderTotal() + calculateTax()

  const handleCreateOrder = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      // Basic validation
      if (!selectedCustomerId) throw new Error("Please select a customer")
      if (!orderDate || !deliveryDate) throw new Error("Please select order and delivery dates")
      if (orderItems.some((i) => !i.productId || !i.color || !i.quantity || !i.price)) {
        throw new Error("Please complete all order item fields")
      }

      const customer = customers.find((c) => c._id === selectedCustomerId)
      if (!customer) throw new Error("Selected customer not found")

      const backendItems = orderItems.map((i) => {
        const product = products.find((p) => p._id === i.productId)
        const productName = product?.productName || ""
        return {
          product: productName,
          color: i.color,
          quantity: i.unit === "sets" ? (parseFloat(i.quantity) || 0) * 60 : parseFloat(i.quantity) || 0,
          unit: i.unit.toUpperCase(),
          pricePerMeters: parseFloat(i.price) || 0,
        }
      })

      const payload = {
        customer: customer.customerName,
        status: "pending", // New orders start as pending
        orderDate: new Date(orderDate).toISOString(),
        deliveryDate: new Date(deliveryDate).toISOString(),
        orderItems: backendItems,
        notes,
      }

      const res = await fetch("http://localhost:4000/api/v1/order/addOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error(e.message || "Failed to create order")
      }

      setSuccess(true)
      // Reset minimal state
      setOrderItems([{ id: 1, productId: "", color: "", quantity: "", unit: "meters", price: "", total: 0 }])
      setSelectedCustomerId("")
      setDeliveryDate("")
      setNotes("")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create order")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
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
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Loading...</div>
        </div>
      </SidebarInset>
    )
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
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-700 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" /> Order created successfully
          </div>
        )}
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
            <Button variant="outline" disabled={saving}>Save as Draft</Button>
            <Button onClick={handleCreateOrder} disabled={saving}>
              {saving ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating...</>) : (<><Save className="h-4 w-4 mr-2" />Create Order</>)}
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
                  <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer._id} value={customer._id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{customer.customerName}</span>
                            <div className="flex gap-2 ml-4">
                              <Badge variant="outline" className="text-xs">{customer.city}</Badge>
                              <Badge variant="secondary" className="text-xs">{customer.customerType}</Badge>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="order-date">Order Date</Label>
                    <Input id="order-date" type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery-date">Expected Delivery</Label>
                    <Input id="delivery-date" type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
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
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded mb-4">
                  <p className="text-yellow-800 text-sm font-medium">Pricing auto-fills from product variant price. You can override.</p>
                </div>
                {orderItems.map((item, index) => (
                  <div key={item.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {orderItems.length > 1 && (
                        <Button variant="outline" size="sm" onClick={() => removeOrderItem(item.id)} className="text-red-600">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Product</Label>
                        <Select value={item.productId} onValueChange={(value) => updateOrderItem(item.id, "productId", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product._id} value={product._id}>{product.productName}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Color</Label>
                        <Select value={item.color} onValueChange={(value) => updateOrderItem(item.id, "color", value)} disabled={!item.productId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select color" />
                          </SelectTrigger>
                          <SelectContent>
                            {getProductColors(item.productId).map((color) => (
                              <SelectItem key={color} value={color}>{color}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input type="number" placeholder="0" value={item.quantity} onChange={(e) => updateOrderItem(item.id, "quantity", e.target.value)} />
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
                        <Input type="number" placeholder="0" value={item.price} onChange={(e) => updateOrderItem(item.id, "price", e.target.value)} />
                      </div>

                      <div className="space-y-2">
                        <Label>Total</Label>
                        <Input value={`₹${item.total.toLocaleString()}`} disabled className="bg-muted" />
                      </div>
                    </div>

                    {item.unit === "sets" && (
                      <div className="text-sm text-muted-foreground bg-blue-50 p-2 rounded">
                        <p>1 Set = 60 meters (equivalent: {item.quantity ? (parseFloat(item.quantity) * 60).toLocaleString() : 0} meters)</p>
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
                <Textarea placeholder="Enter any special instructions or notes..." rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
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
            {selectedCustomerId && (
              <Card>
                <CardHeader>
                  <CardTitle>Customer Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const customer = customers.find((c) => c._id === selectedCustomerId)
                    return customer ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{customer.customerName}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>{customer.city}</p>
                          <Badge variant="outline" className="mt-1">{customer.customerType}</Badge>
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

