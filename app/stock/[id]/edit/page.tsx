"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { ArrowLeft, Save, X } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function StockEditPage() {
  const params = useParams()
  const stockId = params.id as string

  // Mock stock data - in real app, fetch based on stockId
  const [stockItem, setStockItem] = useState({
    id: "GRY-001",
    product: "Premium Cotton Base",
    type: "gray",
    quantity: 450,
    factory: "Textile Mills Ltd",
    agent: "Ramesh Kumar",
    orderNumber: "PO-2024-001",
    status: "available",
    unitPrice: 120,
    location: "Warehouse A - Section 2",
    batchNumber: "BTH-2024-001",
    qualityGrade: "A+",
    material: "100% Cotton",
    weight: "200 GSM",
    width: "44 inches",
    color: "Natural White",
    finish: "Unfinished",
    supplierName: "Cotton Mills India",
    supplierContact: "+91 98765 43210",
    supplierAddress: "Industrial Area, Coimbatore",
    notes: "High quality cotton base material suitable for premium fabric production.",
  })

  const factories = ["Textile Mills Ltd", "Silk Weavers Co", "Modern Textiles", "Synthetic Mills", "Premium Fabrics"]
  const agents = ["Ramesh Kumar", "Priya Sharma", "Suresh Patel", "Kavita Singh", "Amit Gupta"]
  const locations = [
    "Warehouse A - Section 1",
    "Warehouse A - Section 2",
    "Warehouse B - Section 1",
    "Factory Floor",
    "Quality Check Area",
  ]
  const qualityGrades = ["A+", "A", "B+", "B", "C"]
  const statuses = ["available", "low", "out", "processing", "quality_check"]

  const handleInputChange = (field: string, value: string | number) => {
    setStockItem((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // In real app, save to backend
    console.log("Saving stock item:", stockItem)
    // Show success message and redirect
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
            <Link href={`/stock/${stockId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h2 className="text-2xl font-bold">Edit Stock Item</h2>
              <p className="text-muted-foreground">Update stock information</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/stock/${stockId}`}>
              <Button variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </Link>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

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
                        <SelectItem key={agent} value={agent}>
                          {agent}
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
          <Link href={`/stock/${stockId}`}>
            <Button variant="outline">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </Link>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </SidebarInset>
  )
}
