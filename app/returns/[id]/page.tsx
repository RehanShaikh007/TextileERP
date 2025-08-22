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
import {
  RotateCcw,
  ArrowLeft,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  User,
  Calendar,
  FileText,
  Tag,
  Ruler,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

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

export default function ReturnViewPage() {
  const params = useParams();
  const router = useRouter();
  const returnId = params.id as string;

  const [returnData, setReturnData] = useState<Return | null>(null);
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReturnData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch return details
        const returnResponse = await fetch(`${API_BASE_URL}/returns/${returnId}`);
        if (!returnResponse.ok) {
          throw new Error("Failed to fetch return details");
        }
        const returnResult = await returnResponse.json();
        setReturnData(returnResult.return);

        // Fetch order details if we have order ID
        if (returnResult.return.order) {
          const orderResponse = await fetch(`${API_BASE_URL}/order/${returnResult.return.order}`);
          if (orderResponse.ok) {
            const orderResult = await orderResponse.json();
            setOrderData(orderResult.order);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch return data");
      } finally {
        setLoading(false);
      }
    };

    if (returnId) {
      fetchReturnData();
    }
  }, [returnId]);

  const getStatusIcon = (isApprove: boolean, isRejected?: boolean) => {
    if (isRejected) return <AlertCircle className="h-4 w-4 text-red-500" />;
    return isApprove ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <Clock className="h-4 w-4 text-orange-500" />
    );
  };

  const getStatusText = (isApprove: boolean, isRejected?: boolean) => {
    if (isRejected) return "Rejected";
    return isApprove ? "Approved" : "Pending";
  };

  const getStatusColor = (isApprove: boolean, isRejected?: boolean) => {
    if (isRejected) return "destructive";
    return isApprove ? "default" : "secondary";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
              <BreadcrumbPage>Return {returnData.id}</BreadcrumbPage>
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
              onClick={() => router.push("/returns")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Returns
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Return {returnData.id}</h1>
              <p className="text-muted-foreground">
                Return request details and information
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/returns/${returnId}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Return
            </Button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {getStatusIcon(returnData.isApprove, returnData.isRejected)}
          <Badge variant={getStatusColor(returnData.isApprove, returnData.isRejected)}>
            {getStatusText(returnData.isApprove, returnData.isRejected)}
          </Badge>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Return Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Return Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Return ID</p>
                  <p className="font-medium">{returnData.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(returnData.date || returnData.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Product</p>
                  <p className="font-medium">{returnData.product}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Color</p>
                  <p className="font-medium">{returnData.color}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                  <p className="font-medium">{returnData.quantityInMeters} meters</p>
                </div>
                {returnData.refundAmount && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Refund Amount</p>
                    <p className="font-medium">₹{returnData.refundAmount.toLocaleString()}</p>
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Return Reason</p>
                <p className="mt-1 p-3 bg-muted rounded-md">{returnData.returnReason}</p>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer Name</p>
                <p className="font-medium">{returnData.customer}</p>
              </div>
              
                             {orderData && (
                 <>
                   <div>
                     <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                     <p className="font-medium">
                       {(() => {
                         const orderId = returnData.order || returnData.orderId;
                         if (!orderId) return "N/A";
                         const numericChars = orderId.replace(/[^0-9]/g, "");
                         const lastThreeDigits = numericChars.slice(-3).padStart(3, "0");
                         return `ORD-${lastThreeDigits}`;
                       })()}
                     </p>
                   </div>
                   <div>
                     <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                     <p className="font-medium">{formatDate(orderData.orderDate)}</p>
                   </div>
                   <div>
                     <p className="text-sm font-medium text-muted-foreground">Delivery Date</p>
                     <p className="font-medium">{formatDate(orderData.deliveryDate)}</p>
                   </div>
                 </>
               )}
            </CardContent>
          </Card>

          {/* Order Items (if available) */}
          {orderData && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Original Order Items
                </CardTitle>
                <CardDescription>
                  Items from the original order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-4 font-medium">Product</th>
                        <th className="text-left p-4 font-medium">Color</th>
                        <th className="text-left p-4 font-medium">Quantity</th>
                        <th className="text-left p-4 font-medium">Price per Meter</th>
                        <th className="text-left p-4 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.orderItems.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-4 font-medium">{item.product}</td>
                          <td className="p-4">{item.color}</td>
                          <td className="p-4">{item.quantity} meters</td>
                          <td className="p-4">₹{item.pricePerMeters}</td>
                          <td className="p-4 font-medium">
                            ₹{(item.quantity * item.pricePerMeters).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Return Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Return Request Created</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(returnData.createdAt)}
                    </p>
                  </div>
                </div>
                
                {returnData.isApprove && (
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Return Approved</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(returnData.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
                
                {returnData.isRejected && (
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Return Rejected</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(returnData.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}
