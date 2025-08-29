"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Users, Plus, Edit, Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { API_BASE_URL } from "@/lib/api";

// User interface matching the backend model
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Form data interface
interface UserFormData {
  name: string;
  email: string;
  role: string;
}

// Business form data interface
interface BusinessFormData {
  businessName: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
}

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "sales",
  });

  const [businessFormData, setBusinessFormData] = useState<BusinessFormData>({
    businessName: "",
    gstNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
  });

  const { toast } = useToast();

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const createUser = async () => {
    if (!userFormData.name || !userFormData.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userFormData),
      });

      if (response.ok) {
        const newUser = await response.json();
        setUsers([newUser, ...users]);
        setUserFormData({ name: "", email: "", role: "sales" });
        setIsCreateDialogOpen(false);
        toast({
          title: "Success",
          description: "User created successfully",
          variant: "default",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create user");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create user",
        variant: "destructive",
      });
    }
  };

  // Update user
  const updateUser = async () => {
    if (!editingUser || !userFormData.name || !userFormData.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/user/${editingUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userFormData),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(
          users.map((user) =>
            user._id === editingUser._id ? updatedUser : user
          )
        );
        setUserFormData({ name: "", email: "", role: "sales" });
        setEditingUser(null);
        setIsEditDialogOpen(false);
        toast({
          title: "Success",
          description: "User updated successfully",
          variant: "default",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update user",
        variant: "destructive",
      });
    }
  };

  // Delete user
  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
        toast({
          title: "Success",
          description: "User deleted successfully",
          variant: "default",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  // Handle form input changes
  const handleUserInputChange = (field: keyof UserFormData, value: string) => {
    setUserFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBusinessInputChange = (
    field: keyof BusinessFormData,
    value: string
  ) => {
    setBusinessFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fetch business data
  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/business`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setBusinessFormData({
              businessName: data.businessName ?? "",
              gstNumber: data.gstNumber ?? "",
              address: data.address ?? "",
              city: data.city ?? "",
              state: data.state ?? "",
              pincode: data.pincode ?? "",
              phone: data.phone ?? "",
              email: data.email ?? "",
            });
          } else {
            setBusinessFormData({
              businessName: "",
              gstNumber: "",
              address: "",
              city: "",
              state: "",
              pincode: "",
              phone: "",
              email: "",
            });
          }
        } else {
          console.error("Failed to fetch business data");
        }
      } catch (error) {
        console.error("Error fetching business data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch business data.",
          variant: "destructive",
        });
      }
    };

    fetchBusinessData();
    fetchUsers();
  }, []);

  const updateBusinessData = async () => {
    try {
      if (
        !businessFormData.phone.startsWith("+91") ||
        businessFormData.phone.includes(" ") ||
        businessFormData.phone.length !== 13
      ) {
        toast({
          title: "Validation Error",
          description:
            "Phone number must be in the format +91XXXXXXXXXX with no spaces.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/business`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(businessFormData),
      });
      if (!response.ok) {
        console.error("Failed to update business data");
      }
      toast({
        title: "Success",
        description: "Business data updated successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating business data:", error);
      toast({
        title: "Error",
        description: "Failed to update business data.",
        variant: "destructive",
      });
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
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">
            Manage your system preferences and configuration
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Preferences</CardTitle>
                <CardDescription>
                  Configure general system settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select defaultValue="inr">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                        <SelectItem value="usd">US Dollar ($)</SelectItem>
                        <SelectItem value="eur">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="ist">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ist">
                          India Standard Time (IST)
                        </SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">
                          Eastern Standard Time
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select defaultValue="dd-mm-yyyy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                        <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="mr">Marathi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="darkMode"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) =>
                      setTheme(checked ? "dark" : "light")
                    }
                  />
                  <Label htmlFor="darkMode">Enable dark mode</Label>
                </div>

                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Update your business details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={businessFormData.businessName}
                      onChange={(e) =>
                        handleBusinessInputChange(
                          "businessName",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <Input
                      id="gstNumber"
                      placeholder="Enter GST number"
                      value={businessFormData.gstNumber}
                      onChange={(e) =>
                        handleBusinessInputChange("gstNumber", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter complete address"
                    value={businessFormData.address}
                    onChange={(e) =>
                      handleBusinessInputChange("address", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={businessFormData.city}
                      onChange={(e) =>
                        handleBusinessInputChange("city", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="State"
                      value={businessFormData.state}
                      onChange={(e) =>
                        handleBusinessInputChange("state", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      placeholder="Pincode"
                      value={businessFormData.pincode}
                      onChange={(e) =>
                        handleBusinessInputChange("pincode", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+91XXXXXXXXXX"
                      value={businessFormData.phone}
                      onChange={(e) =>
                        handleBusinessInputChange("phone", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="business@example.com"
                      value={businessFormData.email}
                      onChange={(e) =>
                        handleBusinessInputChange("email", e.target.value)
                      }
                    />
                  </div>
                </div>

                <Button onClick={() => updateBusinessData()}>
                  Update Business Info
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </div>
                  <Dialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                        <DialogDescription>
                          Add a new user to the system
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="createName">Name</Label>
                          <Input
                            id="createName"
                            value={userFormData.name}
                            onChange={(e) =>
                              handleUserInputChange("name", e.target.value)
                            }
                            placeholder="Enter user name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="createEmail">Email</Label>
                          <Input
                            id="createEmail"
                            type="email"
                            value={userFormData.email}
                            onChange={(e) =>
                              handleUserInputChange("email", e.target.value)
                            }
                            placeholder="Enter user email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="createRole">Role</Label>
                          <Select
                            value={userFormData.role}
                            onValueChange={(value) =>
                              handleUserInputChange("role", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="owner">Owner</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="inventory head">
                                Inventory Head
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsCreateDialogOpen(false);
                            setUserFormData({
                              name: "",
                              email: "",
                              role: "user",
                            });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={createUser}>Create User</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
                <CardDescription>
                  Manage system users and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Loading users...</div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No users found</p>
                    <p className="text-sm text-muted-foreground">
                      Create your first user to get started
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <span className="capitalize bg-primary/10 text-primary px-2 py-1 rounded-sm text-sm">
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteUser(user._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {/* Edit User Dialog */}
                <Dialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit User</DialogTitle>
                      <DialogDescription>
                        Update user information
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="editName">Name</Label>
                        <Input
                          id="editName"
                          value={userFormData.name}
                          onChange={(e) =>
                            handleUserInputChange("name", e.target.value)
                          }
                          placeholder="Enter user name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editEmail">Email</Label>
                        <Input
                          id="editEmail"
                          type="email"
                          value={userFormData.email}
                          onChange={(e) =>
                            handleUserInputChange("email", e.target.value)
                          }
                          placeholder="Enter user email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editRole">Role</Label>
                        <Select
                          value={userFormData.role}
                          onValueChange={(value) =>
                            handleUserInputChange("role", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="inventory head">
                              Inventory Head
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditDialogOpen(false);
                          setEditingUser(null);
                          setUserFormData({
                            name: "",
                            email: "",
                            role: "sales",
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={updateUser}>Update User</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  );
}
