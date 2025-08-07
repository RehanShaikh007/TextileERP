"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Download, TrendingUp, Package, Users, ShoppingCart, DollarSign } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  // Mock data
  const salesData = {
    totalRevenue: 2847500,
    ordersCompleted: 156,
    averageOrderValue: 18254,
    growthRate: 12.5,
  }

  const stockData = {
    totalStockValue: 4567890,
    stockTurnover: 4.2,
    lowStockItems: 12,
    outOfStockItems: 3,
  }

  const topProducts = [
    { name: "Cotton Blend Fabric", revenue: 450000, quantity: 2500, growth: 15.2 },
    { name: "Silk Designer Print", revenue: 380000, quantity: 1200, growth: 8.7 },
    { name: "Polyester Mix", revenue: 320000, quantity: 1800, growth: -2.1 },
    { name: "Premium Cotton", revenue: 280000, quantity: 1100, growth: 22.3 },
    { name: "Linen Summer", revenue: 240000, quantity: 900, growth: 5.8 },
  ]

  const topCustomers = [
    { name: "Rajesh Textiles", orders: 45, revenue: 1250000, city: "Mumbai" },
    { name: "Textile World", orders: 52, revenue: 1450000, city: "Pune" },
    { name: "Fashion Hub", orders: 32, revenue: 890000, city: "Delhi" },
    { name: "Style Point", orders: 28, revenue: 675000, city: "Bangalore" },
    { name: "Modern Fabrics", orders: 18, revenue: 520000, city: "Chennai" },
  ]

  const monthlyData = [
    { month: "Jan", revenue: 245000, orders: 18 },
    { month: "Feb", revenue: 280000, orders: 22 },
    { month: "Mar", revenue: 320000, orders: 25 },
    { month: "Apr", revenue: 290000, orders: 21 },
    { month: "May", revenue: 350000, orders: 28 },
    { month: "Jun", revenue: 380000, orders: 32 },
  ]

  const productPerformanceData = topProducts.map((product) => ({
    name: product.name.split(" ")[0], // Shortened names for chart
    revenue: product.revenue / 1000, // Convert to thousands
    quantity: product.quantity,
    growth: product.growth,
  }))

  const stockCategoryData = [
    { name: "Gray Stock", value: 1567890, fill: "#8884d8" },
    { name: "Factory Stock", value: 1234567, fill: "#82ca9d" },
    { name: "Design Stock", value: 1765433, fill: "#ffc658" },
  ]

  const stockMovementData = [
    { month: "Jan", inbound: 45000, outbound: 38000, net: 7000 },
    { month: "Feb", inbound: 52000, outbound: 41000, net: 11000 },
    { month: "Mar", inbound: 48000, outbound: 45000, net: 3000 },
    { month: "Apr", inbound: 61000, outbound: 52000, net: 9000 },
    { month: "May", inbound: 55000, outbound: 48000, net: 7000 },
    { month: "Jun", inbound: 58000, outbound: 51000, net: 7000 },
  ]

  const customerRevenueData = topCustomers.map((customer) => ({
    name: customer.name.split(" ")[0], // Shortened names
    revenue: customer.revenue / 1000, // Convert to thousands
    orders: customer.orders,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

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
              <BreadcrumbPage>Reports</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Reports & Analytics</h2>
            <p className="text-muted-foreground">Business insights and data export</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="fy23-24">FY 23-24</SelectItem>
                <SelectItem value="fy25-26">FY 25-26</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button variant="outline" onClick={() => alert('Demo: Export Order Bills to PDF')}>Export Order Bills (PDF)</Button>
          </div>
        </div>

        {/* Main Reports Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{salesData.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />+{salesData.growthRate}% from last period
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders Completed</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{salesData.ordersCompleted}</div>
                  <p className="text-xs text-muted-foreground">This period</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{salesData.averageOrderValue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Per order</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Stock Turnover</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stockData.stockTurnover}x</div>
                  <p className="text-xs text-muted-foreground">Inventory turns</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                      <Tooltip
                        formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Volume</CardTitle>
                  <CardDescription>Monthly order count</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [value, "Orders"]} labelFormatter={(label) => `Month: ${label}`} />
                      <Bar dataKey="orders" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>Key sales metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Revenue</span>
                      <span className="font-bold">₹{salesData.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Orders Completed</span>
                      <span className="font-bold">{salesData.ordersCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Order Value</span>
                      <span className="font-bold">₹{salesData.averageOrderValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth Rate</span>
                      <span className="font-bold text-green-600 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />+{salesData.growthRate}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Products by Revenue</CardTitle>
                  <CardDescription>Best performing products</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={productPerformanceData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => `₹${value}K`} />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}K`, "Revenue"]} />
                      <Bar dataKey="revenue" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Product Growth Analysis</CardTitle>
                <CardDescription>Growth rate comparison across products</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={productPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, "Growth Rate"]} />
                    <Line
                      type="monotone"
                      dataKey="growth"
                      stroke="#82ca9d"
                      strokeWidth={3}
                      dot={{ fill: "#82ca9d", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Stock Distribution</CardTitle>
                  <CardDescription>Stock value by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stockCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stockCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stock Analysis</CardTitle>
                  <CardDescription>Inventory performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Stock Value</span>
                      <span className="font-bold">₹{stockData.totalStockValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stock Turnover</span>
                      <span className="font-bold">{stockData.stockTurnover}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Low Stock Items</span>
                      <span className="font-bold text-orange-600">{stockData.lowStockItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Out of Stock</span>
                      <span className="font-bold text-red-600">{stockData.outOfStockItems}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Stock Movement</CardTitle>
                <CardDescription>Monthly inbound vs outbound stock flow</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stockMovementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                    <Tooltip
                      formatter={(value) => [`${Number(value).toLocaleString()} units`, ""]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Bar dataKey="inbound" fill="#82ca9d" name="Inbound" />
                    <Bar dataKey="outbound" fill="#8884d8" name="Outbound" />
                    <Bar dataKey="net" fill="#ffc658" name="Net Change" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Revenue Distribution</CardTitle>
                  <CardDescription>Revenue by top customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={customerRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `₹${value}K`} />
                      <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}K`, "Revenue"]} />
                      <Bar dataKey="revenue" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Order Frequency</CardTitle>
                  <CardDescription>Orders placed by top customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={customerRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [value, "Orders"]} />
                      <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#82ca9d"
                        strokeWidth={3}
                        dot={{ fill: "#82ca9d", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>Best performing customers by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCustomers.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.city}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{customer.revenue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{customer.orders} orders</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
