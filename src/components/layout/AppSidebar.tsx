import { Link, useLocation } from "react-router-dom";
import { useRole } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  Home,
  Library,
  PlusCircle,
  Settings,
  User,
  Users,
  BookCopy,
  BookMarked,
  Moon,
  Sun,
  Info,
  List,
  HelpCircle,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AppSidebar() {
  const { t } = useTranslation();
  const { role } = useRole();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  const customerMenuItems = [
    {
      title: t("sidebar.home"),
      icon: BookOpen,
      href: "/",
    },
    {
      title: t("sidebar.libraries"),
      icon: Library,
      href: "/libraries",
    },
    {
      title: t("sidebar.myBooks"),
      icon: BookMarked,
      href: "/my-books",
    },
    {
      title: t("sidebar.about"),
      icon: Info,
      href: "/about",
    },
    {
      title: t("sidebar.help"),
      icon: HelpCircle,
      href: "/help",
    },
  ];

  const librarianMenuItems = [
    {
      title: t("sidebar.dashboard"),
      icon: BookOpen,
      href: "/",
    },
    {
      title: t("sidebar.books"),
      icon: BookMarked,
      href: "/books",
    },
    {
      title: t("sidebar.users"),
      icon: Users,
      href: "/users",
    },
    {
      title: t("sidebar.settings"),
      icon: Settings,
      href: "/settings",
    },
    {
      title: t("sidebar.about"),
      icon: Info,
      href: "/about",
    },
  ];

  const menuItems =
    role === "customer" ? customerMenuItems : librarianMenuItems;

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center px-4 py-2">
        <BookOpen className="w-6 h-6 text-sidebar-primary" />
        <span className="ml-2 text-xl font-semibold">Library</span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={t("sidebar.dashboard")}
              isActive={isActive("/dashboard")}
            >
              <Link to="/dashboard">
                <Home className="w-4 h-4 mr-2" />
                {t("sidebar.dashboard")}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={t("sidebar.bookCatalog")}
              isActive={isActive("/books")}
            >
              <Link to="/books">
                <Library className="w-4 h-4 mr-2" />
                {t("sidebar.bookCatalog")}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={t("sidebar.about")}
              isActive={isActive("/about")}
            >
              <Link to="/about">
                <Info className="w-4 h-4 mr-2" />
                {t("sidebar.about")}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={t("sidebar.libraries")}
              isActive={isActive("/libraries")}
            >
              <Link to="/libraries">
                <List className="w-4 h-4 mr-2" />
                {t("sidebar.libraries")}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {role === "customer" && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={t("sidebar.myBooks")}
                isActive={isActive("/my-books")}
              >
                <Link to="/my-books">
                  <BookMarked className="w-4 h-4 mr-2" />
                  {t("sidebar.myBooks")}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {role === "librarian" && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={t("sidebar.addBook")}
                  isActive={isActive("/add-book")}
                >
                  <Link to="/add-book">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    {t("sidebar.addBook")}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={t("sidebar.userManagement")}
                  isActive={isActive("/users")}
                >
                  <Link to="/users">
                    <Users className="w-4 h-4 mr-2" />
                    {t("sidebar.userManagement")}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

          {isAuthenticated && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={t("sidebar.profile")}
                isActive={isActive("/profile")}
              >
                <Link to="/profile">
                  <User className="w-4 h-4 mr-2" />
                  {t("sidebar.profile")}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={t("sidebar.settings")}
              isActive={isActive("/settings")}
            >
              <Link to="/settings">
                <Settings className="w-4 h-4 mr-2" />
                {t("sidebar.settings")}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="px-4 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 mb-2">
          <BookCopy className="w-4 h-4" />
          <span>
            {t("sidebar.currentRole")}:{" "}
            <span className="font-medium capitalize">{role}</span>
          </span>
        </div>
        <p>{t("sidebar.version")}</p>
      </SidebarFooter>
    </Sidebar>
  );
}
