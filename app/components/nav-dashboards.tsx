import * as React from "react"
import {
    Share,
    Archive,
    MoreHorizontal,
    Pencil,
    Trash2,
  } from "lucide-react"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "./ui/dropdown-menu"
  import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
  } from "./ui/sidebar"
import { Form, Link, useLocation } from "@remix-run/react"
  
  export function NavDashboards({
    dashboards,
  }: {
    dashboards: {
      id: string
      name: string
      url: string
    }[]
  }) {
    // console.log('DASHBOARDS:', dashboards); 
    const { isMobile } = useSidebar()
    const [activeItem, setActiveItem] = React.useState('')
    console.log('ACTIVE ITEM:', activeItem);

    const location = useLocation();

    return (
      <SidebarGroup>
        <SidebarGroupLabel>Dashboards</SidebarGroupLabel>
        <SidebarMenu>
          {[...dashboards].reverse().map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
              isActive={location.pathname === item.url}
              onClick={() => setActiveItem(item.id)}
              asChild>
                <Link to={item.url} title={item.name}>
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  {/* Add a favorites option  */}
                  {/* <DropdownMenuItem>
                    <StarOff className="text-muted-foreground" />
                    <span>Remove from Favorites</span>
                  </DropdownMenuItem> */}
                  {/* <DropdownMenuSeparator /> */}
                  <DropdownMenuItem>
                    <Share className="text-muted-foreground" />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Pencil className="text-muted-foreground" />
                    <span>Rename</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Archive className="text-muted-foreground" />
                    <span>Archive</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <Form method="post" action="/chats/delete">
                      <input type="hidden" name="chatId" value={item.id} />
                      <button type="submit" className="w-full">
                        <Trash2 className="text-destructive" />
                        <span>Delete</span>
                      </button>
                    </Form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <MoreHorizontal />
              <span>More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    )
  }
  