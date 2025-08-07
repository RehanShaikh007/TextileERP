"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingCart,
  Edit,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Truck,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function OrderViewPage() {
  const params = useParams()
  const orderId = params.id as string

  // Mock order data - in real app, fetch based on orderId
  const order = {
    id: "ORD-001",
    customer: {
      name: "Rajesh Textiles",
      city: "Mumbai",
      phone: "+91 98765 43210",
      email: "rajesh@textiles.com",
      address: "123 Textile Street, Mumbai, Maharashtra 400001",
    },
    status: "processing",
    orderDate: "2024-01-15",
    dueDate: "2024-01-25",
    deliveryDate: null,
    totalAmount: 45000,
    paidAmount: 20000,
    balanceAmount: 25000,
    paymentStatus: "partial",
    items: [
      {
        id: 1,
        product: "Premium Cotton Blend",
        color: "Blue",
        quantity: 120,
        price: 450,
        total: 54000,
        image: "/placeholder.svg?height=100&width=100&text=Cotton+Blue",
      },
      {
        id: 2,
        product: "Silk Designer Print",
        color: "Red",
        quantity: 60,
        price: 800,
        total: 48000,
        image: "/placeholder.svg?height=100&width=100&text=Silk+Red",
      },
      {
        id: 3,
        product: "Polyester Mix Fabric",
        color: "Green",
        quantity: 90,
        price: 320,
        total: 28800,
        image: "/placeholder.svg?height=100&width=100&text=Polyester+Green",
      },
    ],
    notes: "Rush order for upcoming fashion show. Please ensure quality check before dispatch.",
    createdBy: "Sales Team",
    lastUpdated: "2024-01-20",
  }

  // Mock status history
  const statusHistory = [
    { date: "2024-01-20", status: "Processing", description: "Order moved to production", user: "Production Team" },
    {
      date: "2024-01-18",
      status: "Confirmed",
      description: "Payment received, order confirmed",
      user: "Accounts Team",
    },
    {
      date: "2024-01-15",
      status: "Pending",
      description: "Order created and awaiting confirmation",
      user: "Sales Team",
    },
  ]

  // Mock payment history
  const paymentHistory = [
    { date: "2024-01-18", amount: 20000, method: "Bank Transfer", reference: "TXN123456", status: "completed" },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "confirmed":
        return <Package className="h-5 w-5 text-purple-500" />
      case "pending":
        return <AlertCircle className="h-5 w-5 text-orange-500" />
      default:
        return <ShoppingCart className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
      case "confirmed":
        return <Badge className="bg-purple-100 text-purple-800">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>
      case "pending":
        return <Badge className="bg-red-100 text-red-800">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
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
              <BreadcrumbPage>{order.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 md:items-start justify-between">
          <div className="flex items-start gap-4">
            {getStatusIcon(order.status)}
            <div>
              <h1 className="text-3xl font-bold">Order {order.id}</h1>
              <p className="text-muted-foreground">
                {order.customer.name} • {order.orderDate}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(order.status)}
                {getPaymentStatusBadge(order.paymentStatus)}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/orders/${order.id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Order
              </Button>
            </Link>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
              <Trash2 className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Order Summary */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Subtotal</span>
                <span>₹{order.items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Discount</span>
                <span>
                  -₹{(order.items.reduce((sum, item) => sum + item.total, 0) - order.totalAmount).toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount</span>
                <span>₹{order.totalAmount.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Paid Amount</span>
                  <span className="text-green-600">₹{order.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Balance</span>
                  <span className="text-red-600">₹{order.balanceAmount.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <div className="md:col-span-2">
            <Tabs defaultValue="items" className="space-y-4">
              <TabsList>
                <TabsTrigger value="items">Order Items</TabsTrigger>
                <TabsTrigger value="customer">Customer Info</TabsTrigger>
                <TabsTrigger value="status">Status History</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items ({order.items.length})</CardTitle>
                    <CardDescription>Products included in this order</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.product}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product}</h4>
                            <p className="text-sm text-muted-foreground">Color: {item.color}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity}m × ₹{item.price}/m
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹{item.total.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {order.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{order.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="customer" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                    <CardDescription>Contact and delivery details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-sm text-muted-foreground">Customer</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{order.customer.phone}</p>
                        <p className="text-sm text-muted-foreground">Phone</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{order.customer.email}</p>
                        <p className="text-sm text-muted-foreground">Email</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{order.customer.address}</p>
                        <p className="text-sm text-muted-foreground">Delivery Address</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Order Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{order.orderDate}</p>
                        <p className="text-sm text-muted-foreground">Order Date</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{order.dueDate}</p>
                        <p className="text-sm text-muted-foreground">Due Date</p>
                      </div>
                    </div>
                    {order.deliveryDate && (
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{order.deliveryDate}</p>
                          <p className="text-sm text-muted-foreground">Delivery Date</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="status" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Status History</CardTitle>
                    <CardDescription>Track order progress and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {statusHistory.map((entry, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                          {getStatusIcon(entry.status.toLowerCase())}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{entry.status}</p>
                              <p className="text-sm text-muted-foreground">{entry.date}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{entry.description}</p>
                            <p className="text-xs text-muted-foreground">Updated by {entry.user}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>Track all payments for this order</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paymentHistory.map((payment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              {payment.method} • {payment.reference}
                            </p>
                            <p className="text-xs text-muted-foreground">{payment.date}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Completed</Badge>
                        </div>
                      ))}
                      {order.balanceAmount > 0 && (
                        <div className="flex items-center justify-between p-3 border-2 border-dashed border-orange-200 rounded-lg">
                          <div>
                            <p className="font-medium text-orange-600">₹{order.balanceAmount.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Pending Payment</p>
                          </div>
                          <Button size="sm">Record Payment</Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
