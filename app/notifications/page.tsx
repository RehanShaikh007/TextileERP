"use client";

import { useState, useEffect, JSX } from "react";
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
import { Switch } from "@/components/ui/switch";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Plus,
  Settings,
  Bell,
  Users,
  Package,
  ShoppingCart,
  AlertTriangle,
} from "lucide-react";

// Types
interface Admin {
  id: number;
  name: string;
  number: string;
  role: string;
  active: boolean;
}

interface NotificationSettings {
  orderUpdates: boolean;
  stockAlerts: boolean;
  lowStockWarnings: boolean;
  newCustomers: boolean;
  dailyReports: boolean;
  returnRequests: boolean;
  productUpdates: boolean;
}

type NotificationType =
  | "stock_alert"
  | "order_update"
  | "return_request"
  | "product_update";

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  timestamp: string;
  status: string;
  sentToCount: number;
}

export default function NotificationsPage() {
  const [adminNumbers, setAdminNumbers] = useState<Admin[]>([
    {
      id: 1,
      name: "Rajesh Kumar",
      number: "+91 98765 43210",
      role: "Owner",
      active: true,
    },
    {
      id: 2,
      name: "Priya Sharma",
      number: "+91 87654 32109",
      role: "Manager",
      active: true,
    },
    {
      id: 3,
      name: "Amit Patel",
      number: "+91 76543 21098",
      role: "Sales Head",
      active: false,
    },
  ]);

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      orderUpdates: false,
      stockAlerts: false,
      lowStockWarnings: false,
      newCustomers: false,
      dailyReports: false,
      returnRequests: false,
      productUpdates: false,
    });

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Fetch current settings from backend on page load
  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      try {
        const res = await fetch(
          "http://localhost:4000/api/v1/whatsapp-notifications"
        );
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data: NotificationSettings = await res.json();
        setNotificationSettings(data);
      } catch (err) {
        console.error("Error fetching notification settings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const [recentNotifications, setRecentNotifications] = useState<
    Notification[]
  >([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      setLoadingNotifications(true);
      try {
        const res = await fetch(
          "http://localhost:4000/api/v1/whatsapp-messages"
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.messages)) {
          setRecentNotifications(
            data.messages.map((msg: any) => ({
              id: msg._id,
              type: msg.type,
              message: msg.message,
              timestamp: new Date(msg.createdAt).toLocaleString(),
              sent: msg.status === "Delivered",
              recipients: msg.sentToCount,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoadingNotifications(false);
      }
    }
    fetchNotifications();
  }, []);

  function Spinner(): JSX.Element {
    return (
      <svg className="animate-spin h-6 w-6 text-primary" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    );
  }

  const getNotificationIcon = (type: NotificationType): JSX.Element => {
    switch (type) {
      case "stock_alert":
        return <Package className="h-4 w-4 text-orange-500" />;
      case "order_update":
        return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      case "return_request":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "product_update":
        return <Bell className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const toggleNotificationSetting = (setting: keyof NotificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        "http://localhost:4000/api/v1/whatsapp-notifications",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notificationSettings),
        }
      );
      if (!res.ok) throw new Error("Failed to save settings");
      console.log("Settings saved successfully");
    } catch (err) {
      console.error("Error saving settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const notificationStats = {
    activeAdmins: adminNumbers.filter((admin) => admin.active).length,
    todayAlerts: 12,
    stockAlerts: 5,
    successRate: 98.5,
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
              <BreadcrumbPage>WhatsApp Notifications</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">WhatsApp Notifications</h2>
            <p className="text-muted-foreground">
              Manage admin numbers and notification settings
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Admin Number
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Admin Number</DialogTitle>
                <DialogDescription>
                  Add a new admin number for WhatsApp notifications
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Admin Name</Label>
                  <Input id="name" placeholder="Enter admin name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">WhatsApp Number</Label>
                  <Input id="number" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" placeholder="e.g., Manager, Owner" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="active" defaultChecked />
                  <Label htmlFor="active">Active notifications</Label>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">Add Admin</Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Admins
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {notificationStats.activeAdmins}
              </div>
              <p className="text-xs text-muted-foreground">
                Receiving notifications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Alerts
              </CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {notificationStats.todayAlerts}
              </div>
              <p className="text-xs text-muted-foreground">
                Notifications sent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Stock Alerts
              </CardTitle>
              <Package className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {notificationStats.stockAlerts}
              </div>
              <p className="text-xs text-muted-foreground">Low stock items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Success Rate
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {notificationStats.successRate}%
              </div>
              <p className="text-xs text-muted-foreground">Delivery success</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Admin Numbers */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Numbers</CardTitle>
              <CardDescription>
                Manage WhatsApp numbers for notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {adminNumbers.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{admin.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {admin.number}
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {admin.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={admin.active}
                      onCheckedChange={(checked) => {
                        setAdminNumbers((prev) =>
                          prev.map((a) =>
                            a.id === admin.id ? { ...a, active: checked } : a
                          )
                        );
                      }}
                    />
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notification Settings */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner />
              <span className="ml-3 text-muted-foreground">
                Loading settings...
              </span>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure which notifications to send
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    key: "orderUpdates",
                    label: "Order Updates",
                    desc: "New orders, status changes, deliveries",
                  },
                  {
                    key: "stockAlerts",
                    label: "Stock Alerts",
                    desc: "Stock movements and updates",
                  },
                  {
                    key: "lowStockWarnings",
                    label: "Low Stock Warnings",
                    desc: "When stock falls below minimum",
                  },
                  {
                    key: "newCustomers",
                    label: "New Customers",
                    desc: "When new customers are added",
                  },
                  {
                    key: "dailyReports",
                    label: "Daily Reports",
                    desc: "End of day summary reports",
                  },
                  {
                    key: "returnRequests",
                    label: "Return Requests",
                    desc: "New return requests from customers",
                  },
                  {
                    key: "productUpdates",
                    label: "Product Updates",
                    desc: "Create, update, or delete product notifications",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings[item.key as keyof NotificationSettings]}
                      onCheckedChange={() =>
                        toggleNotificationSetting(item.key as keyof NotificationSettings)
                      }
                    />
                  </div>
                ))}

                {/* Save Button */}
                <Button
                  onClick={saveSettings}
                  disabled={saving}
                  className="mt-4"
                >
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>
              Latest WhatsApp notifications sent to admins
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{notification.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{notification.timestamp}</span>
                      <span>Sent to {notification.sentToCount} admins</span>
                      {notification.status === "Delivered" && (
                        <Badge variant="outline" className="text-xs">
                          Delivered
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
