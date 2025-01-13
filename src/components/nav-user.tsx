"use client";

import {
  Bell,
  ChevronsUpDown,
  CreditCard,
  Crown,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@/types/auth";
import { Avatar } from "./avatar";
import { useLogout } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { ModeToggle } from "./toggle-mode";

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();

  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
  };
  const router = useRouter();
  const isPro = user?.subscription?.isPro;

  // const { user:userState } = useAppStore();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user?.avatar || "/avatars/shadcn.jpg"}
                  alt={user?.username || ""}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar> */}
              <Avatar name={user?.username || ""} size="sm" rounded={false} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold">
                    {user?.username}
                  </span>
                  {isPro && (
                    <Badge
                      variant="secondary"
                      className="h-4 gap-1 px-1 text-xs"
                    >
                      <Crown style={{ height: "0.75rem", width: "0.75rem" }} />
                      <span> PRO</span>
                    </Badge>
                  )}
                </div>

                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                
                <Avatar name={user?.username || ""} size="sm" rounded={false} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.username}
                    
                  </span>

                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel> */}
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={(e) => {
                  if (isPro) {
                    e.preventDefault();
                    return;
                  }
                  router.push("/payment");
                }}
              >
                {user?.subscription?.isPro ? <Crown /> : <Sparkles />}
                {/* Upgrade to Pro */}
                {user?.subscription?.isPro ? "Pro Member" : "Upgrade to Pro"}
                {isPro && (
                  <Badge variant="secondary" className="ml-auto">
                    Active
                  </Badge>
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Settings />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/payment/billings")}
              >
                <CreditCard />
                Billing
                {isPro && (
                  <Badge variant="secondary" className="ml-auto">
                    Pro
                  </Badge>
                )}
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <Bell />
                Notifications
                <Badge variant="secondary" className="ml-auto">
                  0
                </Badge>
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleLogout()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
