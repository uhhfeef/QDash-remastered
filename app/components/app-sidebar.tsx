import { NavDashboards } from "./nav-dashboards"
import { NavMain } from "./nav-main"
import { CircleHelp, LifeBuoy, Inbox, BookOpen, Settings, User2, ChevronUp } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader
} from "./ui/sidebar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "./ui/dropdown-menu"  

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

import { Button } from "./ui/button"

// Menu items.
const data = {
    items: [
        {
          title: "Support",
          url: "#",
          icon: LifeBuoy,
        },
        {
          title: "Help",
          url: "#",
          icon: CircleHelp,
        },
        {
          title: "Documentation",
          url: "#",
          icon: BookOpen,
        },
        {
          title: "Settings",
          url: "#",
          icon: Settings,
        },
      ],
    dashboards: [
        {
            name: "Dashboard 1 (shud be dynamic)",
            url: "#",
        },
        {
            name: "Dashboard 2 (shud be dynamic)",
            url: "#",
        }
    ],
}


export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="mb-2">
        <SidebarMenu>
          <SidebarMenuItem >
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="QDash"
                className="h-8 w-auto block"
              />
              <span className="font-semibold text-lg font-outfit">QDash</span> 
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Button className="mx-4 rounded-md" variant="outline">New Dashboard</Button>

      <SidebarContent>
        <NavMain items={data.items} />
        <NavDashboards dashboards={data.dashboards} />
      </SidebarContent>
      <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="h-12">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>AK</AvatarFallback>
                    </Avatar>
                    <span>Afeef</span>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

    </Sidebar>
  )
}
