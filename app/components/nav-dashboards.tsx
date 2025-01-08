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
  
  export function NavDashboards({
    dashboards,
  }: {
    dashboards: {
      name: string
      url: string
    }[]
  }) {
    const { isMobile } = useSidebar()
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Dashboards</SidebarGroupLabel>
        <SidebarMenu>
          {dashboards.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <a href={item.url} title={item.name}>
                  <span>{item.name}</span>
                </a>
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
                    <Trash2 className="text-destructive" />
                    <span>Delete</span>
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
  