"use client"

import { useState, useEffect } from "react"
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
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  User,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Define Product type based on backend schema
interface Product {
  _id: string;
  productName: string;
  category: string;
  tags: string[];
  variants: any[];
  images?: string[];
  status?: string;
  stockInfo?: {
    minimumStock: number;
    reorderPoint: number;
    storageLocation: string;
  };
  unit?: string;
  description?: string;
  price?: number;
  setSize?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export default function ProductViewPage() {
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/v1/products/${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data.product);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found.</div>;

  // Mock stock history
  const stockHistory = [
    { date: "2024-01-20", action: "Added", quantity: 180, balance: 540, user: "Admin" },
    { date: "2024-01-18", action: "Sold", quantity: -120, balance: 360, user: "Sales Team" },
    { date: "2024-01-15", action: "Added", quantity: 300, balance: 480, user: "Admin" },
    { date: "2024-01-10", action: "Sold", quantity: -60, balance: 180, user: "Sales Team" },
  ]

  // Mock recent orders
  const recentOrders = [
    { id: "ORD-001", customer: "Rajesh Textiles", quantity: "60m", date: "2024-01-18", status: "delivered" },
    { id: "ORD-005", customer: "Modern Fabrics", quantity: "120m", date: "2024-01-16", status: "shipped" },
    { id: "ORD-012", customer: "Elite Textiles", quantity: "90m", date: "2024-01-14", status: "processing" },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "low":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "out":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>
      case "low":
        return <Badge variant="secondary">Low Stock</Badge>
      case "out":
        return <Badge variant="destructive">Out of Stock</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      case "shipped":
        return <Badge className="bg-blue-100 text-blue-800">Shipped</Badge>
      case "processing":
        return <Badge variant="secondary">Processing</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  const setSize = product.setSize || 1; // fallback to 1 if not present
  const pricePerMeter = product.variants?.[0]?.pricePerMeters || 0;
  const setValue = pricePerMeter * setSize;

  const formatDateIST = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    
    // Convert to IST (UTC+5:30)
    const istOffset = 330 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const istDate = new Date(date.getTime() + istOffset);
    
    // Format date as DD/MM/YYYY
    const day = String(istDate.getUTCDate()).padStart(2, '0');
    const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
    const year = istDate.getUTCFullYear();
    
    // Format time as HH:MM AM/PM
    let hours = istDate.getUTCHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm} IST`;
  };
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
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.productName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 md:items-start justify-between">
          <div className="flex items-start gap-4">
            {getStatusIcon(product.status || "unknown")}
            <div>
              <h1 className="text-3xl font-bold">{product.productName}</h1>
              <p className="text-muted-foreground">
                {product.category} • ID: {product.id}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(product.status || "unknown")}
                {/* Removed variants display as per user request */}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/products/${product.id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Product
              </Button>
            </Link>
            <Button variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Product Images */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={product.images?.[selectedImage] || "/placeholder.svg"}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {product.images?.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${product.productName} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <div className="md:col-span-2">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="stock">Stock History</TabsTrigger>
                <TabsTrigger value="orders">Recent Orders</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pricing & Stock</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Price per Meter</span>
                        <span className="text-lg font-bold"> ₹{product.variants?.[0]?.pricePerMeters ?? "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Set Size</span>
                        <span>{product.setSize} meters</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Current Stock</span>
                        <span className="font-medium">{product.variants
      ? product.variants.reduce((sum, v) => sum + (v.stockInMeters || 0), 0)
      : 0}m</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Minimum Stock</span>
                        <span>{product.stockInfo?.minimumStock ?? "N/A"}m</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Set Value</span>
                          <span className="text-lg font-bold">
                          ₹{setValue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Product Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="text-sm font-medium">Description</span>
                        <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Tags</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div>
                          <span className="text-sm font-medium">Created</span>
                          <p className="text-sm text-muted-foreground">{formatDateIST(product.createdAt) }</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Updated</span>
                          <p className="text-sm text-muted-foreground">{formatDateIST(product.updatedAt)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Specifications</CardTitle>
                    <CardDescription>Detailed product specifications and care instructions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm font-medium">Composition</span>
                          <p className="text-sm text-muted-foreground">{product.specifications?.composition}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Weight</span>
                          <p className="text-sm text-muted-foreground">{product.specifications?.weight}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Width</span>
                          <p className="text-sm text-muted-foreground">{product.specifications?.width}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm font-medium">Care Instructions</span>
                          <p className="text-sm text-muted-foreground">{product.specifications?.care}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Origin</span>
                          <p className="text-sm text-muted-foreground">{product.specifications?.origin}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Supplier Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{product.supplier?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Contact:</span>
                        <span className="text-sm">{product.supplier?.contact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{product.supplier?.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stock" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Stock Movement History</CardTitle>
                    <CardDescription>Track all stock additions and sales</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stockHistory.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {entry.action === "Added" ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <div>
                              <p className="font-medium text-sm">
                                {entry.action} {Math.abs(entry.quantity)}m
                              </p>
                              <p className="text-xs text-muted-foreground">by {entry.user}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm">{entry.balance}m</p>
                            <p className="text-xs text-muted-foreground">{entry.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Orders containing this product</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.customer}</p>
                            <p className="text-xs text-muted-foreground">
                              {order.quantity} • {order.date}
                            </p>
                          </div>
                          <div className="text-right">{getOrderStatusBadge(order.status)}</div>
                        </div>
                      ))}
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
