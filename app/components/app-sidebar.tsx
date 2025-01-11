import { NavDashboards } from "./nav-dashboards"
import { NavMain } from "./nav-main"
import { CircleHelp, LifeBuoy, Ellipsis, Inbox, BookOpen, Settings, User2, ChevronUp } from "lucide-react"
import { Separator } from "./ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb"
import { Outlet, useLocation, Form } from "@remix-run/react"
import { AccountSettingsDialog } from "./accountSettings"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
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
    DropdownMenuLabel,
    DropdownMenuSeparator
  } from "./ui/dropdown-menu"  

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"


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
  const location = useLocation();
  const isNewRoute = location.pathname === "/new";

  return (
    <SidebarProvider>
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
        <div className="px-4 mb-2">
        <Form method="post" action="/chats/new">
          <Button type="submit" className="w-full rounded-md" variant="outline">New Dashboard</Button>
        </Form>
        </div>

        <SidebarContent>
          <NavMain items={data.items} />
          <Separator />
          <NavDashboards dashboards={data.dashboards} />
        </SidebarContent>
        
        <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
              <Dialog>
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
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <span>Account</span>
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <AccountSettingsDialog />

                    
                    <DropdownMenuItem>
                      <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                </Dialog>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
      </Sidebar>
      
      <SidebarInset>
        {/* If its in not a new route render the below breadrumb */}
        {!isNewRoute && (
          <header className="flex justify-between items-center h-16 shrink-0  gap-2 border-b px-4">
            <div className="flex items-center">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Project
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Sales dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            </div>
            <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis className="h-6 w-6"/>  
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem>Favorite</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </header>
          // KEEP BELOW IN CASE
            // {/* <div className="flex flex-1 flex-col gap-4 p-4">
            //   <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            //     <div className="aspect-video rounded-xl bg-muted/100" />
            //     <div className="aspect-video rounded-xl bg-muted/100" />
            //     <div className="aspect-video rounded-xl bg-muted/100" />
            //   </div>
            //   <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            // </div> */}
        )}
        <div className="flex-1 h-[calc(100vh-4rem)] overflow-hidden">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
