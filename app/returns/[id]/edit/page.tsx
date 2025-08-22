"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  RotateCcw,
  ArrowLeft,
  Save,
  AlertCircle,
  Package,
  User,
  Calendar,
  FileText,
  Trash2,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Return {
  _id: string;
  id: string;
  orderId: string;
  order: string;
  customer: string;
  product: string;
  color: string;
  quantityInMeters: number;
  returnReason: string;
  isApprove: boolean;
  isRejected?: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
  refundAmount?: number;
}

interface Order {
  _id: string;
  customer: string;
  orderItems: OrderItem[];
  orderDate: string;
  deliveryDate: string;
  notes?: string;
}

interface OrderItem {
  product: string;
  color: string;
  quantity: number;
  pricePerMeters: number;
}

interface Product {
  _id: string;
  productName: string;
  variants: ProductVariant[];
}

interface ProductVariant {
  color: string;
}

export default function ReturnEditPage() {
  const params = useParams();
  const router = useRouter();
  const returnId = params.id as string;
  const { toast } = useToast();

  const [returnData, setReturnData] = useState<Return | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    order: "",
    product: "",
    color: "",
    quantityInMeters: 0,
    returnReason: "",
    refundAmount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch return details
        const returnResponse = await fetch(`${API_BASE_URL}/returns/${returnId}`);
        if (!returnResponse.ok) {
          throw new Error("Failed to fetch return details");
        }
        const returnResult = await returnResponse.json();
        const returnItem = returnResult.return;
        setReturnData(returnItem);

        // Set form data
        setFormData({
          order: returnItem.order || "",
          product: returnItem.product || "",
          color: returnItem.color || "",
          quantityInMeters: returnItem.quantityInMeters || 0,
          returnReason: returnItem.returnReason || "",
          refundAmount: returnItem.refundAmount || 0,
        });

        // Fetch orders
        const ordersResponse = await fetch(`${API_BASE_URL}/order`);
        if (ordersResponse.ok) {
          const ordersResult = await ordersResponse.json();
          setOrders(ordersResult.orders || []);
        }

        // Fetch products
        const productsResponse = await fetch(`${API_BASE_URL}/products`);
        if (productsResponse.ok) {
          const productsResult = await productsResponse.json();
          setProducts(productsResult.products || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (returnId) {
      fetchData();
    }
  }, [returnId]);

  // Get products for the selected order
  const getOrderProducts = (orderId: string) => {
    if (!orderId) return [];
    const selectedOrder = orders.find((order) => order._id === orderId);
    if (!selectedOrder) return [];

    const orderProducts = selectedOrder.orderItems.map(
      (item: OrderItem) => item.product
    );
    return products.filter((product) =>
      orderProducts.includes(product.productName)
    );
  };

  // Get colors for the selected product
  const getProductColors = (productName: string) => {
    if (!productName) return [];
    const selectedProduct = products.find(
      (product) => product.productName === productName
    );
    if (!selectedProduct) return [];

    return selectedProduct.variants.map(
      (variant: ProductVariant) => variant.color
    );
  };

  // Get available quantity for the selected order, product, and color
  const getAvailableQuantity = (
    orderId: string,
    productName: string,
    color: string
  ) => {
    if (!orderId || !productName || !color) return 0;

    const selectedOrder = orders.find((order) => order._id === orderId);
    if (!selectedOrder) return 0;

    const orderItem = selectedOrder.orderItems.find(
      (item: OrderItem) => item.product === productName && item.color === color
    );

    return orderItem ? orderItem.quantity : 0;
  };

  // Calculate refund amount based on order item price
  const calculateRefundAmount = () => {
    if (!formData.order || !formData.product || !formData.color || formData.quantityInMeters === 0) {
      return 0;
    }

    const selectedOrder = orders.find((order) => order._id === formData.order);
    if (!selectedOrder) return 0;

    const orderItem = selectedOrder.orderItems.find(
      (item: OrderItem) => item.product === formData.product && item.color === formData.color
    );

    if (orderItem) {
      return formData.quantityInMeters * orderItem.pricePerMeters;
    }

    // Fallback to estimated value if order item not found
    return formData.quantityInMeters * 450;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Reset dependent fields when order changes
    if (field === "order") {
      setFormData((prev) => ({
        ...prev,
        product: "",
        color: "",
        quantityInMeters: 0,
        refundAmount: 0,
      }));
    }

    // Reset color when product changes
    if (field === "product") {
      setFormData((prev) => ({
        ...prev,
        color: "",
        quantityInMeters: 0,
        refundAmount: 0,
      }));
    }

    // Auto-calculate refund amount when color or quantity changes
    if (field === "color" || field === "quantityInMeters") {
      const newFormData = {
        ...formData,
        [field]: value,
      };
      
      // Calculate new refund amount
      if (newFormData.order && newFormData.product && newFormData.color && newFormData.quantityInMeters > 0) {
        const selectedOrder = orders.find((order) => order._id === newFormData.order);
        if (selectedOrder) {
          const orderItem = selectedOrder.orderItems.find(
            (item: OrderItem) => item.product === newFormData.product && item.color === newFormData.color
          );
          if (orderItem) {
            const newRefundAmount = newFormData.quantityInMeters * orderItem.pricePerMeters;
            setFormData(prev => ({
              ...prev,
              [field]: value,
              refundAmount: newRefundAmount,
            }));
            return;
          }
        }
      }
      
      // Fallback calculation
      if (newFormData.order && newFormData.product && newFormData.color && newFormData.quantityInMeters > 0) {
        const newRefundAmount = newFormData.quantityInMeters * 450;
        setFormData(prev => ({
          ...prev,
          [field]: value,
          refundAmount: newRefundAmount,
        }));
        return;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);

      // Calculate the current refund amount before submitting
      const calculatedRefundAmount = calculateRefundAmount();
      
      const submitData = {
        ...formData,
        refundAmount: calculatedRefundAmount,
      };

      const response = await fetch(`${API_BASE_URL}/returns/${returnId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update return");
      }

      // Show success toast
      toast({
        title: "Return Updated Successfully",
        description: `Return ${returnData?.id} has been updated with the new details.`,
        variant: "default",
      });

      // Redirect to view page
      router.push(`/returns/${returnId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update return");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/returns/${returnId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete return");
      }

      // Show success toast
      toast({
        title: "Return Deleted Successfully",
        description: `Return ${returnData?.id} has been permanently deleted.`,
        variant: "default",
      });

      // Redirect to returns list
      router.push("/returns");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete return");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading return details...</p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  if (error || !returnData) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Error loading return</h3>
            <p className="text-muted-foreground mb-4">{error || "Return not found"}</p>
            <Button onClick={() => router.push("/returns")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Returns
            </Button>
          </div>
        </div>
      </SidebarInset>
    );
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
              <BreadcrumbLink href="/returns">Returns</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/returns/${returnId}`}>
                Return {returnData.id}
              </BreadcrumbLink>
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
              onClick={() => router.push(`/returns/${returnId}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Return
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Return {returnData.id}</h1>
              <p className="text-muted-foreground">
                Modify return request details
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Return Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Return Details
                </CardTitle>
                <CardDescription>
                  Update return information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <Select
                    value={formData.order}
                    onValueChange={(value) => handleInputChange("order", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select order" />
                    </SelectTrigger>
                    <SelectContent>
                      {orders.map((order) => {
                        const orderId = order._id;
                        const numericChars = orderId.replace(/[^0-9]/g, "");
                        const lastThreeDigits = numericChars.slice(-3).padStart(3, "0");
                        const formattedOrderId = `ORD-${lastThreeDigits}`;

                        return (
                          <SelectItem key={order._id} value={order._id}>
                            {formattedOrderId} - {order.customer}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product">Product</Label>
                  <Select
                    value={formData.product}
                    onValueChange={(value) => handleInputChange("product", value)}
                    disabled={!formData.order}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        formData.order ? "Select product" : "Select order first"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {getOrderProducts(formData.order).map((product) => (
                        <SelectItem
                          key={product._id}
                          value={product.productName}
                        >
                          {product.productName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Select
                      value={formData.color}
                      onValueChange={(value) => handleInputChange("color", value)}
                      disabled={!formData.product}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          formData.product ? "Select color" : "Select product first"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {getProductColors(formData.product).map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity (meters)</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantityInMeters}
                      onChange={(e) =>
                        handleInputChange("quantityInMeters", Number(e.target.value))
                      }
                      max={getAvailableQuantity(
                        formData.order,
                        formData.product,
                        formData.color
                      )}
                    />
                    {formData.order && formData.product && formData.color && (
                      <p className="text-sm text-muted-foreground">
                        Available: {getAvailableQuantity(
                          formData.order,
                          formData.product,
                          formData.color
                        )} meters
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refundAmount">Refund Amount (₹)</Label>
                  <Input
                    id="refundAmount"
                    type="number"
                    value={calculateRefundAmount()}
                    disabled
                    className="bg-muted cursor-not-allowed"
                    placeholder="Auto-calculated"
                  />
                  <p className="text-sm text-muted-foreground">
                    Amount is automatically calculated based on product price and quantity
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Return Reason */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Return Reason
                </CardTitle>
                <CardDescription>
                  Describe the reason for the return
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    value={formData.returnReason}
                    onChange={(e) =>
                      handleInputChange("returnReason", e.target.value)
                    }
                    placeholder="Describe the reason for return..."
                    rows={8}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

                     {/* Action Buttons */}
           <div className="flex gap-4 justify-end">
             <Button
               type="button"
               variant="outline"
               onClick={() => router.push(`/returns/${returnId}`)}
               disabled={saving}
             >
               Cancel
             </Button>
             <Button type="submit" disabled={saving}>
               {saving ? (
                 <>
                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                   Saving...
                 </>
               ) : (
                 <>
                   <Save className="h-4 w-4 mr-2" />
                   Save Changes
                 </>
               )}
             </Button>
             {/* Delete Button with AlertDialog */}
           <div className="flex justify-center">
             <AlertDialog>
               <AlertDialogTrigger asChild>
                 <Button
                   type="button"
                   variant="destructive"
                   disabled={saving || deleting}
                   className="w-full max-w-xs"
                 >
                   <Trash2 className="h-4 w-4 mr-2" />
                   Delete Return
                 </Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                 <AlertDialogHeader>
                   <AlertDialogTitle>Delete this return?</AlertDialogTitle>
                   <AlertDialogDescription>
                     This action cannot be undone. This will permanently delete the return
                     request and remove it from our servers.
                   </AlertDialogDescription>
                 </AlertDialogHeader>
                 <AlertDialogFooter>
                   <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                   <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                     {deleting ? (
                       <>
                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                         Deleting...
                       </>
                     ) : (
                       "Delete"
                     )}
                   </AlertDialogAction>
                 </AlertDialogFooter>
               </AlertDialogContent>
             </AlertDialog>
           </div>
           </div>
        </form>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </SidebarInset>
  );
}
