"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { ArrowLeft, Save, X, Loader2, AlertTriangle, CheckCircle } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

// Stock interfaces based on backend schema
interface StockVariant {
  color: string;
  quantity: number;
  unit: string;
}

interface AdditionalInfo {
  batchNumber: string;
  qualityGrade: string;
  notes?: string;
}

interface GrayStockDetails {
  product: string;
  factory: string;
  agent: string;
  orderNumber: string;
}

interface FactoryStockDetails {
  product: string;
  processingFactory: string;
  processingStage: string;
  expectedCompletion: string;
}

interface DesignStockDetails {
  product: string;
  design: string;
  warehouse: string;
}

interface Stock {
  _id: string;
  stockType: "Gray Stock" | "Factory Stock" | "Design Stock";
  status: string;
  variants: StockVariant[];
  stockDetails: GrayStockDetails | FactoryStockDetails | DesignStockDetails;
  addtionalInfo: AdditionalInfo;
  createdAt: string;
  updatedAt: string;
}

// Frontend form interface
interface StockFormData {
  id: string;
  product: string;
  type: string;
  quantity: number;
  factory: string;
  agent: string;
  orderNumber: string;
  status: string;
  unitPrice: number;
  location: string;
  batchNumber: string;
  qualityGrade: string;
  material: string;
  weight: string;
  width: string;
  color: string;
  finish: string;
  supplierName: string;
  supplierContact: string;
  supplierAddress: string;
  notes: string;
}

