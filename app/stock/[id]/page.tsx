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
  Package,
  Edit,
  Factory,
  Calendar,
  TrendingUp,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  User,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function StockViewPage() {
  const params = useParams()
  const stockId = params.id as string

  // Mock stock data - in real app, fetch based on stockId
  const stockItem = {
    id: "GRY-001",
    product: "Premium Cotton Base",
    type: "gray", // gray, factory, design
    quantity: 450,
    factory: "Textile Mills Ltd",
    agent: "Ramesh Kumar",
    date: "2024-01-15",
    orderNumber: "PO-2024-001",
    status: "available",
    unitPrice: 120,
    totalValue: 54000,
    location: "Warehouse A - Section 2",
    batchNumber: "BTH-2024-001",
    qualityGrade: "A+",
    specifications: {
      material: "100% Cotton",
      weight: "200 GSM",
      width: "44 inches",
      color: "Natural White",
      finish: "Unfinished",
    },
    supplier: {
      name: "Cotton Mills India",
      contact: "+91 98765 43210",
      address: "Industrial Area, Coimbatore",
    },
  }

  const stockMovements = [
    {
      id: "MOV-001",
      date: "2024-01-15",
      type: "in",
      quantity: 450,
      reason: "New Purchase",
      reference: "PO-2024-001",
      user: "Admin",
    },
    {
      id: "MOV-002",
      date: "2024-01-12",
      type: "out",
      quantity: 50,
      reason: "Quality Check",
      reference: "QC-001",
      user: "Quality Team",
    },
    {
      id: "MOV-003",
      date: "2024-01-10",
      type: "adjustment",
      quantity: -5,
      reason: "Damage",
      reference: "ADJ-001",
      user: "Warehouse Manager",
    },
  ]

  const qualityChecks = [
    {
      id: "QC-001",
      date: "2024-01-16",
      inspector: "Quality Team",
      grade: "A+",
      notes: "Excellent quality, no defects found",
      status: "passed",
    },
    {
      id: "QC-002",
      date: "2024-01-15",
      inspector: "Ramesh Kumar",
      grade: "A+",
      notes: "Initial inspection on arrival",
      status: "passed",
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
      case "passed":
        return <Badge variant="default">Passed</Badge>
      case "in":
        return <Badge variant="default">Stock In</Badge>
      case "out":
        return <Badge variant="destructive">Stock Out</Badge>
      case "adjustment":
        return <Badge variant="outline">Adjustment</Badge>
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
              <BreadcrumbLink href="/stock">Stock</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{stockItem.product}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/stock">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h2 className="text-2xl font-bold">{stockItem.product}</h2>
              <p className="text-muted-foreground flex items-center gap-2">
                <Package className="h-4 w-4" />
                {stockItem.id} • {stockItem.type.charAt(0).toUpperCase() + stockItem.type.slice(1)} Stock
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/stock/${stockId}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Stock
              </Button>
            </Link>
          </div>
        </div>

        {/* Stock Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockItem.quantity}m</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {getStatusIcon(stockItem.status)}
                {stockItem.status}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unit Price</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stockItem.unitPrice}</div>
              <p className="text-xs text-muted-foreground">Per meter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stockItem.totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Current value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quality Grade</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stockItem.qualityGrade}</div>
              <p className="text-xs text-muted-foreground">Quality rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Stock Details and Tabs */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Stock Information */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Information</CardTitle>
              <CardDescription>Basic stock details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                {getStatusBadge(stockItem.status)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Factory className="h-4 w-4 text-muted-foreground" />
                  <span>{stockItem.factory}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{stockItem.agent}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{stockItem.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{stockItem.date}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order Number</span>
                  <span className="font-medium">{stockItem.orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Batch Number</span>
                  <span className="font-medium">{stockItem.batchNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Material</span>
                  <span className="font-medium">{stockItem.specifications.material}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-medium">{stockItem.specifications.weight}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Width</span>
                  <span className="font-medium">{stockItem.specifications.width}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stock History and Quality */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="movements" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="movements">Stock Movements</TabsTrigger>
                <TabsTrigger value="quality">Quality Checks</TabsTrigger>
              </TabsList>

              <TabsContent value="movements">
                <Card>
                  <CardHeader>
                    <CardTitle>Stock Movements</CardTitle>
                    <CardDescription>History of stock in/out movements</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b">
                          <tr>
                            <th className="text-left p-4 font-medium">Date</th>
                            <th className="text-left p-4 font-medium">Type</th>
                            <th className="text-left p-4 font-medium">Quantity</th>
                            <th className="text-left p-4 font-medium">Reason</th>
                            <th className="text-left p-4 font-medium">Reference</th>
                            <th className="text-left p-4 font-medium">User</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stockMovements.map((movement) => (
                            <tr key={movement.id} className="border-b hover:bg-muted/50">
                              <td className="p-4">{movement.date}</td>
                              <td className="p-4">{getStatusBadge(movement.type)}</td>
                              <td className="p-4">
                                <span
                                  className={
                                    movement.type === "out" || movement.quantity < 0 ? "text-red-500" : "text-green-500"
                                  }
                                >
                                  {movement.type === "out" ? "-" : movement.quantity < 0 ? "" : "+"}
                                  {Math.abs(movement.quantity)}m
                                </span>
                              </td>
                              <td className="p-4">{movement.reason}</td>
                              <td className="p-4 font-medium">{movement.reference}</td>
                              <td className="p-4">{movement.user}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quality">
                <Card>
                  <CardHeader>
                    <CardTitle>Quality Checks</CardTitle>
                    <CardDescription>Quality inspection history</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b">
                          <tr>
                            <th className="text-left p-4 font-medium">Date</th>
                            <th className="text-left p-4 font-medium">Inspector</th>
                            <th className="text-left p-4 font-medium">Grade</th>
                            <th className="text-left p-4 font-medium">Status</th>
                            <th className="text-left p-4 font-medium">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {qualityChecks.map((check) => (
                            <tr key={check.id} className="border-b hover:bg-muted/50">
                              <td className="p-4">{check.date}</td>
                              <td className="p-4">{check.inspector}</td>
                              <td className="p-4 font-medium text-green-500">{check.grade}</td>
                              <td className="p-4">{getStatusBadge(check.status)}</td>
                              <td className="p-4">{check.notes}</td>
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
