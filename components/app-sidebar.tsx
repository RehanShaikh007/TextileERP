"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Package,
  ShoppingCart,
  Users,
  RotateCcw,
  BarChart3,
  Bell,
  Settings,
  Home,
  Warehouse,
  ChevronRight,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

const data = {
  navMain: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: Home,
          badge: null,
        },
      ],
    },
    {
      title: "Inventory",
      items: [
        {
          title: "Products",
          url: "/products",
          icon: Package,
          badge: "156",
        },
        {
          title: "Stock",
          url: "/stock",
          icon: Warehouse,
          badge: "12",
          badgeVariant: "destructive" as const,
        },
      ],
    },
    {
      title: "Sales",
      items: [
        {
          title: "Orders",
          url: "/orders",
          icon: ShoppingCart,
          badge: "8",
          badgeVariant: "default" as const,
        },
        {
          title: "Customers",
          url: "/customers",
          icon: Users,
          badge: "45",
        },
        {
          title: "Agents",
          url: "/agents",
          icon: Users,
          badge: "4",
        },
        {
          title: "Returns",
          url: "/returns",
          icon: RotateCcw,
          badge: "3",
          badgeVariant: "secondary" as const,
        },
      ],
    },
    {
      title: "Analytics",
      items: [
        {
          title: "Reports",
          url: "/reports",
          icon: BarChart3,
          badge: null,
        },
        {
          title: "Notifications",
          url: "/notifications",
          icon: Bell,
          badge: "2",
          badgeVariant: "destructive" as const,
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
          badge: null,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { setOpenMobile, isMobile } = useSidebar()

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-sidebar-primary-foreground">
            <Package className="size-4 text-white" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Textile ERP</span>
            <span className="truncate text-xs text-muted-foreground">Management System</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url} onClick={handleLinkClick}>
                        <item.icon />
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge variant={item.badgeVariant || "secondary"} className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight className="ml-auto size-4 opacity-50" />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-green-500" />
            <span>System Online</span>
          </div>
          <div className="mt-1">v2.1.0</div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