// Agent interface based on API response
interface Agent {
  _id: string;
  name: string;
  factory: string;
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

export default function StockEditPage() {
  const params = useParams()
  const router = useRouter()
  const stockId = params.id as string

  // State management
  const [stockItem, setStockItem] = useState<StockFormData>({
    id: "",
    product: "",
    type: "",
    quantity: 0,
    factory: "",
    agent: "",
    orderNumber: "",
    status: "available",
    unitPrice: 0,
    location: "",
    batchNumber: "",
    qualityGrade: "A",
    material: "",
    weight: "",
    width: "",
    color: "",
    finish: "",
    supplierName: "",
    supplierContact: "",
    supplierAddress: "",
    notes: "",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Add state for agents fetching
    const [agents, setAgents] = useState<Agent[]>([]);
    const [agentsLoading, setAgentsLoading] = useState(true);
    const [factories, setFactories] = useState<string[]>([]);

  // Fetch stock data from backend
  useEffect(() => {
    const fetchStock = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`http://localhost:4000/api/v1/stock/${stockId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch stock: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        
        if (data.success) {
          const stock = data.stock as Stock
          transformStockToFormData(stock)
        } else {
          throw new Error(data.message || "Failed to fetch stock")
        }
      } catch (err) {
        console.error("Error fetching stock:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch stock")
      } finally {
        setLoading(false)
      }
    }

    if (stockId) {
      fetchStock()
    }

    const fetchAgentsAndFactories = async () => {
      try {
        setAgentsLoading(true);
        const response = await fetch("http://localhost:4000/api/v1/agent/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch agents: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        
        if (data.success) {
          setAgents(data.agents || []);
          // Extract unique factory names from agents
          const uniqueFactories = [...new Set(data.agents.map((agent: Agent) => agent.factory))] as string[];
          setFactories(uniqueFactories);
        }
      } catch (err) {
        console.error("Error fetching agents:", err);
      } finally {
        setAgentsLoading(false);
      }
    };
    fetchAgentsAndFactories();
  }, [stockId])

  // Transform backend stock data to form data
  const transformStockToFormData = (stock: Stock) => {
    const totalQuantity = stock.variants.reduce((sum, variant) => sum + variant.quantity, 0)
    const mainColor = stock.variants[0]?.color || ""
    
    // Use dynamic status from backend
    const status = stock.status || "available"

    const formData: StockFormData = {
      id: stock._id,
      product: (stock.stockDetails as any).product || "",
      type: stock.stockType.toLowerCase().replace(" ", "_"),
      quantity: totalQuantity,
      factory: (stock.stockDetails as any).factory || (stock.stockDetails as any).processingFactory || "",
      agent: (stock.stockDetails as any).agent || "",
      orderNumber: (stock.stockDetails as any).orderNumber || "",
      status,
      unitPrice: 120, // Default value, not in backend schema
      location: (stock.stockDetails as any).warehouse || "Warehouse A - Section 2",
      batchNumber: stock.addtionalInfo.batchNumber,
      qualityGrade: stock.addtionalInfo.qualityGrade,
      material: "100% Cotton", // Default value, not in backend schema
      weight: "200 GSM", // Default value, not in backend schema
      width: "44 inches", // Default value, not in backend schema
      color: mainColor,
      finish: "Unfinished", // Default value, not in backend schema
      supplierName: "Cotton Mills India", // Default value, not in backend schema
      supplierContact: "+91 98765 43210", // Default value, not in backend schema
      supplierAddress: "Industrial Area, Coimbatore", // Default value, not in backend schema
      notes: stock.addtionalInfo.notes || "",
    }

    setStockItem(formData)
  }

  // Transform form data back to backend format
  const transformFormDataToBackend = (formData: StockFormData) => {
    const stockType = formData.type === "gray_stock" ? "Gray Stock" : 
                     formData.type === "factory_stock" ? "Factory Stock" : "Design Stock"

    // Create variants based on quantity and color
    const variants = [{
      color: formData.color || "Natural White",
      quantity: formData.quantity,
      unit: "METERS"
    }]

    // Create stock details based on type
    let stockDetails: any = {}
    if (stockType === "Gray Stock") {
      stockDetails = {
        product: formData.product,
        factory: formData.factory,
        agent: formData.agent,
        orderNumber: formData.orderNumber,
      }
    } else if (stockType === "Factory Stock") {
      stockDetails = {
        product: formData.product,
        processingFactory: formData.factory,
        processingStage: "Dyeing", // Default value
        expectedCompletion: new Date().toISOString(),
      }
    } else if (stockType === "Design Stock") {
      stockDetails = {
        product: formData.product,
        design: "Floral Print", // Default value
        warehouse: formData.location,
      }
    }

    // Create additional info
    const addtionalInfo = {
      batchNumber: formData.batchNumber,
      qualityGrade: formData.qualityGrade,
      notes: formData.notes,
    }

    return {
      stockType,
      status: formData.status,
      variants,
      stockDetails,
      addtionalInfo,
    }
  }

  const locations = [
    "Warehouse A - Section 1",
    "Warehouse A - Section 2",
    "Warehouse B - Section 1",
    "Factory Floor",
    "Quality Check Area",
  ]
  const qualityGrades = ["A+", "A", "B+", "B"]
  const statuses = ["available", "low", "out", "processing", "quality_check"]

  const handleInputChange = (field: string, value: string | number) => {
    setStockItem((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      const backendData = transformFormDataToBackend(stockItem)

      const response = await fetch(`http://localhost:4000/api/v1/stock/${stockId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update stock")
      }

      const result = await response.json()
      console.log("Stock updated successfully:", result)
      
      setSuccess(true)
      
      // Redirect to stock list after a short delay
      setTimeout(() => {
        router.push("/stock")
      }, 1500)
      
    } catch (err) {
      console.error("Error updating stock:", err)
      setError(err instanceof Error ? err.message : "Failed to update stock")
    } finally {
      setSaving(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
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
                <BreadcrumbPage>Edit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex-1 flex items-center justify-center p-4 md:p-6">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading stock data...</span>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
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
                <BreadcrumbPage>Edit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex-1 flex items-center justify-center p-4 md:p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load stock data</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Retry
              </Button>
              <Button 
                onClick={() => router.push("/stock")}
                variant="outline"
              >
                Back to Stock List
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
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
              <BreadcrumbLink href={`/stock/${stockId}`}>{stockItem.product}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(`/stock/${stockId}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h2 className="text-2xl font-bold">Edit Stock Item</h2>
              <p className="text-muted-foreground">Update stock information</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => router.push(`/stock/${stockId}`)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-800 font-medium">Stock updated successfully!</span>
            </div>
            <p className="text-green-700 text-sm mt-1">Redirecting to stock list...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-red-800 font-medium">Error updating stock</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Edit Form */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Stock item basic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product Name *</Label>
                <Input
                  id="product"
                  value={stockItem.product}
                  onChange={(e) => handleInputChange("product", e.target.value)}
                  placeholder="Enter product name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (m) *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={stockItem.quantity}
                    onChange={(e) => handleInputChange("quantity", Number.parseInt(e.target.value) || 0)}
                    placeholder="Enter quantity"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitPrice">Unit Price (₹) *</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    value={stockItem.unitPrice}
                    onChange={(e) => handleInputChange("unitPrice", Number.parseInt(e.target.value) || 0)}
                    placeholder="Enter unit price"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="factory">Factory</Label>
                  <Select value={stockItem.factory} onValueChange={(value) => handleInputChange("factory", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select factory" />
                    </SelectTrigger>
                    <SelectContent>
                      {factories.map((factory) => (
                        <SelectItem key={factory} value={factory}>
                          {factory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agent">Agent</Label>
                  <Select value={stockItem.agent} onValueChange={(value) => handleInputChange("agent", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent._id} value={agent.name}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={stockItem.location} onValueChange={(value) => handleInputChange("location", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={stockItem.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batchNumber">Batch Number</Label>
                  <Input
                    id="batchNumber"
                    value={stockItem.batchNumber}
                    onChange={(e) => handleInputChange("batchNumber", e.target.value)}
                    placeholder="Enter batch number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualityGrade">Quality Grade</Label>
                  <Select
                    value={stockItem.qualityGrade}
                    onValueChange={(value) => handleInputChange("qualityGrade", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {qualityGrades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specifications & Supplier */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications & Supplier</CardTitle>
              <CardDescription>Product specifications and supplier information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  value={stockItem.material}
                  onChange={(e) => handleInputChange("material", e.target.value)}
                  placeholder="e.g., 100% Cotton"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    value={stockItem.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    placeholder="e.g., 200 GSM"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    value={stockItem.width}
                    onChange={(e) => handleInputChange("width", e.target.value)}
                    placeholder="e.g., 44 inches"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={stockItem.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    placeholder="e.g., Natural White"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="finish">Finish</Label>
                  <Input
                    id="finish"
                    value={stockItem.finish}
                    onChange={(e) => handleInputChange("finish", e.target.value)}
                    placeholder="e.g., Unfinished"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="supplierName">Supplier Name</Label>
                <Input
                  id="supplierName"
                  value={stockItem.supplierName}
                  onChange={(e) => handleInputChange("supplierName", e.target.value)}
                  placeholder="Enter supplier name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplierContact">Supplier Contact</Label>
                <Input
                  id="supplierContact"
                  value={stockItem.supplierContact}
                  onChange={(e) => handleInputChange("supplierContact", e.target.value)}
                  placeholder="Enter supplier contact"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplierAddress">Supplier Address</Label>
                <Textarea
                  id="supplierAddress"
                  value={stockItem.supplierAddress}
                  onChange={(e) => handleInputChange("supplierAddress", e.target.value)}
                  placeholder="Enter supplier address"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={stockItem.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional notes about the stock item"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline"
            onClick={() => router.push(`/stock/${stockId}`)}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}