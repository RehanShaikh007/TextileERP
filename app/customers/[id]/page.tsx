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
import { Edit, MapPin, Phone, Mail, ShoppingCart, TrendingUp, ArrowLeft, Star, Clock } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function CustomerViewPage() {
  const params = useParams()
  const customerId = params.id as string

  // Mock customer data - in real app, fetch based on customerId
  const customer = {
    id: "CUST-001",
    name: "Rajesh Textiles",
    city: "Mumbai",
    state: "Maharashtra",
    address: "123 Textile Market, Dadar West, Mumbai - 400028",
    phone: "+91 98765 43210",
    email: "rajesh@textiles.com",
    gst: "27ABCDE1234F1Z5",
    totalOrders: 45,
    totalValue: 1250000,
    lastOrder: "2024-01-15",
    status: "active",
    avgOrderValue: 27778,
    joinDate: "2022-03-15",
    creditLimit: 500000,
    outstandingAmount: 125000,
    rating: 4.5,
  }

  const recentOrders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      amount: 45000,
      status: "delivered",
      items: 3,
      products: ["Cotton Blend Fabric", "Silk Designer Print"],
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      amount: 32000,
      status: "shipped",
      items: 2,
      products: ["Polyester Mix", "Cotton Casual"],
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      amount: 28000,
      status: "delivered",
      items: 4,
      products: ["Premium Cotton Base", "Silk Blend Base"],
    },
  ]

  const paymentHistory = [
    {
      id: "PAY-001",
      date: "2024-01-16",
      amount: 45000,
      method: "Bank Transfer",
      status: "completed",
      reference: "TXN123456789",
    },
    {
      id: "PAY-002",
      date: "2024-01-11",
      amount: 32000,
      method: "Cheque",
      status: "completed",
      reference: "CHQ987654321",
    },
    {
      id: "PAY-003",
      date: "2024-01-06",
      amount: 28000,
      method: "Cash",
      status: "completed",
      reference: "CASH001",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "delivered":
        return <Badge variant="default">Delivered</Badge>
      case "shipped":
        return <Badge variant="outline">Shipped</Badge>
      case "completed":
        return <Badge variant="default">Completed</Badge>
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
              <BreadcrumbLink href="/customers">Customers</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{customer.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/customers">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h2 className="text-2xl font-bold">{customer.name}</h2>
              <p className="text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {customer.city}, {customer.state}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/customers/${customerId}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Customer
              </Button>
            </Link>
          </div>
        </div>

        {/* Customer Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customer.totalOrders}</div>
              <p className="text-xs text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{customer.totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Lifetime value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">₹{customer.outstandingAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Pending payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-1">
                {customer.rating}
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
              </div>
              <p className="text-xs text-muted-foreground">Customer rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Customer Details and Tabs */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Basic customer details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                {getStatusBadge(customer.status)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.address}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST Number</span>
                  <span className="font-medium">{customer.gst}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Join Date</span>
                  <span className="font-medium">{customer.joinDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Credit Limit</span>
                  <span className="font-medium">₹{customer.creditLimit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Order Value</span>
                  <span className="font-medium">₹{customer.avgOrderValue.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders and Payment History */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="orders" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="orders">Recent Orders</TabsTrigger>
                <TabsTrigger value="payments">Payment History</TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest orders from this customer</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b">
                          <tr>
                            <th className="text-left p-4 font-medium">Order ID</th>
                            <th className="text-left p-4 font-medium">Date</th>
                            <th className="text-left p-4 font-medium">Amount</th>
                            <th className="text-left p-4 font-medium">Items</th>
                            <th className="text-left p-4 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((order) => (
                            <tr key={order.id} className="border-b hover:bg-muted/50">
                              <td className="p-4 font-medium">{order.id}</td>
                              <td className="p-4">{order.date}</td>
                              <td className="p-4">₹{order.amount.toLocaleString()}</td>
                              <td className="p-4">{order.items} items</td>
                              <td className="p-4">{getStatusBadge(order.status)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>Recent payment transactions</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b">
                          <tr>
                            <th className="text-left p-4 font-medium">Payment ID</th>
                            <th className="text-left p-4 font-medium">Date</th>
                            <th className="text-left p-4 font-medium">Amount</th>
                            <th className="text-left p-4 font-medium">Method</th>
                            <th className="text-left p-4 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentHistory.map((payment) => (
                            <tr key={payment.id} className="border-b hover:bg-muted/50">
                              <td className="p-4 font-medium">{payment.id}</td>
                              <td className="p-4">{payment.date}</td>
                              <td className="p-4">₹{payment.amount.toLocaleString()}</td>
                              <td className="p-4">{payment.method}</td>
                              <td className="p-4">{getStatusBadge(payment.status)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
