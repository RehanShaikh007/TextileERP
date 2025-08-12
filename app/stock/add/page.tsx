"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  ArrowLeft,
  Save,
  Factory,
  Palette,
  Plus,
  Loader2,
} from "lucide-react";
import Link from "next/link"
import { useRouter } from "next/navigation"

// Agent interface based on API response
interface Agent {
  _id: string;
  name: string;
  factory: string;
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

export default function AddStockPage() {
  const router = useRouter();
  const [stockType, setStockType] = useState("gray");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [variants, setVariants] = useState([
    { color: "", quantity: "", unit: "meters" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Add state for products fetching
  const [productNames, setProductNames] = useState<string[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  
  // Add state for agents fetching
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const [factories, setFactories] = useState<string[]>([]);

  // Add state for required fields
  const [stockDetails, setStockDetails] = useState({
    factory: "",
    agent: "",
    orderNumber: "",
    processingStage: "",
    expectedCompletion: "",
    design: "",
    warehouse: "",
  });

  const [addtionalInfo, setAddtionalInfo] = useState({
    batchNumber: "",
    qualityGrade: "",
    notes: "",
  });

  // Fetch products and agents from backend on component mount
  useEffect(() => {
    const fetchProductNames = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);

        const response = await fetch("http://localhost:4000/api/v1/products/all/names", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch product names: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setProductNames((data.productNames as string[]) || []);
      } catch (err) {
        console.error("Error fetching product names:", err);
        setProductsError(
          err instanceof Error ? err.message : "Failed to fetch product names"
        );
      } finally {
        setProductsLoading(false);
      }
    };

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

    fetchProductNames();
    fetchAgentsAndFactories();
  }, []);

  const designs = [
    { id: "DES-001", name: "Floral Print", category: "printed" },
    { id: "DES-002", name: "Abstract Pattern", category: "printed" },
    { id: "DES-003", name: "Geometric Design", category: "printed" },
    { id: "DES-004", name: "Solid Colors", category: "solid" },
  ];

  const warehouses = [
    { id: "WH-001", name: "Main Warehouse", location: "Mumbai" },
    { id: "WH-002", name: "Secondary Warehouse", location: "Delhi" },
    { id: "WH-003", name: "Regional Warehouse", location: "Bangalore" },
  ];

  const addVariant = () => {
    setVariants([...variants, { color: "", quantity: "", unit: "meters" }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const updateVariant = (index: number, field: string, value: string) => {
    const updated = variants.map((variant, i) =>
      i === index ? { ...variant, [field]: value } : variant
    );
    setVariants(updated);
  };

  const getTotalQuantity = () => {
    return variants.reduce((sum, variant) => {
      const qty = Number.parseFloat(variant.quantity) || 0;
      // Convert sets to meters if needed
      if (variant.unit === "sets") {
        return sum + qty * 60; // 1 set = 60 meters
      }
      return sum + qty;
    }, 0);
  };

  // Helper function to retry fetching product names
  const retryFetchProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError(null);

      const response = await fetch("http://localhost:4000/api/v1/products/all/names", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch product names: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setProductNames(data.productNames || []);
    } catch (err) {
      console.error("Error fetching product names:", err);
      setProductsError(
        err instanceof Error ? err.message : "Failed to fetch product names"
      );
    } finally {
      setProductsLoading(false);
    }
  };

  // Add this handler for form submission
  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validate that a product is selected
    if (!selectedProduct) {
      setError("Please select a product");
      setLoading(false);
      return;
    }

    try {
      // Map variants to backend schema
      const backendVariants = variants.map((v) => ({
        color: v.color,
        quantity:
          v.unit === "sets"
            ? (parseFloat(v.quantity) || 0) * 60
            : parseFloat(v.quantity) || 0,
        unit: v.unit.toUpperCase(),
      }));

      // Prepare stockDetails based on stockType
      let backendStockDetails: any = {};
      if (stockType === "gray") {
        backendStockDetails = {
          product: selectedProduct,
          factory: stockDetails.factory,
          agent: stockDetails.agent,
          orderNumber: stockDetails.orderNumber,
        };
      } else if (stockType === "factory") {
        backendStockDetails = {
          product: selectedProduct,
          processingFactory: stockDetails.factory,
          processingStage: stockDetails.processingStage,
          expectedCompletion: stockDetails.expectedCompletion,
        };
      } else if (stockType === "design") {
        backendStockDetails = {
          product: selectedProduct,
          design: stockDetails.design,
          warehouse: stockDetails.warehouse,
        };
      }

      // Prepare addtionalInfo (single object, not array)
      const backendAddtionalInfo = {
        batchNumber: addtionalInfo.batchNumber,
        qualityGrade: addtionalInfo.qualityGrade,
        notes: addtionalInfo.notes,
      };

      // Determine initial status based on total quantity
      const totalQuantity = backendVariants.reduce(
        (sum, variant) => sum + variant.quantity,
        0
      );
      let initialStatus = "available";
      if (totalQuantity === 0) {
        initialStatus = "out";
      } else if (totalQuantity < 100) {
        initialStatus = "low";
      } else if (stockType === "factory") {
        initialStatus = "processing";
      }

      const payload = {
        stockType:
          stockType === "gray"
            ? "Gray Stock"
            : stockType === "factory"
            ? "Factory Stock"
            : "Design Stock",
        status: initialStatus,
        variants: backendVariants,
        stockDetails: backendStockDetails,
        addtionalInfo: backendAddtionalInfo,
      };

      console.log("Sending payload:", payload); // Debug log

      const response = await fetch("http://localhost:4000/api/v1/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add stock");
      }

      const result = await response.json();
      console.log("Success:", result); // Debug log

      setSuccess(true);
      // Redirect to stock list after a short delay
      setTimeout(() => {
        router.push("/stock");
      }, 1500);
    } catch (err) {
      console.error("Error:", err); // Debug log
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
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
              <BreadcrumbLink href="/stock">Stock</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Add Stock</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* --- Demo: Adjustment Improvements --- */}
        <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded mb-4">
          <p className="text-orange-800 text-sm font-medium">
            Adjustment allows searching for products (no SKU required) and
            entering actual quantity.
          </p>
        </div>
        {/* --- End Demo --- */}
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
              <h2 className="text-2xl font-bold">Add Stock Entry</h2>
              <p className="text-muted-foreground">
                Add new stock to your inventory
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleAddStock}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Stock Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stock Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Stock Type</CardTitle>
                  <CardDescription>
                    Select the type of stock you're adding
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs
                    value={stockType}
                    onValueChange={setStockType}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="gray">Gray Stock</TabsTrigger>
                      <TabsTrigger value="factory">Factory Stock</TabsTrigger>
                      <TabsTrigger value="design">Design Stock</TabsTrigger>
                    </TabsList>

                    <TabsContent value="gray" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="product">Product</Label>
                          <Select
                            value={selectedProduct}
                            onValueChange={setSelectedProduct}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {productsLoading ? (
                                <div className="flex items-center justify-center p-4">
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  <span>Loading products...</span>
                                </div>
                              ) : productsError ? (
                                <div className="p-4 text-red-500 text-sm">
                                  <div>Error: {productsError}</div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={retryFetchProducts}
                                  >
                                    Retry
                                  </Button>
                                </div>
                              ) : productNames.length === 0 ? (
                                <div className="p-4 text-muted-foreground text-sm">
                                  No products available
                                </div>
                              ) : (
                                productNames.map((productName, index) => (
                                  <SelectItem
                                    key={index}
                                    value={productName}
                                  >
                                    {productName}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="factory">Factory</Label>
                          <Select
                            value={stockDetails.factory}
                            onValueChange={(value) =>
                              setStockDetails({
                                ...stockDetails,
                                factory: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select factory" />
                            </SelectTrigger>
                            <SelectContent>
                              {agentsLoading ? (
                                <div className="flex items-center justify-center p-4">
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  <span>Loading factories...</span>
                                </div>
                              ) : (
                                factories.map((factory, index) => (
                                  <SelectItem key={index} value={factory}>
                                    {factory}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="agent">Agent</Label>
                          <Select
                            value={stockDetails.agent}
                            onValueChange={(value) =>
                              setStockDetails({ ...stockDetails, agent: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select agent" />
                            </SelectTrigger>
                            <SelectContent>
                              {agentsLoading ? (
                                <div className="flex items-center justify-center p-4">
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  <span>Loading agents...</span>
                                </div>
                              ) : (
                                agents.map((agent) => (
                                  <SelectItem key={agent._id} value={agent.name}>
                                    {agent.name} - {agent.factory}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="order-number">Order Number</Label>
                          <Input
                            id="order-number"
                            placeholder="PO-2024-001"
                            value={stockDetails.orderNumber}
                            onChange={(e) =>
                              setStockDetails({
                                ...stockDetails,
                                orderNumber: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="factory" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="product">Product</Label>
                          <Select
                            value={selectedProduct}
                            onValueChange={setSelectedProduct}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {productsLoading ? (
                                <div className="flex items-center justify-center p-4">
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  <span>Loading products...</span>
                                </div>
                              ) : productsError ? (
                                <div className="p-4 text-red-500 text-sm">
                                  <div>Error: {productsError}</div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={retryFetchProducts}
                                  >
                                    Retry
                                  </Button>
                                </div>
                              ) : productNames.length === 0 ? (
                                <div className="p-4 text-muted-foreground text-sm">
                                  No products available
                                </div>
                              ) : (
                                productNames.map((productName, index) => (
                                  <SelectItem
                                    key={index}
                                    value={productName}
                                  >
                                    {productName}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="factory">Processing Factory</Label>
                          <Select
                            value={stockDetails.factory}
                            onValueChange={(value) =>
                              setStockDetails({
                                ...stockDetails,
                                factory: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select factory" />
                            </SelectTrigger>
                            <SelectContent>
                              {agentsLoading ? (
                                <div className="flex items-center justify-center p-4">
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  <span>Loading factories...</span>
                                </div>
                              ) : (
                                factories.map((factory, index) => (
                                  <SelectItem key={index} value={factory}>
                                    {factory}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="stage">Processing Stage</Label>
                          <Select
                            value={stockDetails.processingStage}
                            onValueChange={(value) =>
                              setStockDetails({
                                ...stockDetails,
                                processingStage: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dyeing">Dyeing</SelectItem>
                              <SelectItem value="printing">Printing</SelectItem>
                              <SelectItem value="finishing">
                                Finishing
                              </SelectItem>
                              <SelectItem value="quality-check">
                                Quality Check
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expected-completion">
                            Expected Completion
                          </Label>
                          <Input
                            id="expected-completion"
                            type="date"
                            value={stockDetails.expectedCompletion}
                            onChange={(e) =>
                              setStockDetails({
                                ...stockDetails,
                                expectedCompletion: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="design" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="product">Product</Label>
                          <Select
                            value={selectedProduct}
                            onValueChange={setSelectedProduct}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {productsLoading ? (
                                <div className="flex items-center justify-center p-4">
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  <span>Loading products...</span>
                                </div>
                              ) : productsError ? (
                                <div className="p-4 text-red-500 text-sm">
                                  <div>Error: {productsError}</div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={retryFetchProducts}
                                  >
                                    Retry
                                  </Button>
                                </div>
                              ) : productNames.length === 0 ? (
                                <div className="p-4 text-muted-foreground text-sm">
                                  No products available
                                </div>
                              ) : (
                                productNames.map((productName, index) => (
                                  <SelectItem
                                    key={index}
                                    value={productName}
                                  >
                                    {productName}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="design">Design</Label>
                          <Select
                            value={stockDetails.design}
                            onValueChange={(value) =>
                              setStockDetails({
                                ...stockDetails,
                                design: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select design" />
                            </SelectTrigger>
                            <SelectContent>
                              {designs.map((design) => (
                                <SelectItem key={design.id} value={design.id}>
                                  {design.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="warehouse">Warehouse</Label>
                        <Select
                          value={stockDetails.warehouse}
                          onValueChange={(value) =>
                            setStockDetails({
                              ...stockDetails,
                              warehouse: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select warehouse" />
                          </SelectTrigger>
                          <SelectContent>
                            {warehouses.map((warehouse) => (
                              <SelectItem
                                key={warehouse.id}
                                value={warehouse.id}
                              >
                                {warehouse.name} - {warehouse.location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Stock Variants */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Stock Variants</CardTitle>
                      <CardDescription>
                        Add different colors and quantities
                      </CardDescription>
                    </div>
                    <Button onClick={addVariant} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Variant
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {variants.map((variant, index) => (
                    <div
                      key={index}
                      className="flex gap-4 items-end p-4 border rounded-lg"
                    >
                      <div className="flex-1 space-y-2">
                        <Label>Color</Label>
                        <Input
                          placeholder="Enter color"
                          value={variant.color}
                          onChange={(e) =>
                            updateVariant(index, "color", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={variant.quantity}
                          onChange={(e) =>
                            updateVariant(index, "quantity", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>Unit</Label>
                        <Select
                          value={variant.unit}
                          onValueChange={(value) =>
                            updateVariant(index, "unit", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="meters">Meters</SelectItem>
                            <SelectItem value="sets">Sets</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {variants.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeVariant(index)}
                          className="text-red-600"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}

                  {variants.some((v) => v.unit === "sets") && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                      <p className="font-medium">Set Conversion:</p>
                      <p>• 1 Set (3 colors) = 180 meters (60m per color)</p>
                      <p>• 1 Set (2 colors) = 120 meters (60m per color)</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                  <CardDescription>
                    Extra details about this stock entry
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="batch-number">Batch Number</Label>
                      <Input
                        id="batch-number"
                        placeholder="BTH-2024-001"
                        value={addtionalInfo.batchNumber}
                        onChange={(e) =>
                          setAddtionalInfo({
                            ...addtionalInfo,
                            batchNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quality-grade">Quality Grade</Label>
                      <Select
                        value={addtionalInfo.qualityGrade}
                        onValueChange={(value) =>
                          setAddtionalInfo({
                            ...addtionalInfo,
                            qualityGrade: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Enter any additional notes..."
                      rows={3}
                      value={addtionalInfo.notes}
                      onChange={(e) =>
                        setAddtionalInfo({
                          ...addtionalInfo,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stock Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Stock Summary</CardTitle>
                  <CardDescription>Overview of stock entry</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    {stockType === "gray" && (
                      <Package className="h-4 w-4 text-blue-500" />
                    )}
                    {stockType === "factory" && (
                      <Factory className="h-4 w-4 text-orange-500" />
                    )}
                    {stockType === "design" && (
                      <Palette className="h-4 w-4 text-green-500" />
                    )}
                    <Badge variant="outline">
                      {stockType.charAt(0).toUpperCase() + stockType.slice(1)}{" "}
                      Stock
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {selectedProduct && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Selected Product
                        </span>
                        <span className="font-medium">
                          {selectedProduct}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Variants
                      </span>
                      <span className="font-medium">{variants.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Quantity
                      </span>
                      <span className="font-medium">
                        {getTotalQuantity().toLocaleString()} meters
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Entry Date</span>
                      <span className="font-medium">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stock Type Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Stock Type Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {stockType === "gray" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Gray Stock</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Unfinished fabric received from factories. Requires
                        further processing.
                      </p>
                    </div>
                  )}

                  {stockType === "factory" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Factory className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">Factory Stock</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Stock currently being processed at factories. Track
                        processing stages.
                      </p>
                    </div>
                  )}

                  {stockType === "design" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Design Stock</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Finished products ready for sale. Stored in warehouses.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {getTotalQuantity().toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Meters
                    </p>
                  </div>

                  {variants.some((v) => v.unit === "sets") && (
                    <div className="text-center">
                      <div className="text-lg font-medium text-blue-600">
                        {variants
                          .filter((v) => v.unit === "sets")
                          .reduce(
                            (sum, v) =>
                              sum + (Number.parseFloat(v.quantity) || 0),
                            0
                          )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Total Sets
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Adding..." : "Add Stock"}
            </Button>
            {error && <span className="text-red-500 ml-4">{error}</span>}
            {success && (
              <span className="text-green-600 ml-4">
                Stock added successfully!
              </span>
            )}
          </div>
        </form>
      </div>
    </SidebarInset>
  );
}