"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Package,
  Factory,
  Palette,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowUpDown,
  Eye,
  Edit,
} from "lucide-react"
import Link from "next/link"

export default function StockPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  // Mock data for different stock types
  const grayStock = [
    {
      id: "GRY-001",
      product: "Premium Cotton Base",
      quantity: 450,
      factory: "Textile Mills Ltd",
      agent: "Ramesh Kumar",
      date: "2024-01-15",
      orderNumber: "PO-2024-001",
      status: "available",
    },
    {
      id: "GRY-002",
      product: "Silk Blend Base",
      quantity: 280,
      factory: "Silk Weavers Co",
      agent: "Priya Sharma",
      date: "2024-01-14",
      orderNumber: "PO-2024-002",
      status: "low",
    },
    {
      id: "GRY-003",
      product: "Cotton Mix Base",
      quantity: 120,
      factory: "Modern Textiles",
      agent: "Suresh Patel",
      date: "2024-01-13",
      orderNumber: "PO-2024-003",
      status: "available",
    },
    {
      id: "GRY-004",
      product: "Polyester Base",
      quantity: 0,
      factory: "Synthetic Mills",
      agent: "Kavita Singh",
      date: "2024-01-12",
      orderNumber: "PO-2024-004",
      status: "out",
    },
  ]

  const factoryStock = [
    {
      id: "FAC-001",
      product: "Cotton Blend Processing",
      quantity: 320,
      factory: "Modern Textiles",
      stage: "Dyeing",
      expectedCompletion: "2024-01-20",
      status: "processing",
    },
    {
      id: "FAC-002",
      product: "Silk Designer Processing",
      quantity: 180,
      factory: "Premium Fabrics",
      stage: "Printing",
      expectedCompletion: "2024-01-18",
      status: "processing",
    },
    {
      id: "FAC-003",
      product: "Polyester Mix Processing",
      quantity: 240,
      factory: "Synthetic Mills",
      stage: "Finishing",
      expectedCompletion: "2024-01-22",
      status: "processing",
    },
  ]

  const designStock = [
    {
      id: "DES-001",
      product: "Cotton Blend Fabric",
      design: "Floral Print",
      quantity: 540,
      colors: ["Blue", "Red", "Green"],
      status: "available",
      warehouse: "Main Warehouse",
    },
    {
      id: "DES-002",
      product: "Silk Designer Print",
      design: "Abstract Pattern",
      quantity: 45,
      colors: ["Gold", "Silver"],
      status: "low",
      warehouse: "Main Warehouse",
    },
    {
      id: "DES-003",
      product: "Polyester Mix",
      design: "Geometric Design",
      quantity: 280,
      colors: ["Black", "White", "Gray"],
      status: "available",
      warehouse: "Secondary Warehouse",
    },
    {
      id: "DES-004",
      product: "Cotton Casual",
      design: "Solid Colors",
      quantity: 0,
      colors: ["Navy", "Khaki"],
      status: "out",
      warehouse: "Main Warehouse",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "low":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "out":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "processing":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Package className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="default">Available</Badge>
      case "low":
        return <Badge variant="secondary">Low Stock</Badge>
      case "out":
        return <Badge variant="destructive">Out of Stock</Badge>
      case "processing":
        return <Badge variant="outline">Processing</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const stockStats = {
    grayTotal: grayStock.reduce((sum, item) => sum + item.quantity, 0),
    factoryTotal: factoryStock.reduce((sum, item) => sum + item.quantity, 0),
    designTotal: designStock.reduce((sum, item) => sum + item.quantity, 0),
    lowStockItems: [...grayStock, ...designStock].filter((item) => item.status === "low").length,
    outOfStockItems: [...grayStock, ...designStock].filter((item) => item.status === "out").length,
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
              <BreadcrumbPage>Stock Management</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stock Management</h2>
            <p className="text-muted-foreground">Track gray, factory, and design stock</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Adjustment
            </Button>
            <Link href="/stock/add">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Stock
              </Button>
            </Link>
          </div>
        </div>

        {/* Stock Overview Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gray Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockStats.grayTotal.toLocaleString()}m</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                Unfinished fabric
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Factory Stock</CardTitle>
              <Factory className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockStats.factoryTotal.toLocaleString()}m</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3 text-blue-500" />
                In processing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Design Stock</CardTitle>
              <Palette className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockStats.designTotal.toLocaleString()}m</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Ready for sale
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stockStats.lowStockItems}</div>
              <p className="text-xs text-muted-foreground">Items need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stockStats.outOfStockItems}</div>
              <p className="text-xs text-muted-foreground">Urgent restocking</p>
            </CardContent>
          </Card>
        </div>

        {/* Stock Details Tabs */}
        <Tabs defaultValue="gray" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gray">Gray Stock</TabsTrigger>
            <TabsTrigger value="factory">Factory Stock</TabsTrigger>
            <TabsTrigger value="design">Design Stock</TabsTrigger>
          </TabsList>

          <TabsContent value="gray" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search gray stock..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Gray Stock Inventory</CardTitle>
                <CardDescription>Unfinished fabric from factories</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-4 font-medium">Product</th>
                        <th className="text-left p-4 font-medium">Quantity</th>
                        <th className="text-left p-4 font-medium">Factory</th>
                        <th className="text-left p-4 font-medium">Agent</th>
                        <th className="text-left p-4 font-medium">Order No.</th>
                        <th className="text-left p-4 font-medium">Date</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grayStock.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50">
                          <td className="p-4 font-medium">{item.product}</td>
                          <td className="p-4">{item.quantity}m</td>
                          <td className="p-4">{item.factory}</td>
                          <td className="p-4">{item.agent}</td>
                          <td className="p-4">{item.orderNumber}</td>
                          <td className="p-4">{item.date}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(item.status)}
                              {getStatusBadge(item.status)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Link href={`/stock/${item.id}`}>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/stock/${item.id}/edit`}>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="factory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Factory Processing Stock</CardTitle>
                <CardDescription>Stock currently being processed at factories</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-4 font-medium">Product</th>
                        <th className="text-left p-4 font-medium">Quantity</th>
                        <th className="text-left p-4 font-medium">Factory</th>
                        <th className="text-left p-4 font-medium">Stage</th>
                        <th className="text-left p-4 font-medium">Expected</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {factoryStock.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50">
                          <td className="p-4 font-medium">{item.product}</td>
                          <td className="p-4">{item.quantity}m</td>
                          <td className="p-4">{item.factory}</td>
                          <td className="p-4">{item.stage}</td>
                          <td className="p-4">{item.expectedCompletion}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(item.status)}
                              {getStatusBadge(item.status)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Link href={`/stock/${item.id}`}>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/stock/${item.id}/edit`}>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Design Stock Inventory</CardTitle>
                <CardDescription>Finished products ready for sale</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-4 font-medium">Product</th>
                        <th className="text-left p-4 font-medium">Design</th>
                        <th className="text-left p-4 font-medium">Quantity</th>
                        <th className="text-left p-4 font-medium">Colors</th>
                        <th className="text-left p-4 font-medium">Warehouse</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {designStock.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50">
                          <td className="p-4 font-medium">{item.product}</td>
                          <td className="p-4">{item.design}</td>
                          <td className="p-4">{item.quantity}m</td>
                          <td className="p-4">
                            <div className="flex gap-1 flex-wrap">
                              {item.colors.map((color, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {color}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="p-4">{item.warehouse}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(item.status)}
                              {getStatusBadge(item.status)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Link href={`/stock/${item.id}`}>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/stock/${item.id}/edit`}>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </td>
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
    </SidebarInset>
  )
}
