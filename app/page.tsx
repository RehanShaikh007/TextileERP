"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import Link from "next/link"
import React from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Dashboard() {
  const stats = [
    {
      title: "Total Products",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Orders",
      value: "23",
      change: "+8%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Customers",
      value: "89",
      change: "+15%",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Low Stock Items",
      value: "12",
      change: "-3%",
      trend: "down",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "Rajesh Textiles",
      product: "Premium Cotton Blend",
      quantity: "180m",
      status: "processing",
      priority: "high",
      amount: "₹81,000",
    },
    {
      id: "ORD-002",
      customer: "Sharma Fabrics",
      product: "Silk Designer Print",
      quantity: "120m",
      status: "confirmed",
      priority: "medium",
      amount: "₹96,000",
    },
    {
      id: "ORD-003",
      customer: "Modern Textiles",
      product: "Polyester Mix",
      quantity: "360m",
      status: "shipped",
      priority: "low",
      amount: "₹1,15,200",
    },
    {
      id: "ORD-004",
      customer: "Elite Fabrics",
      product: "Cotton Casual Wear",
      quantity: "240m",
      status: "delivered",
      priority: "medium",
      amount: "₹91,200",
    },
  ]

  const stockAlerts = [
    {
      product: "Premium Cotton Blend",
      current: "45m",
      minimum: "100m",
      severity: "critical",
    },
    {
      product: "Silk Designer Print",
      current: "78m",
      minimum: "120m",
      severity: "warning",
    },
    {
      product: "Wool Winter Blend",
      current: "25m",
      minimum: "80m",
      severity: "critical",
    },
    {
      product: "Linen Summer Collection",
      current: "95m",
      minimum: "150m",
      severity: "warning",
    },
  ]

  const topSellingProducts = [
    {
      id: "PRD-001",
      name: "Premium Cotton Blend",
      sold: "2,450m",
      revenue: "₹11,02,500",
      growth: "+15%",
    },
    {
      id: "PRD-002",
      name: "Silk Designer Print",
      sold: "1,200m",
      revenue: "₹9,60,000",
      growth: "+8%",
    },
    {
      id: "PRD-003",
      name: "Polyester Mix",
      sold: "1,800m",
      revenue: "₹5,76,000",
      growth: "+22%",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return <Badge variant="secondary">Processing</Badge>
      case "confirmed":
        return <Badge variant="default">Confirmed</Badge>
      case "shipped":
        return <Badge className="bg-blue-100 text-blue-800">Shipped</Badge>
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge variant="secondary">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const [filterOpen, setFilterOpen] = React.useState(false)
  const [filterStatus, setFilterStatus] = React.useState("all")
  const [filterCustomer, setFilterCustomer] = React.useState("all")
  const [filterFrom, setFilterFrom] = React.useState("")
  const [filterTo, setFilterTo] = React.useState("")

  const customers = [
    "Rajesh Textiles",
    "Sharma Fabrics",
    "Modern Textiles",
    "Elite Fabrics",
  ]

  const filteredOrders = recentOrders.filter((order) => {
    const statusMatch = filterStatus === "all" || order.status === filterStatus
    const customerMatch = filterCustomer === "all" || order.customer === filterCustomer
    // For demo, date range is not implemented as mock data has no date
    return statusMatch && customerMatch
  })

  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Responsive: Add extra padding on mobile, reduce on desktop */}
        {/* All grids/flex layouts already use responsive classes. */}
        {/* --- Demo: Pending/Delivered Orders, Filter Removal, Advanced Filter --- */}
        <div className="bg-cyan-50 border-l-4 border-cyan-400 p-3 rounded mb-4 flex flex-col gap-2">
          <p className="text-cyan-800 text-sm font-medium">Dashboard now shows pending and delivered orders. Use the status filter or advanced filter for more options.</p>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => { setFilterStatus("all"); setFilterCustomer("all"); }}>All Orders</Button>
            <Button variant="outline" size="sm" onClick={() => setFilterStatus("processing")}>Pending</Button>
            <Button variant="outline" size="sm" onClick={() => setFilterStatus("delivered")}>Delivered</Button>
            <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Advanced Filter</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Advanced Filter</DialogTitle>
                  <DialogDescription>Filter orders by status, customer, and date range.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Customer</label>
                    <Select value={filterCustomer} onValueChange={setFilterCustomer}>
                      <SelectTrigger><SelectValue placeholder="All Customers" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {customers.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">From</label>
                      <Input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">To</label>
                      <Input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setFilterOpen(false)}>Apply</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* --- End Demo --- */}

        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/products/add">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
            <Link href="/orders/new">
              <Button variant="outline">
                <ShoppingCart className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Responsive: grid-cols-1 on mobile, more columns on desktop */}
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest orders from your customers</CardDescription>
                </div>
                <Link href="/orders">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Responsive: Add min-w-0 to prevent overflow */}
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50 min-w-0"
                  >
                    <Link href={`/orders/${order.id}`} className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{order.id}</p>
                        {getPriorityBadge(order.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.product} • {order.quantity}
                      </p>
                    </Link>
                    <div className="text-right">
                      <p className="font-medium text-sm">{order.amount}</p>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stock Alerts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Stock Alerts</CardTitle>
                  <CardDescription>Products running low on inventory</CardDescription>
                </div>
                <Link href="/stock">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Manage Stock
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                  >
                    <Link href={`/stock/design`} className="flex items-center gap-3 flex-1">
                      {getSeverityIcon(alert.severity)}
                      <div>
                        <p className="font-medium text-sm">{alert.product}</p>
                        <p className="text-xs text-muted-foreground">
                          Current: {alert.current} • Min: {alert.minimum}
                        </p>
                      </div>
                    </Link>
                    <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"}>
                      {alert.severity === "critical" ? "Out of Stock" : "Low Stock"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Selling Products */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>Best performing products this month</CardDescription>
                </div>
                <Link href="/products">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSellingProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                  >
                    <Link href={`/products/${product.id}`} className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">Sold: {product.sold}</p>
                    </Link>
                    <div className="text-right">
                      <p className="font-medium text-sm">{product.revenue}</p>
                      <p className="text-xs text-green-600">{product.growth}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/products/add">
                <Button variant="outline" className="h-20 flex-col gap-2 w-full bg-transparent">
                  <Package className="h-6 w-6" />
                  <span>Add Product</span>
                </Button>
              </Link>
              <Link href="/orders/new">
                <Button variant="outline" className="h-20 flex-col gap-2 w-full bg-transparent">
                  <ShoppingCart className="h-6 w-6" />
                  <span>Create Order</span>
                </Button>
              </Link>
              <Link href="/stock/add">
                <Button variant="outline" className="h-20 flex-col gap-2 w-full bg-transparent">
                  <TrendingUp className="h-6 w-6" />
                  <span>Add Stock</span>
                </Button>
              </Link>
              <Link href="/reports">
                <Button variant="outline" className="h-20 flex-col gap-2 w-full bg-transparent">
                  <TrendingUp className="h-6 w-6" />
                  <span>View Reports</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
