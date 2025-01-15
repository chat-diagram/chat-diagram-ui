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
import { ModeToggle } from "./toggle-mode";
import { LanguageSwitcher } from "./language-switcher";
import { useI18n } from "@/i18n";

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
  const t = useI18n();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader></DialogHeader>
      <DialogContent>
        <DialogTitle>{t("account.nav.settingsDialog.title")}</DialogTitle>
        <Tabs
          defaultValue="account"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList muted className="flex w-full ">
            <TabsTrigger value="common" className="flex-1">
              {t("account.nav.settingsDialog.common")}
            </TabsTrigger>
            <TabsTrigger value="account" className="flex-1">
              {t("account.nav.settingsDialog.account")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {activeTab === "account" && (
          <div className="px-0">
            <Item right={user?.email}>
              {t("account.nav.settingsDialog.email")}
            </Item>
            <Separator />
            <Item
              right={
                user?.subscription?.isPro ? (
                  // "Pro"
                  <Badge variant="secondary" className="h-4 gap-1 px-1 text-sm">
                    <Crown style={{ height: "1rem", width: "1rem" }} />
                    <span> {t("account.nav.subscription.pro")}</span>
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm">
                    <Link href="/payment">
                      {t("account.nav.settingsDialog.upgrade")}
                    </Link>
                  </Button>
                )
              }
            >
              {t("account.nav.settingsDialog.subscription")}
            </Item>
            <Separator />
            <Item
              right={
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteUser}
                >
                  {t("account.nav.settingsDialog.cancelBtn")}
                </Button>
              }
            >
              {t("account.nav.settingsDialog.cancel")}
            </Item>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export function NavUser({ user }: { user: User }) {
  const t = useI18n();
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
                      <span>{t("account.nav.subscription.pro")}</span>
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
            <DropdownMenuLabel>{t("account.nav.title")}</DropdownMenuLabel>
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
                {user?.subscription?.isPro
                  ? t("account.nav.subscription.proMember")
                  : t("account.nav.upgrade")}
                {isPro && (
                  <Badge variant="secondary" className="ml-auto">
                    {t("account.nav.subscription.active")}
                  </Badge>
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setSettingDialogOpen(true)}>
                <Settings />
                {t("account.nav.settings")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/payment/billings")}
              >
                <CreditCard />
                {t("account.nav.billing")}
                {isPro && (
                  <Badge variant="secondary" className="ml-auto">
                    {t("account.nav.subscription.pro")}
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
            <DropdownMenuGroup>
              {/* <DropdownMenuLabel> */}
              <div className="py-1">
                <span className="text-xs ml-2 text-foreground/70 ">
                  {t("account.nav.preferences")}
                </span>
              </div>
              <div className="py-1">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-sm ml-2">
                    <span>{t("account.nav.theme")}</span>
                  </div>
                  <ModeToggle />
                </div>
              </div>
              <div className="py-1">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-sm ml-2">
                    <span>{t("account.nav.language")}</span>
                  </div>
                  <LanguageSwitcher />
                </div>
              </div>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleLogout()}>
              <LogOut />
              {t("account.nav.logout")}
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
