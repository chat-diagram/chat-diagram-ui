"use client";

import {
  ChevronsUpDown,
  CreditCard,
  Crown,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";

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
import { useDeleteUser, useLogout } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useAppStore } from "@/store/app";
import Link from "next/link";

const SettingDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [activeTab, setActiveTab] = useState("account");
  const Item = ({
    children,
    right,
  }: {
    children: React.ReactNode;
    right?: React.ReactNode;
  }) => {
    return (
      <div className="flex items-center justify-between gap-2 p-2 text-sm  ">
        <div>{children}</div>
        <div>{right}</div>
      </div>
    );
  };
  const { user } = useAppStore();
  const { mutate: deleteUser } = useDeleteUser();
  const handleDeleteUser = () => {
    if (!user?.id) {
      return;
    }
    deleteUser(user?.id);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader></DialogHeader>
      <DialogContent>
        <DialogTitle>Settings</DialogTitle>
        <Tabs
          defaultValue="account"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList muted className="flex w-full ">
            <TabsTrigger value="common" className="flex-1">
              通用设置
            </TabsTrigger>
            <TabsTrigger value="account" className="flex-1">
              账户信息
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {activeTab === "account" && (
          <div className="px-0">
            <Item right={user?.email}>电子邮件</Item>
            <Separator />
            <Item
              right={
                user?.subscription?.isPro ? (
                  // "Pro"
                  <Badge variant="secondary" className="h-4 gap-1 px-1 text-sm">
                    <Crown style={{ height: "1rem", width: "1rem" }} />
                    <span> PRO</span>
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm">
                    <Link href="/payment">升级Pro</Link>
                  </Button>
                )
              }
            >
              订阅
            </Item>
            <Separator />
            <Item
              right={
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteUser}
                >
                  注销
                </Button>
              }
            >
              注销账号
            </Item>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();

  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
  };
  const router = useRouter();
  const isPro = user?.subscription?.isPro;

  const [settingDialogOpen, setSettingDialogOpen] = useState(false);

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
              <DropdownMenuItem onClick={() => setSettingDialogOpen(true)}>
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

        <SettingDialog
          open={settingDialogOpen}
          onOpenChange={setSettingDialogOpen}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
