import { NavDashboards } from "./nav-dashboards"
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
} from "./ui/sidebar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "./ui/dropdown-menu"  

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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavDashboards dashboards={data.dashboards} />
      </SidebarContent>
      <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> Username
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
